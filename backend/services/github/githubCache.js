/**
 * In-Memory TTL Cache Interface for GitHub Data
 * Prevents redundant external API calls and handles rate limit preservation.
 */

class GitHubCache {
    /**
     * @param {Object} options
     * @param {number} [options.defaultTtlMs=300000] - Default TTL in milliseconds (5 minutes)
     * @param {number} [options.cleanupIntervalMs=60000] - Interval to purge expired entries (1 minute)
     * @param {number} [options.staleGracePeriodMs=86400000] - Duration to retain expired data for stale fallback (24 hours)
     */
    constructor(options = {}) {
        this.defaultTtlMs = options.defaultTtlMs || 300000;
        this.staleGracePeriodMs = options.staleGracePeriodMs || 24 * 60 * 60 * 1000;
        this.store = new Map();
        this.deliveries = new Map(); // Delivery deduplication store
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            touches: 0
        };

        const cleanupInterval = options.cleanupIntervalMs || 60000;
        this.cleanupTimer = setInterval(() => this.purgeExpired(), cleanupInterval);
        if (this.cleanupTimer && typeof this.cleanupTimer.unref === 'function') {
            this.cleanupTimer.unref(); // Avoid keeping Node event loop open in tests
        }
    }

    /**
     * Retrieve cached value by key
     * @param {string} key
     * @returns {any|null}
     */
    get(key) {
        const entry = this.getEntry(key);
        return entry ? entry.value : null;
    }

    /**
     * Retrieve full entry including metadata
     * @param {string} key
     * @param {Object} [options]
     * @param {boolean} [options.allowStale=false] - Return even if expired
     * @returns {Object|null}
     */
    getEntry(key, options = {}) {
        const entry = this.store.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        const isExpired = Date.now() > entry.expiresAt;
        if (isExpired && !options.allowStale) {
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return {
            value: entry.value,
            metadata: {
                last_synchronized_at: entry.last_synchronized_at,
                last_successful_update: entry.last_successful_update,
                etag: entry.etag || null,
                ttlMs: entry.ttlMs,
                expiresAt: entry.expiresAt,
                is_expired: isExpired,
                cache_status: isExpired ? 'STALE' : 'HIT'
            }
        };
    }

    /**
     * Store a value with metadata and a specific or default TTL
     * @param {string} key
     * @param {any} value
     * @param {number} [ttlMs]
     * @param {Object} [metadata]
     * @param {string} [metadata.etag]
     * @param {string} [metadata.last_successful_update]
     */
    set(key, value, ttlMs, metadata = {}) {
        const ttl = typeof ttlMs === 'number' && ttlMs > 0 ? ttlMs : this.defaultTtlMs;
        const now = Date.now();
        const nowIso = new Date(now).toISOString();

        this.store.set(key, {
            value,
            expiresAt: now + ttl,
            ttlMs: ttl,
            etag: metadata.etag || null,
            last_synchronized_at: nowIso,
            last_successful_update: metadata.last_successful_update || nowIso
        });
        this.stats.sets++;
    }

    /**
     * Extend TTL and update last_synchronized_at without changing data (e.g. on HTTP 304 Not Modified)
     * @param {string} key
     * @param {number} [ttlMs]
     * @param {string} [newEtag]
     * @returns {boolean}
     */
    touch(key, ttlMs, newEtag) {
        const entry = this.store.get(key);
        if (!entry) return false;

        const ttl = typeof ttlMs === 'number' && ttlMs > 0 ? ttlMs : entry.ttlMs;
        const now = Date.now();
        entry.expiresAt = now + ttl;
        entry.last_synchronized_at = new Date(now).toISOString();
        if (newEtag) entry.etag = newEtag;

        this.stats.touches++;
        return true;
    }

    /**
     * Check if a valid, non-expired key exists
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete a specific cache key
     * @param {string} key
     * @returns {boolean}
     */
    del(key) {
        const existed = this.store.delete(key);
        if (existed) this.stats.deletes++;
        return existed;
    }

    /**
     * Delete keys matching a prefix string or RegExp
     * @param {string|RegExp} pattern
     * @returns {number} count of deleted keys
     */
    delPattern(pattern) {
        let count = 0;
        const isRegex = pattern instanceof RegExp;

        for (const key of this.store.keys()) {
            const matches = isRegex ? pattern.test(key) : key.startsWith(pattern);
            if (matches) {
                this.store.delete(key);
                count++;
            }
        }

        if (count > 0) this.stats.deletes += count;
        return count;
    }

    /**
     * Invalidate cache for a specific scope (PERSONAL, ORGANIZATION, or ALL)
     * @param {'PERSONAL'|'ORGANIZATION'|'ALL'} scope
     * @returns {number} count of keys deleted
     */
    invalidateScope(scope) {
        let count = 0;
        if (scope === 'PERSONAL') {
            count += this.delPattern('github:personal:repos');
            count += this.delPattern('github:personal:activity');
            count += this.delPattern('github:overview');
        } else if (scope === 'ORGANIZATION') {
            count += this.delPattern('github:org:repos');
            count += this.delPattern('github:org:activity');
            count += this.delPattern('github:overview');
        } else {
            count += this.delPattern('github:');
        }
        return count;
    }

    /**
     * Webhook delivery deduplication check
     * @param {string} deliveryId
     * @returns {boolean} true if already processed
     */
    hasDelivery(deliveryId) {
        if (!deliveryId) return false;
        const expiresAt = this.deliveries.get(deliveryId);
        if (!expiresAt) return false;
        if (Date.now() > expiresAt) {
            this.deliveries.delete(deliveryId);
            return false;
        }
        return true;
    }

    /**
     * Record processed webhook delivery ID
     * @param {string} deliveryId
     * @param {number} [ttlMs=3600000] - 1 hour retention
     */
    recordDelivery(deliveryId, ttlMs = 3600000) {
        if (!deliveryId) return;
        this.deliveries.set(deliveryId, Date.now() + ttlMs);
    }

    /**
     * Clear all cached items
     */
    clear() {
        this.store.clear();
        this.deliveries.clear();
    }

    /**
     * Purge entries older than expiresAt + staleGracePeriodMs
     * @returns {number} count of purged entries
     */
    purgeExpired() {
        const now = Date.now();
        let purged = 0;
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt + this.staleGracePeriodMs) {
                this.store.delete(key);
                purged++;
            }
        }
        for (const [id, expiresAt] of this.deliveries.entries()) {
            if (now > expiresAt) {
                this.deliveries.delete(id);
            }
        }
        return purged;
    }

    /**
     * Get operational statistics
     * @returns {Object}
     */
    getStats() {
        const totalOps = this.stats.hits + this.stats.misses;
        const hitRatio = totalOps > 0 ? Number((this.stats.hits / totalOps).toFixed(3)) : 1.0;

        // Categorized key count
        let profiles = 0, repos = 0, activity = 0, overview = 0, other = 0;
        for (const key of this.store.keys()) {
            if (key.includes(':profile:')) profiles++;
            else if (key.includes(':repos:')) repos++;
            else if (key.includes(':activity:')) activity++;
            else if (key.includes(':overview')) overview++;
            else other++;
        }

        return {
            ...this.stats,
            size: this.store.size,
            deliveries_tracked: this.deliveries.size,
            hit_ratio: hitRatio,
            categories: {
                profiles,
                repos,
                activity,
                overview,
                other
            }
        };
    }

    /**
     * Close the cleanup timer (useful for clean teardown)
     */
    close() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
}

// Default singleton instance
const defaultCache = new GitHubCache();

module.exports = {
    GitHubCache,
    githubCache: defaultCache
};
