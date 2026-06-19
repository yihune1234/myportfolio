const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { upload, cloudinaryUpload } = require('../middleware/upload');

// Validate ObjectId
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all projects (public) — pinned first, then by date
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ pinned: -1, createdAt: -1 });
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
            githubUrl: githubUrl?.trim() || '',
            demoUrl: demoUrl?.trim() || '',
            role: role || 'Developer',
            isMini: isMini === 'true',
            images: []
        };

        if (req.file && req.file.cloudinaryUrl) {
            projectData.image = req.file.cloudinaryUrl;
            projectData.images.push({
                url: req.file.cloudinaryUrl,
                public_id: req.file.public_id,
                title: 'Cover Image',
                order: 0,
                isFeatured: true
            });
        } else if (req.body.image) {
            projectData.image = req.body.image;
            projectData.images.push({
                url: req.body.image,
                title: 'Cover Image',
                order: 0,
                isFeatured: true
            });
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
            // Add the new image to the images array if it's not a duplicate
            const project = await Project.findById(req.params.id);
            if (project) {
                const existingUrls = project.images.map(img => img.url);
                if (!existingUrls.includes(req.file.cloudinaryUrl)) {
                    updateData.$push = {
                        images: {
                            url: req.file.cloudinaryUrl,
                            public_id: req.file.public_id,
                            title: 'Image ' + (project.images.length + 1),
                            order: project.images.length,
                            isFeatured: project.images.length === 0
                        }
                    };
                }
            }
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

// Toggle pin project (admin only)
router.put('/:id/pin', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.pinned = !project.pinned;
        await project.save();

        res.json({ message: project.pinned ? 'Project pinned' : 'Project unpinned', project });
    } catch (error) {
        console.error('Error toggling pin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete project (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete all images from Cloudinary
        if (project.images && project.images.length > 0) {
            for (const img of project.images) {
                if (img.public_id) {
                    try {
                        await cloudinary.uploader.destroy(img.public_id);
                    } catch (e) {
                        console.error('Failed to delete image from Cloudinary:', e);
                    }
                }
            }
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============================================================
// IMAGE MANAGEMENT ROUTES
// ============================================================

// Upload multiple images to a project
router.post('/:id/images', auth, upload.array('images', 20), async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            // Upload each file to Cloudinary
            const preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'portfolio';
            let result;
            
            if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                result = await cloudinary.uploader.upload(file.path, {
                    folder: 'portfolio',
                    use_filename: true,
                    unique_filename: true,
                    timeout: 120000
                });
            } else {
                result = await cloudinary.uploader.unsigned_upload(file.path, preset, {
                    folder: 'portfolio',
                    use_filename: true,
                    unique_filename: true
                });
            }

            // Delete local temp file
            const fs = require('fs');
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            const imageEntry = {
                url: result.secure_url,
                public_id: result.public_id,
                title: req.body.titles?.[req.files.indexOf(file)] || `Image ${project.images.length + uploadedImages.length + 1}`,
                order: project.images.length + uploadedImages.length,
                isFeatured: project.images.length === 0 && uploadedImages.length === 0
            };

            uploadedImages.push(imageEntry);
        }

        project.images.push(...uploadedImages);
        
        // Set first image as featured if no featured image exists
        const hasFeatured = project.images.some(img => img.isFeatured);
        if (!hasFeatured && project.images.length > 0) {
            project.images[0].isFeatured = true;
        }

        // Update the main image to the featured one
        const featured = project.images.find(img => img.isFeatured);
        if (featured) {
            project.image = featured.url;
        } else if (project.images.length > 0) {
            project.image = project.images[0].url;
        }

        await project.save();

        res.json({ message: 'Images uploaded successfully', images: uploadedImages, project });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a specific image from a project
router.delete('/:id/images/:imageId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.imageId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const imageIndex = project.images.findIndex(
            img => img._id.toString() === req.params.imageId
        );

        if (imageIndex === -1) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const imageToDelete = project.images[imageIndex];

        // Delete from Cloudinary
        if (imageToDelete.public_id) {
            try {
                await cloudinary.uploader.destroy(imageToDelete.public_id);
            } catch (e) {
                console.error('Failed to delete image from Cloudinary:', e);
            }
        }

        const wasFeatured = imageToDelete.isFeatured;
        project.images.splice(imageIndex, 1);

        // If we deleted the featured image, set a new one
        if (wasFeatured && project.images.length > 0) {
            project.images[0].isFeatured = true;
        }

        // Update the main image
        const featured = project.images.find(img => img.isFeatured);
        if (featured) {
            project.image = featured.url;
        } else if (project.images.length > 0) {
            project.image = project.images[0].url;
        } else {
            project.image = '';
        }

        // Re-order remaining images
        project.images.forEach((img, idx) => {
            img.order = idx;
        });

        await project.save();

        res.json({ message: 'Image deleted successfully', project });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reorder images
router.put('/:id/images/reorder', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { imageOrder } = req.body; // Array of image IDs in new order
        if (!Array.isArray(imageOrder)) {
            return res.status(400).json({ message: 'imageOrder must be an array' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Create a map of existing images by ID
        const imageMap = {};
        project.images.forEach(img => {
            imageMap[img._id.toString()] = img;
        });

        // Re-order based on the provided order
        const reordered = [];
        imageOrder.forEach((id, idx) => {
            if (imageMap[id]) {
                const img = imageMap[id];
                img.order = idx;
                reordered.push(img);
            }
        });

        // Add any images not in the order list
        project.images.forEach(img => {
            if (!imageOrder.includes(img._id.toString())) {
                img.order = reordered.length;
                reordered.push(img);
            }
        });

        project.images = reordered;

        // Ensure featured image is set
        const hasFeatured = project.images.some(img => img.isFeatured);
        if (!hasFeatured && project.images.length > 0) {
            project.images[0].isFeatured = true;
        }

        // Update main image
        const featured = project.images.find(img => img.isFeatured);
        if (featured) {
            project.image = featured.url;
        } else if (project.images.length > 0) {
            project.image = project.images[0].url;
        }

        await project.save();

        res.json({ message: 'Images reordered successfully', project });
    } catch (error) {
        console.error('Error reordering images:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update image metadata (title, isFeatured)
router.put('/:id/images/:imageId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.imageId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const { title, isFeatured } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const image = project.images.id(req.params.imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (title !== undefined) image.title = title;

        if (isFeatured !== undefined) {
            // Unset all featured flags
            project.images.forEach(img => {
                img.isFeatured = false;
            });
            image.isFeatured = true;
            project.image = image.url;
        }

        await project.save();

        res.json({ message: 'Image updated successfully', project });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all images for a project
router.get('/:id/images', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Return images sorted by order
        const images = (project.images || []).sort((a, b) => a.order - b.order);

        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;