const express = require('express');
const router = express.Router();
const technologyController = require('../controllers/technologyController');
const auth = require('../middleware/auth');

// Public route to fetch technologies
router.get('/', technologyController.getTechnologies);

// Admin-only management routes
router.post('/', auth, technologyController.createTechnology);
router.put('/:id', auth, technologyController.updateTechnology);
router.delete('/:id', auth, technologyController.deleteTechnology);
router.post('/seed', auth, technologyController.seedTechnologies);
router.post('/sync-github', auth, technologyController.syncWithGitHub);

module.exports = router;
