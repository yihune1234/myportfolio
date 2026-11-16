/**
 * GitHub Integration Configuration
 * Centralized settings for GitHub API client, caching, and account identifiers.
 */

const rawToken = (process.env.GITHUB_TOKEN || '').replace(/[\r\n\t\s]/g, '');
if (rawToken.startsWith('eyJ')) {
    console.warn('⚠️  [GitHubConfig] Warning: GITHUB_TOKEN starts with "eyJ", which is a JWT token, not a GitHub Personal Access Token (PAT). GitHub requires a token starting with "ghp_" or "github_pat_". Ignoring invalid JWT token to prevent GitHub authentication errors.');
}

const githubConfig = {
    // Accounts
    username: (process.env.GITHUB_USERNAME || 'yihune1234').replace(/[\r\n\t\s]/g, ''),
    org: (process.env.GITHUB_ORG || 'AriitiMarket').replace(/[\r\n\t\s]/g, ''),
    // Only use token if it is not an accidentally pasted JWT token
    token: rawToken.startsWith('eyJ') ? '' : rawToken,

    // API Base URL
    apiBaseUrl: (process.env.GITHUB_API_BASE_URL || 'https://api.github.com').replace(/\/$/, ''),

    // Network Settings
    timeoutMs: parseInt(process.env.GITHUB_TIMEOUT_MS, 10) || 10000, // 10s default timeout
    userAgent: process.env.GITHUB_USER_AGENT || 'yihune-portfolio-backend/1.0.0',

    // Granular Cache TTL Settings (in milliseconds)
    // Suggested defaults: Profile (30m), Repos (15m), Activity (5m), Overview (5m)
    cacheTtlMs: parseInt(process.env.GITHUB_CACHE_TTL_MS, 10) || 5 * 60 * 1000,
    ttlProfileMs: parseInt(process.env.GITHUB_CACHE_TTL_PROFILE_MS, 10) || 30 * 60 * 1000,
    ttlReposMs: parseInt(process.env.GITHUB_CACHE_TTL_REPOS_MS, 10) || 15 * 60 * 1000,
    ttlActivityMs: parseInt(process.env.GITHUB_CACHE_TTL_ACTIVITY_MS, 10) || 5 * 60 * 1000,
    ttlOverviewMs: parseInt(process.env.GITHUB_CACHE_TTL_OVERVIEW_MS, 10) || 5 * 60 * 1000,

    // Scheduled Synchronization Settings
    syncEnabled: process.env.GITHUB_SYNC_ENABLED !== 'false',
    syncIntervalMs: parseInt(process.env.GITHUB_SYNC_INTERVAL_MS, 10) || 15 * 60 * 1000, // 15 min default
    syncInitialDelayMs: parseInt(process.env.GITHUB_SYNC_INITIAL_DELAY_MS, 10) || 5000, // 5s initial delay

    // Webhook Configuration
    get webhookSecret() {
        return (process.env.GITHUB_WEBHOOK_SECRET || '').trim();
    },
    get webhookEnabled() {
        return Boolean(this.webhookSecret);
    },

    // Pagination defaults
    defaultPerPage: 30,
    maxPerPage: 100
};

module.exports = githubConfig;
