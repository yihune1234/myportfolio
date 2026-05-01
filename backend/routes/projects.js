const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { upload, cloudinaryUpload } = require('../middleware/upload');

// Validate ObjectId
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all projects (public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create project (admin only)
router.post('/', auth, upload.single('image'), cloudinaryUpload, async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, demoUrl, role, isMini } = req.body;

        const missing = [];
        if (!title || !title.trim()) missing.push('title');
        if (!description || !description.trim()) missing.push('description');
        if (typeof technologies === 'undefined') missing.push('technologies');
        if (!githubUrl || !githubUrl.trim()) missing.push('githubUrl');
        if (!demoUrl || !demoUrl.trim()) missing.push('demoUrl');
        if (typeof isMini === 'undefined') missing.push('isMini');
        if (!req.file && !req.body.image) missing.push('image');

        let parsedTech = [];
        try {
            parsedTech = typeof technologies === 'string' ? JSON.parse(technologies || '[]') : (technologies || []);
        } catch (e) {
            return res.status(400).json({ message: 'Technologies must be valid JSON array' });
        }

        if (!parsedTech.length) missing.push('technologies');

        if (missing.length) {
            return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
        }

        const projectData = {
            title: title.trim(),
            description: description.trim(),
            technologies: parsedTech,
            githubUrl: githubUrl.trim(),
            demoUrl: demoUrl.trim(),
            role: role || 'Developer',
            isMini: isMini === 'true'
        };

        if (req.file && req.file.cloudinaryUrl) {
            projectData.image = req.file.cloudinaryUrl;
        } else if (req.body.image) {
            projectData.image = req.body.image;
        }

        const project = new Project(projectData);
        await project.save();

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update project (admin only)
router.put('/:id', auth, upload.single('image'), cloudinaryUpload, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { title, description, technologies, githubUrl, demoUrl, role, isMini } = req.body;
        
        const updateData = {
            title: title?.trim(),
            description: description?.trim(),
            technologies: typeof technologies === 'string' ? JSON.parse(technologies) : technologies,
            githubUrl: githubUrl?.trim(),
            demoUrl: demoUrl?.trim(),
            role: role || 'Developer',
            isMini: isMini === 'true' || isMini === true
        };

        if (req.file && req.file.cloudinaryUrl) {
            updateData.image = req.file.cloudinaryUrl;
        } else if (req.body.image) {
            updateData.image = req.body.image;
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete project (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findByIdAndDelete(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
