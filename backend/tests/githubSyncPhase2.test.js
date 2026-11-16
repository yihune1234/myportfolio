/**
 * Automated Test Suite for Phase 2: Automatic GitHub Synchronization & Smart Caching
 * Tests:
 * - Smart Caching (metadata, TTLs, touch, stale fallback)
 * - Conditional Requests (ETags, If-None-Match, HTTP 304 Not Modified)
 * - Scheduled Synchronization (non-overlapping execution, error resilience)
 * - Webhook Integration (HMAC-SHA256 signature, deduplication, cache invalidation)
 * - Health Monitoring Endpoint (/api/github/health)
 */

require('dotenv').config();
process.env.GITHUB_WEBHOOK_SECRET = 'test_webhook_secret_key_123';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const express = require('express');

const { GitHubCache } = require('../services/github/githubCache');
const { GitHubClient } = require('../services/github/githubClient');
const { GitHubService } = require('../services/github/githubService');
const { GitHubScheduler } = require('../services/github/githubScheduler');
const { verifyWebhookSignature } = require('../middleware/githubWebhook');
const githubRoutes = require('../routes/githubRoutes');

describe('Phase 2: Smart Caching & Metadata', () => {
    let cache;

    beforeEach(() => {
        cache = new GitHubCache({ defaultTtlMs: 200, cleanupIntervalMs: 500 });
    });

    it('should store and retrieve metadata alongside value', () => {
        const now = new Date().toISOString();
        cache.set('test:profile', { username: 'yihune1234' }, 5000, {
            etag: 'W/"12345"',
            last_successful_update: now
        });

        const entry = cache.getEntry('test:profile');
        assert.ok(entry);
        assert.deepEqual(entry.value, { username: 'yihune1234' });
        assert.equal(entry.metadata.etag, 'W/"12345"');
        assert.equal(entry.metadata.cache_status, 'HIT');
        assert.equal(entry.metadata.is_expired, false);
        assert.ok(entry.metadata.last_synchronized_at);
        assert.equal(entry.metadata.last_successful_update, now);
    });

    it('touch() should refresh TTL and last_synchronized_at without changing data', async () => {
        cache.set('test:touch', { count: 1 }, 100, { etag: '"v1"' });
        await new Promise(r => setTimeout(r, 40));

        const original = cache.getEntry('test:touch');
        const originalExpiry = original.metadata.expiresAt;

        // Touch with new TTL
        const touched = cache.touch('test:touch', 300, '"v2"');
        assert.equal(touched, true);

        const updated = cache.getEntry('test:touch');
        assert.ok(updated.metadata.expiresAt > originalExpiry);
        assert.equal(updated.metadata.etag, '"v2"');
        assert.deepEqual(updated.value, { count: 1 });
    });

    it('should allow retrieving stale entry when allowStale=true', async () => {
        cache.set('stale:test', 'hello', 40);
        await new Promise(r => setTimeout(r, 60));

        // Normal get should return null
        assert.equal(cache.get('stale:test'), null);

        // getEntry with allowStale should return stale value
        const staleEntry = cache.getEntry('stale:test', { allowStale: true });
        assert.ok(staleEntry);
        assert.equal(staleEntry.value, 'hello');
        assert.equal(staleEntry.metadata.is_expired, true);
        assert.equal(staleEntry.metadata.cache_status, 'STALE');
    });

    it('delPattern() and invalidateScope() should delete targeted cache keys', () => {
        cache.set('github:personal:repos:1', [1]);
        cache.set('github:personal:activity:1', [2]);
        cache.set('github:org:repos:1', [3]);
        cache.set('github:overview:1', {});

        // Invalidate personal scope
        const deleted = cache.invalidateScope('PERSONAL');
        assert.equal(deleted, 3); // repos, activity, overview

        assert.equal(cache.get('github:personal:repos:1'), null);
        assert.equal(cache.get('github:personal:activity:1'), null);
        assert.equal(cache.get('github:overview:1'), null);
        // Organization repo should remain intact
        assert.deepEqual(cache.get('github:org:repos:1'), [3]);
    });
});

describe('Phase 2: Conditional Requests & ETags', () => {
    it('GitHubClient should send If-None-Match when etag is provided', async () => {
        let sentHeaders = null;
        const mockFetch = async (url, options) => {
            sentHeaders = options.headers;
            return {
                ok: true,
                status: 200,
                headers: new Map([
                    ['etag', '"new-etag-999"'],
                    ['x-ratelimit-limit', '60'],
                    ['x-ratelimit-remaining', '55'],
                    ['x-ratelimit-reset', '1800000000']
                ]),
                text: async () => JSON.stringify({ login: 'yihune1234' })
            };
        };

        const client = new GitHubClient({ fetchImpl: mockFetch });
        const res = await client.getUser('yihune1234', { etag: '"cached-etag-123"' });

        assert.equal(sentHeaders['If-None-Match'], '"cached-etag-123"');
        assert.equal(res.etag, '"new-etag-999"');
        assert.equal(res.notModified, false);
    });

    it('GitHubClient should handle HTTP 304 Not Modified correctly', async () => {
        const mockFetch = async () => ({
            ok: false,
            status: 304,
            headers: new Map([
                ['etag', '"cached-etag-123"'],
                ['x-ratelimit-remaining', '59'],
                ['x-ratelimit-reset', '1800000000']
            ]),
            text: async () => ''
        });

        const client = new GitHubClient({ fetchImpl: mockFetch });
        const res = await client.getUser('yihune1234', { etag: '"cached-etag-123"' });

        assert.equal(res.status, 304);
        assert.equal(res.notModified, true);
        assert.equal(res.data, null);
        assert.equal(res.etag, '"cached-etag-123"');
    });

    it('GitHubService should reuse cached data and touch cache on 304 response', async () => {
        let callCount = 0;
        const mockFetch = async (url, options) => {
            callCount++;
            if (options.headers['If-None-Match'] === '"etag-v1"') {
                return {
                    ok: false,
                    status: 304,
                    headers: new Map([['etag', '"etag-v1"'], ['x-ratelimit-remaining', '59']]),
                    text: async () => ''
                };
            }
            return {
                ok: true,
                status: 200,
                headers: new Map([['etag', '"etag-v1"'], ['x-ratelimit-remaining', '58']]),
                text: async () => JSON.stringify({ id: 1, login: 'yihune1234', public_repos: 10, type: 'User' })
            };
        };

        const cache = new GitHubCache({ defaultTtlMs: 50 });
        const client = new GitHubClient({ fetchImpl: mockFetch });
        const service = new GitHubService({ client, cache, config: { username: 'yihune1234', ttlProfileMs: 50 } });

        // 1st call: Miss, fetch from GitHub
        const res1 = await service.getPersonalProfile();
        assert.equal(res1.cached, false);
        assert.equal(res1.cache_status, 'MISS');
        assert.equal(res1.data.login, 'yihune1234');
        assert.equal(callCount, 1);

        // Wait for TTL to expire
        await new Promise(r => setTimeout(r, 60));

        // 2nd call: Conditional request sends If-None-Match, GitHub responds 304
        const res2 = await service.getPersonalProfile();
        assert.equal(res2.cached, true);
        assert.equal(res2.cache_status, 'NOT_MODIFIED_304');
        assert.equal(res2.data.login, 'yihune1234');
        assert.equal(callCount, 2);
    });

    it('GitHubService should serve stale data if GitHub request fails', async () => {
        const cache = new GitHubCache({ defaultTtlMs: 20 });
        cache.set('github:personal:profile:yihune1234', { login: 'yihune1234', name: 'Cached Name' }, 20, {
            last_successful_update: '2026-01-01T00:00:00.000Z'
        });

        // Wait for entry to expire
        await new Promise(r => setTimeout(r, 30));

        const failingFetch = async () => { throw new Error('GitHub network timeout'); };
        const client = new GitHubClient({ fetchImpl: failingFetch });
        const service = new GitHubService({ client, cache, config: { username: 'yihune1234', ttlProfileMs: 20 } });

        const result = await service.getPersonalProfile();
        assert.equal(result.cached, true);
        assert.equal(result.cache_status, 'STALE');
        assert.equal(result.data.login, 'yihune1234');
        assert.equal(result.stale, true);
    });
});

describe('Phase 2: Scheduled Synchronization', () => {
    it('should track scheduler execution metrics and avoid overlapping runs', async () => {
        let executionCount = 0;
        let resolveSync;
        const syncPromise = new Promise(r => { resolveSync = r; });

        const mockService = {
            getOverview: async () => {
                executionCount++;
                await syncPromise;
                return { status: { personal: 'ok', organization: 'ok' } };
            }
        };

        const scheduler = new GitHubScheduler({
            service: mockService,
            config: { syncEnabled: true, syncIntervalMs: 100000, syncInitialDelayMs: 100000 }
        });

        // Trigger first sync (will hold)
        const job1Promise = scheduler.syncNow({ reason: 'test1' });
        assert.equal(scheduler.isSyncing, true);

        // Concurrent trigger should be skipped
        const job2 = await scheduler.syncNow({ reason: 'test2' });
        assert.equal(job2.skipped, true);
        assert.equal(job2.reason, 'OVERLAPPING_JOB');

        // Complete first sync
        resolveSync();
        const job1 = await job1Promise;

        assert.equal(job1.success, true);
        assert.equal(executionCount, 1);
        assert.equal(scheduler.isSyncing, false);

        const status = scheduler.getStatus();
        assert.equal(status.sync_count, 1);
        assert.equal(status.failure_count, 0);
        assert.equal(status.last_sync_success, true);
    });

    it('should catch and record synchronization errors without crashing', async () => {
        const mockService = {
            getOverview: async () => {
                throw new Error('Sync network error');
            }
        };

        const scheduler = new GitHubScheduler({
            service: mockService,
            config: { syncEnabled: true, syncIntervalMs: 100000, syncInitialDelayMs: 100000 }
        });

        const res = await scheduler.syncNow({ reason: 'error_test' });
        assert.equal(res.success, false);
        assert.equal(res.error, 'Sync network error');

        const status = scheduler.getStatus();
        assert.equal(status.failure_count, 1);
        assert.equal(status.consecutive_failures, 1);
        assert.equal(status.last_sync_success, false);
        assert.equal(status.last_error, 'Sync network error');
    });
});

describe('Phase 2: Webhook Verification & Cache Invalidation', () => {
    const SECRET = 'test_webhook_secret_key_123';

    function signPayload(payload, secret = SECRET) {
        const bodyStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const signature = crypto.createHmac('sha256', secret).update(bodyStr).digest('hex');
        return `sha256=${signature}`;
    }

    function createWebhookApp() {
        const app = express();
        app.use(express.json({
            verify: (req, res, buf) => {
                req.rawBody = buf;
            }
        }));
        app.use('/api/github', githubRoutes);
        return app;
    }

    it('should reject webhook with 401 when signature header is missing', async () => {
        const app = createWebhookApp();
        const server = app.listen(0);
        const port = server.address().port;

        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/github/webhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zen: 'Keep it logically awesome.' })
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.code, 'MISSING_SIGNATURE');
        } finally {
            server.close();
        }
    });

    it('should reject webhook with 401 when signature is invalid', async () => {
        const app = createWebhookApp();
        const server = app.listen(0);
        const port = server.address().port;

        try {
            const payload = { action: 'push' };
            const badSignature = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';

            const res = await fetch(`http://127.0.0.1:${port}/api/github/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Hub-Signature-256': badSignature,
                    'X-GitHub-Event': 'push'
                },
                body: JSON.stringify(payload)
            });
            assert.equal(res.status, 401);
            const data = await res.json();
            assert.equal(data.code, 'INVALID_SIGNATURE');
        } finally {
            server.close();
        }
    });

    it('should process valid webhook and invalidate affected caches', async () => {
        const app = createWebhookApp();
        const server = app.listen(0);
        const port = server.address().port;

        const { githubCache } = require('../services/github/githubCache');
        const { githubConfig } = require('../config/githubConfig');

        // Prepopulate cache
        githubCache.set('github:personal:repos:yihune1234:1:30:updated:desc', [{ id: 1 }]);
        githubCache.set('github:overview:yihune1234:AriitiMarket', { test: true });

        assert.ok(githubCache.has('github:personal:repos:yihune1234:1:30:updated:desc'));
        assert.ok(githubCache.has('github:overview:yihune1234:AriitiMarket'));

        const payload = {
            ref: 'refs/heads/main',
            repository: {
                name: 'myportfolio',
                full_name: 'yihune1234/myportfolio',
                owner: { login: 'yihune1234' }
            }
        };

        const validSignature = signPayload(payload, process.env.GITHUB_WEBHOOK_SECRET || 'phase2_test_webhook_secret_key');
        const deliveryId = `deliv-${Date.now()}`;

        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/github/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Hub-Signature-256': validSignature,
                    'X-GitHub-Event': 'push',
                    'X-GitHub-Delivery': deliveryId
                },
                body: JSON.stringify(payload)
            });

            assert.equal(res.status, 200);
            const data = await res.json();
            assert.equal(data.success, true);
            assert.deepEqual(data.invalidated_scopes, ['PERSONAL']);

            // Verified cache was invalidated
            assert.equal(githubCache.has('github:personal:repos:yihune1234:1:30:updated:desc'), false);
            assert.equal(githubCache.has('github:overview:yihune1234:AriitiMarket'), false);
        } finally {
            server.close();
        }
    });

    it('should ignore duplicate webhook delivery IDs', async () => {
        const app = createWebhookApp();
        const server = app.listen(0);
        const port = server.address().port;

        const payload = { action: 'opened' };
        const validSignature = signPayload(payload, process.env.GITHUB_WEBHOOK_SECRET || 'phase2_test_webhook_secret_key');
        const deliveryId = `dup-delivery-${Date.now()}`;

        try {
            // First delivery
            const res1 = await fetch(`http://127.0.0.1:${port}/api/github/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Hub-Signature-256': validSignature,
                    'X-GitHub-Event': 'issues',
                    'X-GitHub-Delivery': deliveryId
                },
                body: JSON.stringify(payload)
            });
            assert.equal(res1.status, 200);
            const data1 = await res1.json();
            assert.equal(data1.success, true);

            // Duplicate delivery with same ID
            const res2 = await fetch(`http://127.0.0.1:${port}/api/github/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Hub-Signature-256': validSignature,
                    'X-GitHub-Event': 'issues',
                    'X-GitHub-Delivery': deliveryId
                },
                body: JSON.stringify(payload)
            });
            assert.equal(res2.status, 200);
            const data2 = await res2.json();
            assert.equal(data2.duplicate, true);
        } finally {
            server.close();
        }
    });
});

describe('Phase 2: Health Monitoring Endpoint', () => {
    it('GET /api/github/health should return system status without leaking secrets', async () => {
        const app = express();
        app.use(express.json());
        app.use('/api/github', githubRoutes);

        const server = app.listen(0);
        const port = server.address().port;

        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/github/health`);
            assert.equal(res.status, 200);
            const health = await res.json();

            // Status checks
            assert.ok(['healthy', 'degraded'].includes(health.status));
            assert.ok(health.sources.personal);
            assert.equal(health.sources.personal.username, 'yihune1234');
            assert.ok(health.sources.organization);
            assert.equal(health.sources.organization.name, 'AriitiMarket');

            // Cache statistics with TTLs
            assert.ok(health.cache);
            assert.equal(health.cache.ttls.profile_ms, 1800000);
            assert.equal(health.cache.ttls.repos_ms, 900000);
            assert.equal(health.cache.ttls.activity_ms, 300000);
            assert.equal(health.cache.ttls.overview_ms, 300000);

            // Scheduler status
            assert.ok(health.scheduler);

            // Webhook status
            assert.ok(health.webhook);
            assert.equal(typeof health.webhook.configured, 'boolean');

            // Secrets security verification
            const jsonString = JSON.stringify(health);
            assert.equal(jsonString.includes(process.env.GITHUB_TOKEN || 'gho_'), false);
            assert.equal(jsonString.includes(process.env.JWT_SECRET || 'secret'), false);
            assert.equal(jsonString.includes(process.env.GITHUB_WEBHOOK_SECRET || 'phase2_test'), false);
        } finally {
            server.close();
        }
    });
});
