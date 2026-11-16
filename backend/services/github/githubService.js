/**
 * GitHub Integration Service
 * High-level orchestration for GitHub data retrieval, smart caching, conditional requests (ETags),
 * aggregation, fault-tolerant partial failure handling, and webhook cache invalidation.
 */

const githubConfig = require('../../config/githubConfig');
const { githubClient, GitHubNotFoundError } = require('./githubClient');
const { githubCache } = require('./githubCache');
const {
    mapRepository,
    mapRepositories,
    mapProfile,
    mapEvent,
    mapEvents
} = require('./githubMapper');
const { isValidGitHubHandle } = require('../../middleware/githubValidation');

class GitHubService {
    /**
     * @param {Object} [options]
     * @param {Object} [options.client]
     * @param {Object} [options.cache]
     * @param {Object} [options.config]
     * @param {Object} [options.scheduler]
     */
    constructor(options = {}) {
        this.client = options.client || githubClient;
        this.cache = options.cache || githubCache;
        this.config = options.config || githubConfig;
        this.scheduler = options.scheduler || null; // Injected or referenced later
    }

    /**
     * Update active usernames dynamically from database or admin input
     */
    updateConfig({ username, org }) {
        if (username !== undefined && username.trim()) {
            this.config.username = username.trim();
        }
        if (org !== undefined) {
            this.config.org = org.trim();
        }
    }

    /**
     * Helper to perform conditional fetch with ETag support and smart cache management
     * @private
     */
    async _fetchWithCache({
        cacheKey,
        ttlMs,
        forceRefresh,
        fetchFn,
        mapFn,
        allowStale = true
    }) {
        const existing = this.cache.getEntry(cacheKey, { allowStale: true });

        // 1. Return fresh cache hit if not expired and not force refreshed
        if (existing && !existing.metadata.is_expired && !forceRefresh) {
            return {
                data: existing.value,
                cached: true,
                cache_status: 'HIT',
                last_synchronized_at: existing.metadata.last_synchronized_at,
                last_successful_update: existing.metadata.last_successful_update
            };
        }

        // 2. Prepare request with ETag (conditional request If-None-Match)
        const fetchOptions = {
            etag: existing?.metadata?.etag || null
        };

        try {
            const response = await fetchFn(fetchOptions);

            // Handle HTTP 304 Not Modified
            if (response.notModified && existing) {
                this.cache.touch(cacheKey, ttlMs, response.etag);
                return {
                    data: existing.value,
                    cached: true,
                    cache_status: 'NOT_MODIFIED_304',
                    last_synchronized_at: new Date().toISOString(),
                    last_successful_update: existing.metadata.last_successful_update,
                    rateLimit: response.rateLimit
                };
            }

            // Map and store new data
            const mapped = mapFn(response.data);
            const nowIso = new Date().toISOString();

            this.cache.set(cacheKey, mapped, ttlMs, {
                etag: response.etag,
                last_successful_update: nowIso
            });

            return {
                data: mapped,
                cached: false,
                cache_status: 'MISS',
                last_synchronized_at: nowIso,
                last_successful_update: nowIso,
                rateLimit: response.rateLimit
            };
        } catch (err) {
            // Serve stale data if external API fails but we have cached data
            if (allowStale && existing?.value) {
                console.warn(`⚠️  [GitHubService] Request failed for ${cacheKey}. Serving stale cache: ${err.message}`);
                return {
                    data: existing.value,
                    cached: true,
                    cache_status: 'STALE',
                    stale: true,
                    last_synchronized_at: existing.metadata.last_synchronized_at,
                    last_successful_update: existing.metadata.last_successful_update,
                    warning: err.message
                };
            }
            throw err;
        }
    }

    /**
     * Retrieve personal GitHub profile
     * Default TTL: 30 minutes
     */
    async getPersonalProfile(options = {}) {
        const username = this.config.username;
        if (!isValidGitHubHandle(username)) {
            throw new Error(`Invalid GitHub personal username configured: "${username}"`);
        }

        const cacheKey = `github:personal:profile:${username}`;
        const ttlMs = this.config.ttlProfileMs;

        return this._fetchWithCache({
            cacheKey,
            ttlMs,
            forceRefresh: options.forceRefresh,
            fetchFn: (opt) => this.client.getUser(username, opt),
            mapFn: (data) => mapProfile(data, 'PERSONAL')
        });
    }

    /**
     * Retrieve personal public repositories
     * Default TTL: 15 minutes
     */
    async getPersonalRepos(pagination = {}, options = {}) {
        const username = this.config.username;
        if (!isValidGitHubHandle(username)) {
            throw new Error(`Invalid GitHub personal username configured: "${username}"`);
        }

        const page = pagination.page || 1;
        const perPage = pagination.per_page || this.config.defaultPerPage;
        const sort = pagination.sort || 'updated';
        const direction = pagination.direction || 'desc';

        const cacheKey = `github:personal:repos:${username}:${page}:${perPage}:${sort}:${direction}`;
        const ttlMs = this.config.ttlReposMs;

        const result = await this._fetchWithCache({
            cacheKey,
            ttlMs,
            forceRefresh: options.forceRefresh,
            fetchFn: (opt) => this.client.getUserRepos(username, { page, per_page: perPage, sort, direction }, opt),
            mapFn: (data) => mapRepositories(data, 'PERSONAL')
        });

        return {
            repos: result.data,
            pagination: {
                page,
                per_page: perPage,
                count: result.data ? result.data.length : 0,
                sort,
                direction
            },
            cached: result.cached,
            cache_status: result.cache_status,
            last_synchronized_at: result.last_synchronized_at,
            last_successful_update: result.last_successful_update,
            rateLimit: result.rateLimit
        };
    }

    /**
     * Retrieve personal public activity
     * Default TTL: 5 minutes
     */
    async getPersonalActivity(pagination = {}, options = {}) {
        const username = this.config.username;
        if (!isValidGitHubHandle(username)) {
            throw new Error(`Invalid GitHub personal username configured: "${username}"`);
        }

        const page = pagination.page || 1;
        const perPage = pagination.per_page || this.config.defaultPerPage;

        const cacheKey = `github:personal:activity:${username}:${page}:${perPage}`;
        const ttlMs = this.config.ttlActivityMs;

        const result = await this._fetchWithCache({
            cacheKey,
            ttlMs,
            forceRefresh: options.forceRefresh,
            fetchFn: (opt) => this.client.getUserEvents(username, { page, per_page: perPage }, opt),
            mapFn: (data) => mapEvents(data, 'PERSONAL')
        });

        return {
            activity: result.data,
            pagination: {
                page,
                per_page: perPage,
                count: result.data ? result.data.length : 0
            },
            cached: result.cached,
            cache_status: result.cache_status,
            last_synchronized_at: result.last_synchronized_at,
            last_successful_update: result.last_successful_update,
            rateLimit: result.rateLimit
        };
    }

    /**
     * Retrieve organization profile
     * Default TTL: 30 minutes
     */
    async getOrgProfile(options = {}) {
        const org = this.config.org;
        if (!org || !isValidGitHubHandle(org)) {
            throw new GitHubNotFoundError(org || 'undefined organization');
        }

        const cacheKey = `github:org:profile:${org}`;
        const ttlMs = this.config.ttlProfileMs;

        return this._fetchWithCache({
            cacheKey,
            ttlMs,
            forceRefresh: options.forceRefresh,
            fetchFn: (opt) => this.client.getOrg(org, opt),
            mapFn: (data) => mapProfile(data, 'ORGANIZATION')
        });
    }

    /**
     * Retrieve organization public repositories
     * Default TTL: 15 minutes
     */
    async getOrgRepos(pagination = {}, options = {}) {
        const org = this.config.org;
        if (!org || !isValidGitHubHandle(org)) {
            throw new GitHubNotFoundError(org || 'undefined organization');
        }

        const page = pagination.page || 1;
        const perPage = pagination.per_page || this.config.defaultPerPage;
        const sort = pagination.sort || 'updated';
        const direction = pagination.direction || 'desc';

        const cacheKey = `github:org:repos:${org}:${page}:${perPage}:${sort}:${direction}`;
        const ttlMs = this.config.ttlReposMs;

        const result = await this._fetchWithCache({
            cacheKey,
            ttlMs,
            forceRefresh: options.forceRefresh,
            fetchFn: (opt) => this.client.getOrgRepos(org, { page, per_page: perPage, sort, direction }, opt),
            mapFn: (data) => mapRepositories(data, 'ORGANIZATION')
        });

        return {
            repos: result.data,
            pagination: {
                page,
                per_page: perPage,
                count: result.data ? result.data.length : 0,
                sort,
                direction
            },
            cached: result.cached,
            cache_status: result.cache_status,
            last_synchronized_at: result.last_synchronized_at,
            last_successful_update: result.last_successful_update,
            rateLimit: result.rateLimit
        };
    }

    /**
     * Retrieve organization public activity
     * Default TTL: 5 minutes
     */
    async getOrgActivity(pagination = {}, options = {}) {
        const org = this.config.org;
        if (!org || !isValidGitHubHandle(org)) {
            throw new GitHubNotFoundError(org || 'undefined organization');
        }

        const page = pagination.page || 1;
        const perPage = pagination.per_page || this.config.defaultPerPage;

        const cacheKey = `github:org:activity:${org}:${page}:${perPage}`;
        const ttlMs = this.config.ttlActivityMs;

        const result = await this._fetchWithCache({
            cacheKey,
            ttlMs,
            forceRefresh: options.forceRefresh,
            fetchFn: (opt) => this.client.getOrgEvents(org, { page, per_page: perPage }, opt),
            mapFn: (data) => mapEvents(data, 'ORGANIZATION')
        });

        return {
            activity: result.data,
            pagination: {
                page,
                per_page: perPage,
                count: result.data ? result.data.length : 0
            },
            cached: result.cached,
            cache_status: result.cache_status,
            last_synchronized_at: result.last_synchronized_at,
            last_successful_update: result.last_successful_update,
            rateLimit: result.rateLimit
        };
    }

    /**
     * Aggregated portfolio overview
     * Default TTL: 5 minutes
     * Resilient to partial failure: if personal fails or org fails, the other is preserved.
     */
    async getOverview(options = {}) {
        const cacheKey = `github:overview:${this.config.username}:${this.config.org || 'none'}`;
        const existing = this.cache.getEntry(cacheKey, { allowStale: true });

        if (existing && !existing.metadata.is_expired && !options.forceRefresh) {
            return {
                ...existing.value,
                cached: true,
                cache_status: 'HIT',
                last_synchronized_at: existing.metadata.last_synchronized_at,
                last_successful_update: existing.metadata.last_successful_update
            };
        }

        // Parallel requests using Promise.allSettled for fault isolation
        const tasks = [
            this.getPersonalProfile(options).catch(err => ({ error: err.message, status: err.status || 500 })),
            this.getPersonalRepos({ per_page: 100 }, options).catch(err => ({ error: err.message, status: err.status || 500 })),
            this.getPersonalActivity({ per_page: 10 }, options).catch(err => ({ error: err.message, status: err.status || 500 }))
        ];

        const hasOrg = Boolean(this.config.org && isValidGitHubHandle(this.config.org));
        if (hasOrg) {
            tasks.push(
                this.getOrgProfile(options).catch(err => ({ error: err.message, status: err.status || 500 })),
                this.getOrgRepos({ per_page: 100 }, options).catch(err => ({ error: err.message, status: err.status || 500 })),
                this.getOrgActivity({ per_page: 10 }, options).catch(err => ({ error: err.message, status: err.status || 500 }))
            );
        }

        const [
            personalProfileRes,
            personalReposRes,
            personalActivityRes,
            orgProfileRes,
            orgReposRes,
            orgActivityRes
        ] = await Promise.all(tasks);

        // Process Personal section
        const personalStatus = personalProfileRes.error ? 'error' : 'ok';
        const personalProfile = personalProfileRes.data || null;
        const personalRepos = personalReposRes.repos || [];
        const personalActivity = personalActivityRes.activity || [];

        // Process Organization section
        let orgStatus = 'unconfigured';
        let orgProfile = null;
        let orgRepos = [];
        let orgActivity = [];

        if (hasOrg) {
            orgStatus = orgProfileRes?.error ? 'error' : 'ok';
            orgProfile = orgProfileRes?.data || null;
            orgRepos = orgReposRes?.repos || [];
            orgActivity = orgActivityRes?.activity || [];
        }

        // Aggregate statistics across public repos
        const allRepos = [...personalRepos, ...orgRepos];
        const totalStars = allRepos.reduce((acc, r) => acc + (r.stars || 0), 0);
        const totalForks = allRepos.reduce((acc, r) => acc + (r.forks || 0), 0);

        // Language breakdown
        const languageMap = {};
        allRepos.forEach(repo => {
            if (repo.primary_language) {
                languageMap[repo.primary_language] = (languageMap[repo.primary_language] || 0) + 1;
            }
        });

        const topLanguages = Object.entries(languageMap)
            .map(([language, count]) => ({
                language,
                count,
                percentage: allRepos.length > 0 ? Math.round((count / allRepos.length) * 100) : 0
            }))
            .sort((a, b) => b.count - a.count);

        // Featured repositories (top starred, then most recently updated)
        const featuredRepos = [...allRepos]
            .sort((a, b) => (b.stars - a.stars) || new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
            .slice(0, 6);

        // Merged recent activity sorted chronologically
        const recentActivity = [...personalActivity, ...orgActivity]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10);

        const nowIso = new Date().toISOString();
        const overview = {
            status: {
                personal: personalStatus,
                organization: orgStatus,
                ...(personalProfileRes.error ? { personal_error: personalProfileRes.error } : {}),
                ...(orgProfileRes?.error ? { organization_error: orgProfileRes.error } : {})
            },
            accounts: {
                personal: personalProfile,
                organization: orgProfile
            },
            metrics: {
                total_public_repos: (personalProfile?.public_repos || personalRepos.length) + (orgProfile?.public_repos || orgRepos.length),
                personal_public_repos: personalProfile?.public_repos || personalRepos.length,
                organization_public_repos: orgProfile?.public_repos || orgRepos.length,
                total_stars: totalStars,
                total_forks: totalForks,
                top_languages: topLanguages
            },
            featured_repos: featuredRepos,
            recent_activity: recentActivity,
            last_synchronized_at: nowIso,
            last_successful_update: nowIso,
            cached: false,
            cache_status: 'MISS'
        };

        this.cache.set(cacheKey, overview, this.config.ttlOverviewMs, {
            last_successful_update: nowIso
        });

        return overview;
    }

    /**
     * Retrieve aggregated language byte counts from repository language endpoints
     * @param {Object} [options]
     * @param {'ALL'|'PERSONAL'|'ORGANIZATION'} [options.scope='ALL']
     * @param {boolean} [options.forceRefresh=false]
     */
    async getLanguages(options = {}) {
        const scope = (options.scope || 'ALL').toUpperCase();
        const cacheKey = `github:languages:${scope}:${this.config.username}:${this.config.org || 'none'}`;

        if (!options.forceRefresh) {
            const cached = this.cache.getEntry(cacheKey);
            if (cached) return { ...cached.value, cached: true };
        }

        // 1. Gather repositories for scope
        let repos = [];
        if (scope === 'PERSONAL' || scope === 'ALL') {
            try {
                const personal = await this.getPersonalRepos({ per_page: 100 });
                repos.push(...(personal.repos || []));
            } catch (e) {
                console.warn('[GitHubService] Could not fetch personal repos for languages:', e.message);
            }
        }
        if ((scope === 'ORGANIZATION' || scope === 'ALL') && this.config.org) {
            try {
                const org = await this.getOrgRepos({ per_page: 100 });
                repos.push(...(org.repos || []));
            } catch (e) {
                console.warn('[GitHubService] Could not fetch org repos for languages:', e.message);
            }
        }

        // De-duplicate repos by ID
        const uniqueRepos = Array.from(new Map(repos.map(r => [r.id, r])).values());

        // 2. Fetch language bytes for each repository
        const languageByteMap = {};
        let totalBytes = 0;
        let emptyReposCount = 0;

        await Promise.all(uniqueRepos.map(async (repo) => {
            const repoCacheKey = `github:repo:languages:${repo.id}`;
            let langData = this.cache.get(repoCacheKey);

            if (!langData) {
                try {
                    const owner = repo.owner?.login || this.config.username;
                    const res = await this.client.request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/languages`);
                    langData = res.data || {};
                    this.cache.set(repoCacheKey, langData, 2 * 60 * 60 * 1000); // 2 hr sub-cache
                } catch (e) {
                    langData = {};
                }
            }

            const entries = Object.entries(langData);
            if (entries.length === 0) {
                emptyReposCount++;
            } else {
                for (const [lang, bytes] of entries) {
                    if (typeof bytes === 'number' && bytes > 0) {
                        languageByteMap[lang] = (languageByteMap[lang] || 0) + bytes;
                        totalBytes += bytes;
                    }
                }
            }
        }));

        function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        const languages = Object.entries(languageByteMap)
            .map(([language, bytes]) => {
                const percentage = totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(1)) : 0;
                return {
                    language,
                    bytes,
                    formatted_bytes: formatBytes(bytes),
                    percentage
                };
            })
            .sort((a, b) => b.bytes - a.bytes);

        const result = {
            scope,
            languages,
            total_bytes: totalBytes,
            formatted_total_bytes: formatBytes(totalBytes),
            repos_analyzed: uniqueRepos.length,
            empty_repos_count: emptyReposCount,
            methodology: "Calculated from GitHub REST API language analysis byte counts (/repos/{owner}/{repo}/languages) across unique public repositories in the selected scope.",
            generated_at: new Date().toISOString(),
            cached: false
        };

        this.cache.set(cacheKey, result, 30 * 60 * 1000);
        return result;
    }

    /**
     * Invalidate caches affected by a webhook event
     * @param {string} event - e.g. 'push', 'repository', 'release'
     * @param {Object} payload - GitHub event payload
     * @returns {Object} invalidation summary
     */
    handleWebhookEvent(event, payload = {}) {
        const repoOwner = payload.repository?.owner?.login || payload.organization?.login || '';
        const repoName = payload.repository?.name || '';
        const scopes = [];

        if (repoOwner.toLowerCase() === this.config.username.toLowerCase()) {
            this.cache.invalidateScope('PERSONAL');
            scopes.push('PERSONAL');
        } else if (this.config.org && repoOwner.toLowerCase() === this.config.org.toLowerCase()) {
            this.cache.invalidateScope('ORGANIZATION');
            scopes.push('ORGANIZATION');
        } else {
            // General invalidation for overview
            this.cache.delPattern('github:overview');
            scopes.push('OVERVIEW');
        }

        console.log(`📡 [GitHubWebhook] Processed event "${event}" on ${repoOwner}/${repoName}. Invalidated: ${scopes.join(', ')}`);

        return {
            event,
            repository: payload.repository?.full_name || null,
            invalidated_scopes: scopes,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Aggregated monitoring and health status endpoint
     * @returns {Promise<Object>}
     */
    async getHealth() {
        const personalEntry = this.cache.getEntry(`github:personal:profile:${this.config.username}`, { allowStale: true });
        const orgEntry = this.config.org ? this.cache.getEntry(`github:org:profile:${this.config.org}`, { allowStale: true }) : null;

        let rateLimitData = null;
        try {
            const rlRes = await this.client.getRateLimit();
            rateLimitData = rlRes.data?.rate || null;
        } catch (e) {
            // Safe fallback if rate limit check fails
        }

        const schedulerStatus = this.scheduler ? this.scheduler.getStatus() : {
            enabled: this.config.syncEnabled,
            status: this.config.syncEnabled ? 'idle' : 'disabled'
        };

        const personalOk = !personalEntry?.value || !personalEntry.metadata.is_expired;
        const overallStatus = personalOk ? 'healthy' : 'degraded';

        return {
            status: overallStatus,
            sources: {
                personal: {
                    username: this.config.username,
                    status: 'ok',
                    last_synchronized: personalEntry?.metadata?.last_synchronized_at || null,
                    last_successful_update: personalEntry?.metadata?.last_successful_update || null
                },
                organization: {
                    name: this.config.org || null,
                    status: this.config.org ? 'ok' : 'unconfigured',
                    last_synchronized: orgEntry?.metadata?.last_synchronized_at || null,
                    last_successful_update: orgEntry?.metadata?.last_successful_update || null
                }
            },
            scheduler: schedulerStatus,
            cache: {
                ...this.cache.getStats(),
                ttls: {
                    profile_ms: this.config.ttlProfileMs,
                    repos_ms: this.config.ttlReposMs,
                    activity_ms: this.config.ttlActivityMs,
                    overview_ms: this.config.ttlOverviewMs
                }
            },
            rate_limit: rateLimitData ? {
                limit: rateLimitData.limit,
                remaining: rateLimitData.remaining,
                reset: rateLimitData.reset,
                reset_at: new Date(rateLimitData.reset * 1000).toISOString()
            } : null,
            webhook: {
                configured: this.config.webhookEnabled,
                deliveries_tracked: this.cache.deliveries.size
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Default singleton instance
const defaultService = new GitHubService();

module.exports = {
    GitHubService,
    githubService: defaultService
};
