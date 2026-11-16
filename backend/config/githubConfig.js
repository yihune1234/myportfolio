/**
 * GitHub Integration Configuration
 * Centralized settings for GitHub API client, caching, and account identifiers.
 */

const githubConfig = {
    // Accounts
    username: (process.env.GITHUB_USERNAME || 'yihune1234').trim(),
    org: (process.env.GITHUB_ORG || 'AriitiMarket').trim(),
    token: (process.env.GITHUB_TOKEN || '').trim(),

    // API Base URL
    apiBaseUrl: (process.env.GITHUB_API_BASE_URL || 'https://api.github.com').replace(/\/$/, ''),

    // Network & Cache Settings
    timeoutMs: parseInt(process.env.GITHUB_TIMEOUT_MS, 10) || 10000, // 10s default timeout
    cacheTtlMs: parseInt(process.env.GITHUB_CACHE_TTL_MS, 10) || 5 * 60 * 1000, // 5 min TTL
    userAgent: process.env.GITHUB_USER_AGENT || 'yihune-portfolio-backend/1.0.0',

    // Pagination defaults
    defaultPerPage: 30,
    maxPerPage: 100
};

module.exports = githubConfig;
