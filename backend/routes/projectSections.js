const express = require('express');
const router = express.Router();
const ProjectSection = require('../models/ProjectSection');
const SectionMedia = require('../models/SectionMedia');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { upload, cloudinaryUpload } = require('../middleware/upload');

// Validate ObjectId
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all sections for a project (public)
router.get('/project/:projectId', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.projectId)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const sections = await ProjectSection.find({ project: req.params.projectId, isVisible: true })
            .sort({ order: 1 });

        res.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single section (public)
router.get('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid section ID' });
        }

        const section = await ProjectSection.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json(section);
    } catch (error) {
        console.error('Error fetching section:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create section (admin only)
router.post('/', auth, async (req, res) => {
    try {
        const { project, title, content, order, isVisible, isDraft } = req.body;

        if (!isValidObjectId(project)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const missing = [];
        if (!title || !title.trim()) missing.push('title');
        if (!content || !content.trim()) missing.push('content');

        if (missing.length) {
            return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
        }

        const sectionData = {
            project: project,
            title: title.trim(),
            content: content.trim(),
            order: order || 0,
            isVisible: isVisible !== undefined ? isVisible : true,
            isDraft: isDraft !== undefined ? isDraft : false
        };

        const section = new ProjectSection(sectionData);
        await section.save();

        res.status(201).json({ message: 'Section created successfully', section });
    } catch (error) {
        console.error('Error creating section:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update section (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid section ID' });
        }

        const { title, content, order, isVisible, isDraft } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (content !== undefined) updateData.content = content.trim();
        if (order !== undefined) updateData.order = order;
        if (isVisible !== undefined) updateData.isVisible = isVisible;
        if (isDraft !== undefined) updateData.isDraft = isDraft;

        const section = await ProjectSection.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        res.json({ message: 'Section updated successfully', section });
    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete section (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid section ID' });
        }

        const section = await ProjectSection.findByIdAndDelete(req.params.id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Also delete all media associated with this section
        await SectionMedia.deleteMany({ projectSection: req.params.id });

        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reorder sections (admin only)
router.put('/reorder/:projectId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.projectId)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { sections } = req.body; // Array of { id, order }

        if (!Array.isArray(sections)) {
            return res.status(400).json({ message: 'Invalid sections data' });
        }

        // Update each section's order
        for (const { id, order } of sections) {
            if (!isValidObjectId(id)) {
                return res.status(400).json({ message: `Invalid section ID: ${id}` });
            }
            await ProjectSection.findByIdAndUpdate(id, { order });
        }

        res.json({ message: 'Sections reordered successfully' });
    } catch (error) {
        console.error('Error reordering sections:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create media for section (admin only)
router.post('/:sectionId/media', auth, upload.single('media'), cloudinaryUpload, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.sectionId)) {
            return res.status(400).json({ message: 'Invalid section ID' });
        }

        const section = await ProjectSection.findById(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        const { type, alt, caption, order, isPrimary } = req.body;

        if (!type || !['image', 'video'].includes(type)) {
            return res.status(400).json({ message: 'Invalid media type' });
        }

        if (!req.file && !req.body.url) {
            return res.status(400).json({ message: 'Media file or URL is required' });
        }

        const mediaData = {
            projectSection: req.params.sectionId,
            url: req.file ? req.file.cloudinaryUrl : req.body.url,
            type: type,
            alt: alt || '',
            caption: caption || '',
            order: order || 0,
            isPrimary: isPrimary === 'true' || isPrimary === true
        };

        const media = new SectionMedia(mediaData);
        await media.save();

        res.status(201).json({ message: 'Media uploaded successfully', media });
    } catch (error) {
        console.error('Error uploading media:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update media (admin only)
router.put('/media/:mediaId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.mediaId)) {
            return res.status(400).json({ message: 'Invalid media ID' });
        }

        const { alt, caption, order, isPrimary } = req.body;

        const updateData = {};
        if (alt !== undefined) updateData.alt = alt;
        if (caption !== undefined) updateData.caption = caption;
        if (order !== undefined) updateData.order = order;
        if (isPrimary !== undefined) updateData.isPrimary = isPrimary === 'true' || isPrimary === true;

        const media = await SectionMedia.findByIdAndUpdate(
            req.params.mediaId,
            updateData,
            { new: true }
        );

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        res.json({ message: 'Media updated successfully', media });
    } catch (error) {
        console.error('Error updating media:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete media (admin only)
router.delete('/media/:mediaId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.mediaId)) {
            return res.status(400).json({ message: 'Invalid media ID' });
        }

        const media = await SectionMedia.findByIdAndDelete(req.params.mediaId);

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
