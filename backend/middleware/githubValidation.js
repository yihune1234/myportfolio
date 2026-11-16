/**
 * GitHub Request Validation Middleware
 * Validates usernames, organization configuration, and pagination query params.
 */

const githubConfig = require('../config/githubConfig');

// GitHub username/org regex: 1-39 characters, alphanumeric with single hyphens, not start/end with hyphen
const GITHUB_HANDLE_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

/**
 * Validates a GitHub handle (username or organization)
 * @param {string} handle
 * @returns {boolean}
 */
function isValidGitHubHandle(handle) {
    if (typeof handle !== 'string') return false;
    const trimmed = handle.trim();
    return trimmed.length >= 1 && trimmed.length <= 39 && GITHUB_HANDLE_REGEX.test(trimmed);
}

/**
 * Validates pagination query parameters: page and per_page
 */
function validatePagination(req, res, next) {
    let { page, per_page, sort, direction } = req.query;

    if (page !== undefined) {
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedPage) || parsedPage < 1) {
            return res.status(400).json({
                message: 'Invalid pagination parameter: "page" must be an integer greater than or equal to 1',
                param: 'page'
            });
        }
        req.pagination = req.pagination || {};
        req.pagination.page = parsedPage;
    } else {
        req.pagination = req.pagination || {};
        req.pagination.page = 1;
    }

    if (per_page !== undefined) {
        const parsedPerPage = parseInt(per_page, 10);
        if (isNaN(parsedPerPage) || parsedPerPage < 1 || parsedPerPage > githubConfig.maxPerPage) {
            return res.status(400).json({
                message: `Invalid pagination parameter: "per_page" must be an integer between 1 and ${githubConfig.maxPerPage}`,
                param: 'per_page'
            });
        }
        req.pagination.per_page = parsedPerPage;
    } else {
        req.pagination.per_page = githubConfig.defaultPerPage;
    }

    if (sort !== undefined) {
        const allowedSorts = ['created', 'updated', 'pushed', 'full_name', 'stars'];
        if (!allowedSorts.includes(String(sort).toLowerCase())) {
            return res.status(400).json({
                message: `Invalid sort parameter. Allowed: ${allowedSorts.join(', ')}`,
                param: 'sort'
            });
        }
        req.pagination.sort = String(sort).toLowerCase();
    }

    if (direction !== undefined) {
        const allowedDirections = ['asc', 'desc'];
        if (!allowedDirections.includes(String(direction).toLowerCase())) {
            return res.status(400).json({
                message: 'Invalid direction parameter. Allowed: "asc" or "desc"',
                param: 'direction'
            });
        }
        req.pagination.direction = String(direction).toLowerCase();
    }

    next();
}

/**
 * Validates that an organization is configured
 */
function validateOrgConfigured(req, res, next) {
    const org = githubConfig.org;
    if (!org || !isValidGitHubHandle(org)) {
        return res.status(404).json({
            message: 'GitHub organization is not configured or has an invalid name',
            code: 'ORG_NOT_CONFIGURED',
            organization: org || null
        });
    }
    next();
}

module.exports = {
    isValidGitHubHandle,
    validatePagination,
    validateOrgConfigured
};
