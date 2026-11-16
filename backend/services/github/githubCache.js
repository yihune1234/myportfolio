/**
 * In-Memory TTL Cache Interface for GitHub Data
 * Prevents redundant external API calls and handles rate limit preservation.
 */

class GitHubCache {
    /**
     * @param {Object} options
     * @param {number} [options.defaultTtlMs=300000] - Default TTL in milliseconds (5 minutes)
     * @param {number} [options.cleanupIntervalMs=60000] - Interval to purge expired entries (1 minute)
     */
    constructor(options = {}) {
        this.defaultTtlMs = options.defaultTtlMs || 300000;
        this.store = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0
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
        const entry = this.store.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return entry.value;
    }

    /**
     * Store a value with a specific or default TTL
     * @param {string} key
     * @param {any} value
     * @param {number} [ttlMs]
     */
    set(key, value, ttlMs) {
        const ttl = typeof ttlMs === 'number' && ttlMs > 0 ? ttlMs : this.defaultTtlMs;
        const expiresAt = Date.now() + ttl;
        this.store.set(key, { value, expiresAt });
        this.stats.sets++;
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
     * Clear all cached items
     */
    clear() {
        this.store.clear();
    }

    /**
     * Purge all expired entries
     * @returns {number} count of purged entries
     */
    purgeExpired() {
        const now = Date.now();
        let purged = 0;
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt) {
                this.store.delete(key);
                purged++;
            }
        }
        return purged;
    }

    /**
     * Get operational statistics
     * @returns {{ hits: number, misses: number, sets: number, deletes: number, size: number }}
     */
    getStats() {
        return {
            ...this.stats,
            size: this.store.size
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
