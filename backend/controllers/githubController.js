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

/**
 * GET /api/github/languages
 * Aggregated language byte analysis from GitHub language endpoints
 */
async function getLanguages(req, res) {
    try {
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';
        const scope = req.query.scope || 'ALL';
        const result = await githubService.getLanguages({ scope, forceRefresh });
        res.json(result);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * GET /api/github/health
 * Synchronization monitoring, source availability, cache metrics, and scheduler status
 */
async function getHealth(req, res) {
    try {
        const health = await githubService.getHealth();
        res.json(health);
    } catch (err) {
        handleGitHubError(err, res);
    }
}

/**
 * POST /api/github/webhook
 * GitHub webhook receiver with event-driven cache invalidation
 */
async function handleWebhook(req, res) {
    try {
        const event = req.headers['x-github-event'] || 'unknown';
        const payload = req.body || {};

        // GitHub ping event (sent on initial webhook registration)
        if (event === 'ping') {
            return res.json({
                message: 'GitHub webhook ping received successfully',
                zen: payload.zen || null,
                hook_id: payload.hook_id || null
            });
        }

        const result = githubService.handleWebhookEvent(event, payload);
        res.json({
            success: true,
            message: `Webhook event "${event}" processed successfully`,
            ...result
        });
    } catch (err) {
        console.error('Error handling GitHub webhook:', err);
        res.status(500).json({
            message: 'Failed to process webhook event',
            error: err.message
        });
    }
}

/**
 * GET /api/github/settings
 * Public visibility configuration flags
 */
async function getPublicSettings(req, res) {
    try {
        const SiteSettings = require('../models/SiteSettings');
        const githubConfig = require('../config/githubConfig');
        let settings = await SiteSettings.findOne({ key: 'site_settings' });
        if (!settings) {
            settings = {
                githubUsername: githubConfig.username,
                githubOrg: githubConfig.org,
                personalVisibility: true,
                orgVisibility: true,
                showHeroPulse: true,
                showSkillsIntegration: true,
                showEngineeringShowcase: true
            };
        }
        res.json({
            githubUsername: settings.githubUsername || githubConfig.username,
            githubOrg: settings.githubOrg || githubConfig.org,
            personalVisibility: settings.personalVisibility,
            orgVisibility: settings.orgVisibility,
            showHeroPulse: settings.showHeroPulse,
            showSkillsIntegration: settings.showSkillsIntegration,
            showEngineeringShowcase: settings.showEngineeringShowcase
        });
    } catch (err) {
        const githubConfig = require('../config/githubConfig');
        res.json({
            githubUsername: githubConfig.username,
            githubOrg: githubConfig.org,
            personalVisibility: true,
            orgVisibility: true,
            showHeroPulse: true,
            showSkillsIntegration: true,
            showEngineeringShowcase: true
        });
    }
}

/**
 * GET /api/github/repo-details
 * Retrieve detailed repository information, languages breakdown, and README
 */
async function getRepoDetails(req, res) {
    try {
        const owner = req.query.owner || req.params.owner;
        const repo = req.query.repo || req.params.repo;
        const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';

        if (!owner || !repo) {
            return res.status(400).json({ message: 'Both "owner" and "repo" parameters are required' });
        }

        const result = await githubService.getRepoDetails(owner, repo, { forceRefresh });
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
    getOrganizationActivity,
    getLanguages,
    getHealth,
    handleWebhook,
    getPublicSettings,
    getRepoDetails
};
