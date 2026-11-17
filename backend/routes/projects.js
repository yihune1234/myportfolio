const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, cloudinaryUpload } = require('../middleware/upload');
const projectController = require('../controllers/projectController');

// Public & Admin Project Queries
router.get('/', projectController.getProjects);
router.get('/admin/all', auth, projectController.getAdminAll);
router.get('/:id', projectController.getProjectById);

// Project Creation, Modification & Deletion
router.post('/', auth, upload.single('image'), cloudinaryUpload, projectController.createProject);
router.put('/:id', auth, upload.single('image'), cloudinaryUpload, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

// Publication & Governance Workflows
router.put('/:id/publish', auth, projectController.togglePublish);
router.put('/:id/pin', auth, projectController.togglePin);
router.put('/:id/status', auth, projectController.updateStatus);
router.put('/:id/proposal-status', auth, projectController.updateProposalStatus);

// GitHub Import & Synchronization
router.post('/import-github', auth, projectController.importGitHub);
router.post('/:id/sync', auth, projectController.syncProject);

// Gallery & Multi-Image Endpoints
router.get('/:id/images', projectController.getImages);
router.post('/:id/images', auth, upload.array('images', 20), cloudinaryUpload, projectController.uploadImages);
router.put('/:id/images/reorder', auth, projectController.reorderImages);
router.put('/:id/images/:imageId', auth, projectController.updateImage);
router.delete('/:id/images/:imageId', auth, projectController.deleteImage);

// Content Section Management
router.post('/:id/sections', auth, projectController.addSection);
router.put('/:id/sections/:sectionId', auth, projectController.updateSection);
router.delete('/:id/sections/:sectionId', auth, projectController.deleteSection);
router.put('/:id/sections-reorder', auth, projectController.reorderSections);

module.exports = router;
