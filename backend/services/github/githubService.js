/**
 * GitHub Integration Service
 * High-level orchestration for GitHub data retrieval, caching, normalization,
 * aggregation, and fault-tolerant partial failure handling.
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
     */
    constructor(options = {}) {
        this.client = options.client || githubClient;
        this.cache = options.cache || githubCache;
        this.config = options.config || githubConfig;
    }

    /**
     * Retrieve personal GitHub profile
     */
    async getPersonalProfile(options = {}) {
        const username = this.config.username;
        if (!isValidGitHubHandle(username)) {
            throw new Error(`Invalid GitHub personal username configured: "${username}"`);
        }

        const cacheKey = `github:personal:profile:${username}`;
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { data: cached, cached: true };
        }

        const response = await this.client.getUser(username);
        const mapped = mapProfile(response.data, 'PERSONAL');
        this.cache.set(cacheKey, mapped, this.config.cacheTtlMs);

        return { data: mapped, cached: false, rateLimit: response.rateLimit };
    }

    /**
     * Retrieve personal public repositories
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
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { ...cached, cached: true };
        }

        const response = await this.client.getUserRepos(username, { page, per_page: perPage, sort, direction });
        const repos = mapRepositories(response.data, 'PERSONAL');

        const result = {
            repos,
            pagination: {
                page,
                per_page: perPage,
                count: repos.length,
                sort,
                direction
            },
            rateLimit: response.rateLimit,
            cached: false
        };

        this.cache.set(cacheKey, result, this.config.cacheTtlMs);
        return result;
    }

    /**
     * Retrieve personal public activity
     */
    async getPersonalActivity(pagination = {}, options = {}) {
        const username = this.config.username;
        if (!isValidGitHubHandle(username)) {
            throw new Error(`Invalid GitHub personal username configured: "${username}"`);
        }

        const page = pagination.page || 1;
        const perPage = pagination.per_page || this.config.defaultPerPage;

        const cacheKey = `github:personal:activity:${username}:${page}:${perPage}`;
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { ...cached, cached: true };
        }

        const response = await this.client.getUserEvents(username, { page, per_page: perPage });
        const activity = mapEvents(response.data, 'PERSONAL');

        const result = {
            activity,
            pagination: {
                page,
                per_page: perPage,
                count: activity.length
            },
            rateLimit: response.rateLimit,
            cached: false
        };

        this.cache.set(cacheKey, result, this.config.cacheTtlMs);
        return result;
    }

    /**
     * Retrieve organization profile
     */
    async getOrgProfile(options = {}) {
        const org = this.config.org;
        if (!org || !isValidGitHubHandle(org)) {
            throw new GitHubNotFoundError(org || 'undefined organization');
        }

        const cacheKey = `github:org:profile:${org}`;
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { data: cached, cached: true };
        }

        const response = await this.client.getOrg(org);
        const mapped = mapProfile(response.data, 'ORGANIZATION');
        this.cache.set(cacheKey, mapped, this.config.cacheTtlMs);

        return { data: mapped, cached: false, rateLimit: response.rateLimit };
    }

    /**
     * Retrieve organization public repositories
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
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { ...cached, cached: true };
        }

        const response = await this.client.getOrgRepos(org, { page, per_page: perPage, sort, direction });
        const repos = mapRepositories(response.data, 'ORGANIZATION');

        const result = {
            repos,
            pagination: {
                page,
                per_page: perPage,
                count: repos.length,
                sort,
                direction
            },
            rateLimit: response.rateLimit,
            cached: false
        };

        this.cache.set(cacheKey, result, this.config.cacheTtlMs);
        return result;
    }

    /**
     * Retrieve organization public activity
     */
    async getOrgActivity(pagination = {}, options = {}) {
        const org = this.config.org;
        if (!org || !isValidGitHubHandle(org)) {
            throw new GitHubNotFoundError(org || 'undefined organization');
        }

        const page = pagination.page || 1;
        const perPage = pagination.per_page || this.config.defaultPerPage;

        const cacheKey = `github:org:activity:${org}:${page}:${perPage}`;
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { ...cached, cached: true };
        }

        const response = await this.client.getOrgEvents(org, { page, per_page: perPage });
        const activity = mapEvents(response.data, 'ORGANIZATION');

        const result = {
            activity,
            pagination: {
                page,
                per_page: perPage,
                count: activity.length
            },
            rateLimit: response.rateLimit,
            cached: false
        };

        this.cache.set(cacheKey, result, this.config.cacheTtlMs);
        return result;
    }

    /**
     * Aggregated portfolio overview
     * Resilient to partial failure: if personal fails or org fails, the other is preserved.
     */
    async getOverview(options = {}) {
        const cacheKey = `github:overview:${this.config.username}:${this.config.org || 'none'}`;
        if (!options.forceRefresh) {
            const cached = this.cache.get(cacheKey);
            if (cached) return { ...cached, cached: true };
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
            generated_at: new Date().toISOString(),
            cached: false
        };

        this.cache.set(cacheKey, overview, this.config.cacheTtlMs);
        return overview;
    }
}

// Default singleton instance
const defaultService = new GitHubService();

module.exports = {
    GitHubService,
    githubService: defaultService
};
