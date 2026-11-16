/**
 * GitHub API Routes
 * Endpoints for personal and organization portfolio integration.
 */

const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const { validatePagination, validateOrgConfigured } = require('../middleware/githubValidation');

// Portfolio Aggregation
router.get('/overview', githubController.getOverview);

// Personal Account Endpoints
router.get('/personal', githubController.getPersonal);
router.get('/personal/repos', validatePagination, githubController.getPersonalRepos);
router.get('/personal/activity', validatePagination, githubController.getPersonalActivity);

// Organization Account Endpoints
router.get('/organization', validateOrgConfigured, githubController.getOrganization);
router.get('/organization/repos', validateOrgConfigured, validatePagination, githubController.getOrganizationRepos);
router.get('/organization/activity', validateOrgConfigured, validatePagination, githubController.getOrganizationActivity);

module.exports = router;
