/**
 * Automated Test Suite for GitHub Integration Module
 * Uses Node.js built-in test runner (node:test) and assertions (node:assert/strict).
 * Tests unit logic, caching, normalization, error handling, and mock API integration.
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Modules under test
const { GitHubCache } = require('../services/github/githubCache');
const {
    mapRepository,
    mapRepositories,
    mapProfile,
    mapEvent,
    mapEvents,
    createEventSummary
} = require('../services/github/githubMapper');
const {
    isValidGitHubHandle,
    validatePagination
} = require('../middleware/githubValidation');
const {
    GitHubClient,
    GitHubNotFoundError,
    GitHubRateLimitError,
    GitHubTimeoutError,
    GitHubUnavailableError
} = require('../services/github/githubClient');
const { GitHubService } = require('../services/github/githubService');

describe('GitHubCache', () => {
    let cache;

    beforeEach(() => {
        cache = new GitHubCache({ defaultTtlMs: 200, cleanupIntervalMs: 500 });
    });

    it('should store and retrieve values within TTL', () => {
        cache.set('key1', { foo: 'bar' });
        assert.deepEqual(cache.get('key1'), { foo: 'bar' });
        assert.equal(cache.has('key1'), true);
    });

    it('should return null and miss for non-existent keys', () => {
        assert.equal(cache.get('non-existent'), null);
        assert.equal(cache.has('non-existent'), false);
    });

    it('should expire keys after TTL', async () => {
        cache.set('temp', 'value', 50); // 50ms TTL
        assert.equal(cache.get('temp'), 'value');
        await new Promise(resolve => setTimeout(resolve, 80));
        assert.equal(cache.get('temp'), null);
        assert.equal(cache.has('temp'), false);
    });

    it('should delete keys and clear all', () => {
        cache.set('a', 1);
        cache.set('b', 2);
        assert.equal(cache.del('a'), true);
        assert.equal(cache.get('a'), null);
        assert.equal(cache.get('b'), 2);

        cache.clear();
        assert.equal(cache.get('b'), null);
    });

    it('should track cache statistics', () => {
        cache.set('statKey', 123);
        cache.get('statKey'); // hit
        cache.get('unknown'); // miss
        const stats = cache.getStats();
        assert.equal(stats.hits, 1);
        assert.equal(stats.misses, 1);
        assert.equal(stats.sets, 1);
    });
});

describe('GitHubMapper', () => {
    const rawRepo = {
        id: 101,
        name: 'my-cool-project',
        full_name: 'yihune1234/my-cool-project',
        description: 'A great test project',
        html_url: 'https://github.com/yihune1234/my-cool-project',
        homepage: 'https://coolproject.com',
        language: 'TypeScript',
        stargazers_count: 42,
        forks_count: 5,
        topics: ['portfolio', 'nodejs', 'react'],
        visibility: 'public',
        private: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-02T00:00:00Z',
        pushed_at: '2026-01-03T00:00:00Z',
        owner: {
            id: 1,
            login: 'yihune1234',
            avatar_url: 'https://avatars.githubusercontent.com/u/1',
            html_url: 'https://github.com/yihune1234',
            type: 'User'
        },
        fork: false,
        open_issues_count: 3,
        default_branch: 'main'
    };

    it('should map personal repository to normalized format', () => {
        const mapped = mapRepository(rawRepo, 'PERSONAL');

        assert.equal(mapped.id, 101);
        assert.equal(mapped.name, 'my-cool-project');
        assert.equal(mapped.full_name, 'yihune1234/my-cool-project');
        assert.equal(mapped.description, 'A great test project');
        assert.equal(mapped.html_url, 'https://github.com/yihune1234/my-cool-project');
        assert.equal(mapped.homepage, 'https://coolproject.com');
        assert.equal(mapped.primary_language, 'TypeScript');
        assert.equal(mapped.stars, 42);
        assert.equal(mapped.forks, 5);
        assert.deepEqual(mapped.topics, ['portfolio', 'nodejs', 'react']);
        assert.equal(mapped.visibility, 'public');
        assert.equal(mapped.created_at, '2026-01-01T00:00:00Z');
        assert.equal(mapped.updated_at, '2026-01-02T00:00:00Z');
        assert.equal(mapped.pushed_at, '2026-01-03T00:00:00Z');
        assert.equal(mapped.source_scope, 'PERSONAL');
        assert.deepEqual(mapped.owner, {
            id: 1,
            login: 'yihune1234',
            avatar_url: 'https://avatars.githubusercontent.com/u/1',
            html_url: 'https://github.com/yihune1234',
            type: 'User'
        });
    });

    it('should map organization repository with ORGANIZATION source scope', () => {
        const mapped = mapRepository({ ...rawRepo, full_name: 'AriitiMarket/platform' }, 'ORGANIZATION');
        assert.equal(mapped.source_scope, 'ORGANIZATION');
    });

    it('mapRepositories should strictly filter out private repositories', () => {
        const list = [
            rawRepo,
            { ...rawRepo, id: 102, private: true, visibility: 'private' },
            { ...rawRepo, id: 103, private: false, visibility: 'public' }
        ];

        const mappedList = mapRepositories(list, 'PERSONAL');
        assert.equal(mappedList.length, 2);
        assert.equal(mappedList.some(r => r.id === 102), false);
    });

    it('should map profile for user and organization correctly', () => {
        const rawUser = {
            id: 50,
            login: 'yihune1234',
            name: 'Yihune Belay',
            avatar_url: 'https://avatars.com/u/50',
            html_url: 'https://github.com/yihune1234',
            bio: 'Software Engineer',
            company: 'Tech Co',
            blog: 'https://yihune.dev',
            location: 'Ethiopia',
            email: 'yihune@example.com',
            public_repos: 15,
            followers: 20,
            following: 30,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
            type: 'User'
        };

        const mapped = mapProfile(rawUser, 'PERSONAL');
        assert.equal(mapped.login, 'yihune1234');
        assert.equal(mapped.source_scope, 'PERSONAL');
        assert.equal(mapped.public_repos, 15);

        const mappedOrg = mapProfile({ ...rawUser, type: 'Organization' }, 'ORGANIZATION');
        assert.equal(mappedOrg.source_scope, 'ORGANIZATION');
        assert.equal(mappedOrg.type, 'Organization');
    });

    it('should create human-readable event summaries and normalize event', () => {
        const rawEvent = {
            id: 'evt-1',
            type: 'PushEvent',
            created_at: '2026-03-01T12:00:00Z',
            actor: { id: 1, login: 'yihune1234', avatar_url: 'https://avatar' },
            repo: { id: 99, name: 'yihune1234/myportfolio' },
            payload: {
                size: 2,
                ref: 'refs/heads/main'
            }
        };

        const mapped = mapEvent(rawEvent, 'PERSONAL');
        assert.equal(mapped.id, 'evt-1');
        assert.equal(mapped.type, 'PushEvent');
        assert.equal(mapped.source_scope, 'PERSONAL');
        assert.equal(mapped.summary, 'yihune1234 pushed 2 commits to yihune1234/myportfolio on main');
    });
});

describe('GitHubValidation Middleware', () => {
    it('isValidGitHubHandle should accept valid GitHub usernames/orgs', () => {
        assert.equal(isValidGitHubHandle('yihune1234'), true);
        assert.equal(isValidGitHubHandle('AriitiMarket'), true);
        assert.equal(isValidGitHubHandle('Ethiopian-Cursor-Community'), true);
        assert.equal(isValidGitHubHandle('a-b-c'), true);
    });

    it('isValidGitHubHandle should reject invalid usernames', () => {
        assert.equal(isValidGitHubHandle('-badstart'), false);
        assert.equal(isValidGitHubHandle('badend-'), false);
        assert.equal(isValidGitHubHandle('has spaces'), false);
        assert.equal(isValidGitHubHandle(''), false);
        assert.equal(isValidGitHubHandle(null), false);
        assert.equal(isValidGitHubHandle('toolong'.repeat(10)), false);
    });

    it('validatePagination should set valid defaults', () => {
        const req = { query: {} };
        const res = {};
        let nextCalled = false;
        validatePagination(req, res, () => { nextCalled = true; });

        assert.equal(nextCalled, true);
        assert.equal(req.pagination.page, 1);
        assert.equal(req.pagination.per_page, 30);
    });

    it('validatePagination should reject invalid page or per_page', () => {
        const req = { query: { page: '0' } };
        let statusSent = null;
        let jsonSent = null;
        const res = {
            status: (s) => {
                statusSent = s;
                return { json: (d) => { jsonSent = d; } };
            }
        };

        validatePagination(req, res, () => {});
        assert.equal(statusSent, 400);
        assert.match(jsonSent.message, /page/);
    });
});

describe('GitHubClient Error Handling', () => {
    it('should throw GitHubNotFoundError on 404', async () => {
        const mockFetch = async () => ({
            ok: false,
            status: 404,
            headers: new Map(),
            text: async () => JSON.stringify({ message: 'Not Found' })
        });

        const client = new GitHubClient({ fetchImpl: mockFetch });
        await assert.rejects(
            () => client.getUser('non-existent-user-xyz'),
            (err) => err instanceof GitHubNotFoundError
        );
    });

    it('should throw GitHubRateLimitError on 403 rate limit', async () => {
        const mockFetch = async () => ({
            ok: false,
            status: 403,
            headers: new Map([
                ['x-ratelimit-remaining', '0'],
                ['x-ratelimit-reset', '1700000000']
            ]),
            text: async () => JSON.stringify({ message: 'API rate limit exceeded' })
        });

        const client = new GitHubClient({ fetchImpl: mockFetch });
        await assert.rejects(
            () => client.getUser('yihune1234'),
            (err) => err instanceof GitHubRateLimitError && err.status === 429
        );
    });

    it('should throw GitHubUnavailableError on 500/503', async () => {
        const mockFetch = async () => ({
            ok: false,
            status: 503,
            headers: new Map(),
            text: async () => 'Service Unavailable'
        });

        const client = new GitHubClient({ fetchImpl: mockFetch });
        await assert.rejects(
            () => client.getUser('yihune1234'),
            (err) => err instanceof GitHubUnavailableError && err.status === 503
        );
    });
});

describe('GitHubService Fault Isolation & Aggregation', () => {
    it('getOverview should succeed with personal data even if organization fails', async () => {
        const mockClient = {
            getUser: async () => ({
                data: {
                    id: 1,
                    login: 'yihune1234',
                    name: 'Yihune Belay',
                    public_repos: 2,
                    type: 'User'
                },
                rateLimit: { remaining: 50 }
            }),
            getUserRepos: async () => ({
                data: [
                    {
                        id: 101,
                        name: 'repo1',
                        full_name: 'yihune1234/repo1',
                        language: 'JavaScript',
                        stargazers_count: 10,
                        forks_count: 2,
                        private: false,
                        visibility: 'public'
                    }
                ],
                rateLimit: { remaining: 50 }
            }),
            getUserEvents: async () => ({ data: [], rateLimit: { remaining: 50 } }),
            // Organization endpoints simulate failure
            getOrg: async () => { throw new GitHubNotFoundError('AriitiMarket'); },
            getOrgRepos: async () => { throw new GitHubNotFoundError('AriitiMarket'); },
            getOrgEvents: async () => { throw new GitHubNotFoundError('AriitiMarket'); }
        };

        const testCache = new GitHubCache();
        const service = new GitHubService({
            client: mockClient,
            cache: testCache,
            config: { username: 'yihune1234', org: 'AriitiMarket', cacheTtlMs: 5000 }
        });

        const overview = await service.getOverview({ forceRefresh: true });

        // Personal succeeded
        assert.equal(overview.status.personal, 'ok');
        assert.equal(overview.accounts.personal.login, 'yihune1234');
        assert.equal(overview.metrics.personal_public_repos, 2);
        assert.equal(overview.metrics.total_stars, 10);

        // Organization gracefully handled as error without crashing the endpoint
        assert.equal(overview.status.organization, 'error');
        assert.equal(overview.accounts.organization, null);
    });

    it('getOverview should handle missing organization as unconfigured', async () => {
        const mockClient = {
            getUser: async () => ({
                data: { id: 1, login: 'yihune1234', public_repos: 5, type: 'User' },
                rateLimit: {}
            }),
            getUserRepos: async () => ({ data: [], rateLimit: {} }),
            getUserEvents: async () => ({ data: [], rateLimit: {} })
        };

        const testCache = new GitHubCache();
        const service = new GitHubService({
            client: mockClient,
            cache: testCache,
            config: { username: 'yihune1234', org: '', cacheTtlMs: 5000 }
        });

        const overview = await service.getOverview({ forceRefresh: true });
        assert.equal(overview.status.personal, 'ok');
        assert.equal(overview.status.organization, 'unconfigured');
    });
});
