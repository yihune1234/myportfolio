const express = require('express');
const router = express.Router();
const SectionMedia = require('../models/SectionMedia');
const auth = require('../middleware/auth');

// Get all media for a section (public)
router.get('/section/:sectionId', async (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        if (!sectionId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid section ID' });
        }

        const media = await SectionMedia.find({ projectSection: sectionId })
            .sort({ order: 1, isPrimary: -1 });

        res.json(media);
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
