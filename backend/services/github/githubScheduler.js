/**
 * GitHub Background Synchronization Scheduler
 * Periodically updates personal and organization GitHub data to keep cache warm,
 * avoids overlapping executions, handles failures gracefully, and tracks sync metrics.
 */

const githubConfig = require('../../config/githubConfig');
const { githubService } = require('./githubService');

class GitHubScheduler {
    /**
     * @param {Object} [options]
     * @param {Object} [options.service]
     * @param {Object} [options.config]
     */
    constructor(options = {}) {
        this.service = options.service || githubService;
        this.config = options.config || githubConfig;

        this.timer = null;
        this.initialTimer = null;
        this.isSyncing = false;

        this.state = {
            status: 'idle', // 'idle' | 'running' | 'disabled'
            enabled: this.config.syncEnabled,
            interval_ms: this.config.syncIntervalMs,
            last_sync_started_at: null,
            last_sync_completed_at: null,
            last_sync_duration_ms: null,
            last_sync_success: null,
            sync_count: 0,
            failure_count: 0,
            consecutive_failures: 0,
            last_error: null
        };
    }

    /**
     * Start the background scheduler
     */
    start() {
        if (!this.config.syncEnabled) {
            this.state.status = 'disabled';
            console.log('ℹ️  GitHub synchronization scheduler is disabled by configuration');
            return;
        }

        if (this.timer) {
            console.log('⚠️  GitHub synchronization scheduler already running');
            return;
        }

        console.log(`⏰ GitHub scheduler started (interval: ${Math.round(this.config.syncIntervalMs / 1000)}s)`);
        this.state.status = 'idle';

        // Deferred initial warm-up run (so server boot is not blocked)
        const delay = this.config.syncInitialDelayMs || 5000;
        this.initialTimer = setTimeout(() => {
            this.syncNow({ reason: 'startup' }).catch(() => {});
        }, delay);
        if (this.initialTimer && typeof this.initialTimer.unref === 'function') {
            this.initialTimer.unref();
        }

        // Recurring interval
        this.timer = setInterval(() => {
            this.syncNow({ reason: 'scheduled' }).catch(() => {});
        }, this.config.syncIntervalMs);
        if (this.timer && typeof this.timer.unref === 'function') {
            this.timer.unref();
        }
    }

    /**
     * Stop the scheduler cleanly
     */
    stop() {
        if (this.initialTimer) {
            clearTimeout(this.initialTimer);
            this.initialTimer = null;
        }
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.state.status = 'idle';
        console.log('⏹️  GitHub synchronization scheduler stopped');
    }

    /**
     * Execute a synchronization cycle
     * Avoids overlapping executions using isSyncing flag
     * @param {Object} [meta]
     * @param {string} [meta.reason='manual']
     * @returns {Promise<Object>}
     */
    async syncNow(meta = { reason: 'manual' }) {
        if (this.isSyncing) {
            console.log(`⏳ GitHub sync skipped (${meta.reason}): previous job is still in progress`);
            return { skipped: true, reason: 'OVERLAPPING_JOB' };
        }

        this.isSyncing = true;
        this.state.status = 'running';
        const startTime = Date.now();
        this.state.last_sync_started_at = new Date(startTime).toISOString();

        console.log(`🔄 [GitHubSync] Starting synchronization (trigger: ${meta.reason})...`);

        try {
            // Refresh aggregated overview and core datasets using conditional requests (ETags)
            const overview = await this.service.getOverview({ forceRefresh: true });

            const duration = Date.now() - startTime;
            this.state.last_sync_completed_at = new Date().toISOString();
            this.state.last_sync_duration_ms = duration;
            this.state.last_sync_success = true;
            this.state.sync_count++;
            this.state.consecutive_failures = 0;
            this.state.last_error = null;
            this.state.status = 'idle';

            console.log(
                `✅ [GitHubSync] Synchronization complete in ${duration}ms. ` +
                `Personal: ${overview.status.personal}, Org: ${overview.status.organization}`
            );

            return {
                success: true,
                duration_ms: duration,
                overview_status: overview.status
            };
        } catch (err) {
            const duration = Date.now() - startTime;
            this.state.last_sync_completed_at = new Date().toISOString();
            this.state.last_sync_duration_ms = duration;
            this.state.last_sync_success = false;
            this.state.failure_count++;
            this.state.consecutive_failures++;
            this.state.last_error = err.message;
            this.state.status = 'idle';

            console.error(`❌ [GitHubSync] Synchronization failed after ${duration}ms: ${err.message}`);

            return {
                success: false,
                duration_ms: duration,
                error: err.message
            };
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Get scheduler operational metrics
     * @returns {Object}
     */
    getStatus() {
        return {
            ...this.state,
            is_syncing: this.isSyncing
        };
    }
}

// Singleton export
const defaultScheduler = new GitHubScheduler();
githubService.scheduler = defaultScheduler;

module.exports = {
    GitHubScheduler,
    githubScheduler: defaultScheduler
};
