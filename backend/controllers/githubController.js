/**
 * GitHub API Controller
 * Express handler for GitHub integration endpoints.
 */

const { githubService } = require('../services/github/githubService');
const {
    GitHubNotFoundError,
    GitHubRateLimitError,
    GitHubTimeoutError,
    GitHubUnavailableError
} = require('../services/github/githubClient');

/**
 * Maps GitHub-specific errors to HTTP response
 */
function handleGitHubError(err, res) {
    console.error('GitHub Controller Error:', err.message);

    if (err instanceof GitHubRateLimitError) {
        return res.status(429).json({
            message: err.message,
            code: 'RATE_LIMIT_EXCEEDED',
            resetTime: err.resetTime,
            resetDate: err.resetDate
        });
    }

    if (err instanceof GitHubNotFoundError) {
        return res.status(404).json({
            message: err.message,
            code: 'RESOURCE_NOT_FOUND'
        });
    }

    if (err instanceof GitHubTimeoutError) {
        return res.status(504).json({
            message: err.message,
            code: 'GATEWAY_TIMEOUT'
        });
    }

    if (err instanceof GitHubUnavailableError) {
        return res.status(err.status || 503).json({
            message: err.message,
            code: 'SERVICE_UNAVAILABLE'
        });
    }

    const status = err.status || 500;
    return res.status(status).json({
        message: err.message || 'Internal server error processing GitHub request',
        code: 'GITHUB_INTEGRATION_ERROR'
    });
}

/**
 * GET /api/github/overview
 * Combined overview of personal and organization portfolios
 */
async function getOverview(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const overview = await githubService.getOverview({ forceRefresh });
        res.json(overview);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/personal
 * Personal GitHub profile
 */
async function getPersonal(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const result = await githubService.getPersonalProfile({ forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/personal/repos
 * Personal public repositories
 */
async function getPersonalRepos(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const result = await githubService.getPersonalRepos(req.pagination, { forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/personal/activity
 * Personal public activity
 */
async function getPersonalActivity(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const result = await githubService.getPersonalActivity(req.pagination, { forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/organization
 * Organization GitHub profile
 */
async function getOrganization(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const result = await githubService.getOrgProfile({ forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/organization/repos
 * Organization public repositories
 */
async function getOrganizationRepos(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const result = await githubService.getOrgRepos(req.pagination, { forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/organization/activity
 * Organization public activity
 */
async function getOrganizationActivity(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const result = await githubService.getOrgActivity(req.pagination, { forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

module.exports = {
    getOverview,
    getPersonal,
    getPersonalRepos,
    getPersonalActivity,
    getOrganization,
    getOrganizationRepos,
    getOrganizationActivity
};
