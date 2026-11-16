/**
 * GitHub API Client
 * Low-level client for GitHub REST API v3 with timeout, rate-limiting inspection,
 * authentication headers, and comprehensive error handling.
 */

const githubConfig = require('../../config/githubConfig');

// Custom Error Classes
class GitHubAPIError extends Error {
    constructor(message, status = 500, details = null) {
        super(message);
        this.name = 'GitHubAPIError';
        this.status = status;
        this.details = details;
    }
}

class GitHubNotFoundError extends GitHubAPIError {
    constructor(resource) {
        super(`GitHub resource not found: ${resource}`, 404);
        this.name = 'GitHubNotFoundError';
    }
}

class GitHubRateLimitError extends GitHubAPIError {
    constructor(resetTime, remaining = 0, retryAfter = null) {
        const resetDate = resetTime ? new Date(resetTime * 1000).toISOString() : 'soon';
        super(`GitHub API rate limit exceeded. Resets at ${resetDate}${retryAfter ? ` (Retry after ${retryAfter}s)` : ''}`, 429, { resetTime, resetDate, remaining, retryAfter });
        this.name = 'GitHubRateLimitError';
        this.resetTime = resetTime;
        this.resetDate = resetDate;
        this.retryAfter = retryAfter;
    }
}

class GitHubTimeoutError extends GitHubAPIError {
    constructor(timeoutMs) {
        super(`GitHub API request timed out after ${timeoutMs}ms`, 504);
        this.name = 'GitHubTimeoutError';
    }
}

class GitHubUnavailableError extends GitHubAPIError {
    constructor(status = 503, message = 'GitHub API service temporarily unavailable') {
        super(message, status);
        this.name = 'GitHubUnavailableError';
    }
}

class GitHubClient {
    /**
     * @param {Object} [config]
     * @param {string} [config.baseUrl]
     * @param {string} [config.token]
     * @param {number} [config.timeoutMs]
     * @param {string} [config.userAgent]
     * @param {Function} [config.fetchImpl] - Optional custom fetch for testing
     */
    constructor(config = {}) {
        this.baseUrl = (config.baseUrl || githubConfig.apiBaseUrl).replace(/\/$/, '');
        this.token = config.token !== undefined ? config.token : githubConfig.token;
        this.timeoutMs = config.timeoutMs || githubConfig.timeoutMs;
        this.userAgent = config.userAgent || githubConfig.userAgent;
        this.fetch = config.fetchImpl || globalThis.fetch;
    }

    /**
     * Core HTTP request handler
     * @param {string} path - e.g. '/users/yihune1234/repos'
     * @param {Object} [options]
     * @param {Object} [options.params] - Query parameters
     * @param {Object} [options.headers] - Additional headers
     * @param {number} [options.timeoutMs] - Custom timeout override
     * @returns {Promise<{ data: any, rateLimit: Object, status: number }>}
     */
    async request(path, options = {}) {
        const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

        if (options.params) {
            Object.entries(options.params).forEach(([key, val]) => {
                if (val !== undefined && val !== null && val !== '') {
                    url.searchParams.append(key, String(val));
                }
            });
        }

        const cleanToken = this.token ? String(this.token).replace(/[\r\n\t\s]/g, '') : '';
        const validToken = cleanToken.startsWith('eyJ') ? '' : cleanToken;

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': this.userAgent,
            ...(validToken ? { 'Authorization': `Bearer ${validToken}` } : {}),
            ...(options.etag ? { 'If-None-Match': options.etag } : {}),
            ...options.headers
        };

        const timeout = options.timeoutMs || this.timeoutMs;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let response;
        try {
            response = await this.fetch(url.toString(), {
                method: options.method || 'GET',
                headers,
                signal: controller.signal
            });
        } catch (err) {
            if (err.name === 'AbortError' || err.code === 20) {
                throw new GitHubTimeoutError(timeout);
            }
            throw new GitHubAPIError(`Network error connecting to GitHub: ${err.message}`, 502, { original: err.message });
        } finally {
            clearTimeout(timeoutId);
        }

        // Extract rate limiting and response headers
        const retryAfter = response.headers.get('retry-after');
        const rateLimit = {
            limit: parseInt(response.headers.get('x-ratelimit-limit') || '0', 10),
            remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0', 10),
            reset: parseInt(response.headers.get('x-ratelimit-reset') || '0', 10),
            retryAfter: retryAfter ? parseInt(retryAfter, 10) : null
        };
        const responseEtag = response.headers.get('etag');

        // Handle HTTP 304 Not Modified
        if (response.status === 304) {
            return {
                data: null,
                notModified: true,
                status: 304,
                etag: responseEtag || options.etag,
                rateLimit
            };
        }

        // Handle rate limiting response (403 or 429 with rate limit message/header)
        if (response.status === 429 || (response.status === 403 && rateLimit.remaining === 0)) {
            throw new GitHubRateLimitError(rateLimit.reset, rateLimit.remaining, rateLimit.retryAfter);
        }

        let bodyText = '';
        try {
            bodyText = await response.text();
        } catch (e) {
            bodyText = '';
        }

        let parsedData = null;
        if (bodyText) {
            try {
                parsedData = JSON.parse(bodyText);
            } catch (e) {
                parsedData = bodyText;
            }
        }

        if (response.status === 404) {
            throw new GitHubNotFoundError(path);
        }

        if (response.status >= 500) {
            throw new GitHubUnavailableError(response.status, `GitHub server error: ${response.status}`);
        }

        if (!response.ok) {
            const errorMsg = parsedData?.message || response.statusText || 'GitHub API request failed';
            // Also check if GitHub returned rate limit message inside 403 body
            if (response.status === 403 && /rate limit/i.test(errorMsg)) {
                throw new GitHubRateLimitError(rateLimit.reset, rateLimit.remaining, rateLimit.retryAfter);
            }
            throw new GitHubAPIError(errorMsg, response.status, parsedData);
        }

        return {
            data: parsedData,
            status: response.status,
            etag: responseEtag,
            notModified: false,
            rateLimit
        };
    }

    /**
     * Fetch user profile: GET /users/:username
     */
    async getUser(username, options = {}) {
        return this.request(`/users/${encodeURIComponent(username)}`, options);
    }

    /**
     * Fetch user public repos: GET /users/:username/repos
     */
    async getUserRepos(username, params = {}, options = {}) {
        return this.request(`/users/${encodeURIComponent(username)}/repos`, {
            ...options,
            params: {
                type: 'public',
                sort: params.sort || 'updated',
                direction: params.direction || 'desc',
                page: params.page || 1,
                per_page: params.per_page || githubConfig.defaultPerPage
            }
        });
    }

    /**
     * Fetch user public activity: GET /users/:username/events/public
     */
    async getUserEvents(username, params = {}, options = {}) {
        return this.request(`/users/${encodeURIComponent(username)}/events/public`, {
            ...options,
            params: {
                page: params.page || 1,
                per_page: params.per_page || githubConfig.defaultPerPage
            }
        });
    }

    /**
     * Fetch organization profile: GET /orgs/:org
     */
    async getOrg(org, options = {}) {
        return this.request(`/orgs/${encodeURIComponent(org)}`, options);
    }

    /**
     * Fetch organization public repos: GET /orgs/:org/repos
     */
    async getOrgRepos(org, params = {}, options = {}) {
        return this.request(`/orgs/${encodeURIComponent(org)}/repos`, {
            ...options,
            params: {
                type: 'public',
                sort: params.sort || 'updated',
                direction: params.direction || 'desc',
                page: params.page || 1,
                per_page: params.per_page || githubConfig.defaultPerPage
            }
        });
    }

    /**
     * Fetch organization public activity: GET /orgs/:org/events
     */
    async getOrgEvents(org, params = {}, options = {}) {
        return this.request(`/orgs/${encodeURIComponent(org)}/events`, {
            ...options,
            params: {
                page: params.page || 1,
                per_page: params.per_page || githubConfig.defaultPerPage
            }
        });
    }

    /**
     * Check current rate limit: GET /rate_limit
     */
    async getRateLimit() {
        return this.request('/rate_limit');
    }
}

// Singleton export
const defaultClient = new GitHubClient();

module.exports = {
    GitHubClient,
    githubClient: defaultClient,
    GitHubAPIError,
    GitHubNotFoundError,
    GitHubRateLimitError,
    GitHubTimeoutError,
    GitHubUnavailableError
};
