const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { upload, cloudinaryUpload } = require('../middleware/upload');
const { githubService } = require('../services/github/githubService');

// Validate ObjectId
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Check if request is authenticated as administrator
const isAdminRequest = (req) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return false;
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) return false;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return Boolean(verified && verified.id);
    } catch (e) {
        return false;
    }
};

// Get all projects
// For public visitors: STRICTLY returns published projects (status === 'published')
// For admin: ?includeDrafts=true or ?all=true returns all projects when authenticated
router.get('/', async (req, res) => {
    try {
        const includeAll = (req.query.includeDrafts === 'true' || req.query.all === 'true') && isAdminRequest(req);
        const filter = includeAll ? {} : { status: 'published' };

        // Type filter: completed, ongoing, proposed
        if (req.query.type && ['completed', 'ongoing', 'proposed'].includes(req.query.type)) {
            filter.projectType = req.query.type;
        }

        // Category filter
        if (req.query.category && req.query.category !== 'ALL') {
            filter.category = req.query.category;
        }

        // Proposal status filter for public/admin
        if (req.query.proposalStatus) {
            filter.proposalStatus = req.query.proposalStatus;
        }

        // Search filter
        if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim()) {
            const query = req.query.search.trim();
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { technologies: { $in: [new RegExp(query, 'i')] } }
            ];
        }

        const projects = await Project.find(filter).sort({ pinned: -1, order: 1, createdAt: -1 });

        // If public visitor, sanitize internal technical data to present business-focused view
        if (!includeAll) {
            const sanitized = projects.map(p => {
                const doc = p.toObject();
                // Never expose internal raw GitHub metadata, tokens, or private sync details to public
                delete doc.githubMetadata;
                delete doc.autoSyncMetrics;
                if (!doc.showGithubLink) {
                    delete doc.githubUrl;
                    delete doc.githubRepoUrl;
                }
                return doc;
            });
            return res.json(sanitized);
        }

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin-only: Get all projects and proposals across all statuses with comprehensive breakdown
router.get('/admin/all', auth, async (req, res) => {
    try {
        const projects = await Project.find().sort({ pinned: -1, order: 1, createdAt: -1 });

        // Breakdown counts
        const publishedCount = projects.filter(p => p.status === 'published').length;
        const draftCount = projects.filter(p => p.status === 'draft').length;
        const underReviewCount = projects.filter(p => p.status === 'under_review').length;
        const unpublishedCount = projects.filter(p => p.status === 'unpublished').length;
        const archivedCount = projects.filter(p => p.status === 'archived').length;

        const completedCount = projects.filter(p => p.projectType === 'completed').length;
        const ongoingCount = projects.filter(p => p.projectType === 'ongoing').length;
        const proposedCount = projects.filter(p => p.projectType === 'proposed').length;

        const pendingProposalsCount = projects.filter(p => p.projectType === 'proposed' && p.proposalStatus === 'pending').length;
        const approvedProposalsCount = projects.filter(p => p.projectType === 'proposed' && p.proposalStatus === 'approved').length;

        res.json({
            success: true,
            total: projects.length,
            counts: {
                published: publishedCount,
                draft: draftCount,
                under_review: underReviewCount,
                unpublished: unpublishedCount,
                archived: archivedCount,
                completed: completedCount,
                ongoing: ongoingCount,
                proposed: proposedCount,
                pending_proposals: pendingProposalsCount,
                approved_proposals: approvedProposalsCount
            },
            projects
        });
    } catch (error) {
        console.error('Error fetching admin projects:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Import one or multiple repositories directly from GitHub (admin only)
router.post('/import-github', auth, async (req, res) => {
    try {
        const { owner, repo, publishNow = false, customData = {} } = req.body;

        if (!owner || !repo) {
            return res.status(400).json({ success: false, message: 'Both owner and repo are required for GitHub import' });
        }

        const fullName = `${owner}/${repo}`.trim();

        // Prevent duplicate imports unless forceOverwrite is passed
        const existing = await Project.findOne({
            $or: [
                { githubRepoFullName: { $regex: new RegExp(`^${fullName}$`, 'i') } }
            ]
        });

        if (existing && !req.body.forceOverwrite) {
            return res.status(409).json({
                success: false,
                isDuplicate: true,
                existingProjectId: existing._id,
                message: `Repository "${fullName}" is already imported as "${existing.title}".`
            });
        }

        // Fetch rich details from GitHub
        const detailsRes = await githubService.getRepoDetails(owner, repo);
        const repoDetails = detailsRes.data;
        const s = repoDetails.suggested;

        let parsedTech = customData.technologies || s.technologies;
        if (typeof parsedTech === 'string') {
            try { parsedTech = JSON.parse(parsedTech); } catch (e) { parsedTech = parsedTech.split(',').map(t => t.trim()); }
        }

        const projectData = {
            title: customData.title?.trim() || s.title,
            description: customData.description?.trim() || s.description,
            technologies: parsedTech,
            githubUrl: customData.githubUrl?.trim() || s.githubUrl,
            demoUrl: customData.demoUrl?.trim() || s.demoUrl,
            role: customData.role?.trim() || s.role,
            category: customData.category?.trim() || s.category,
            highlights: customData.highlights || [],
            isMini: customData.isMini === true,
            pinned: customData.pinned === true,
            status: publishNow ? 'published' : (customData.status || 'draft'),
            githubRepoId: s.githubRepoId,
            githubRepoFullName: s.githubRepoFullName,
            githubOwnerLogin: s.githubOwnerLogin,
            githubRepoUrl: s.githubUrl,
            githubSourceScope: s.githubSourceScope,
            sourceType: s.sourceType,
            showGithubMetrics: customData.showGithubMetrics !== false,
            autoSyncMetrics: customData.autoSyncMetrics !== false,
            lastSyncedAt: new Date(),
            githubMetadata: {
                stars: s.stars,
                forks: s.forks,
                primaryLanguage: repoDetails.repository.primary_language,
                languages: repoDetails.languages,
                topics: repoDetails.repository.topics,
                defaultBranch: s.defaultBranch,
                openIssues: repoDetails.repository.open_issues_count,
                repoCreatedAt: s.createdAt,
                repoPushedAt: s.pushedAt,
                readmeSummary: repoDetails.readme?.summary || ''
            },
            images: []
        };

        if (customData.image) {
            projectData.image = customData.image;
            projectData.images.push({
                url: customData.image,
                title: 'Cover Image',
                order: 0,
                isFeatured: true
            });
        }

        let project;
        if (existing && req.body.forceOverwrite) {
            project = await Project.findByIdAndUpdate(existing._id, projectData, { new: true });
        } else {
            project = new Project(projectData);
            await project.save();
        }

        res.status(201).json({
            success: true,
            message: `Successfully imported "${project.title}" from GitHub as ${project.status}`,
            project
        });
    } catch (error) {
        console.error('Error importing from GitHub:', error);
        res.status(500).json({ success: false, message: 'Failed to import repository', error: error.message });
    }
});

// Toggle publish status (admin only)
router.put('/:id/publish', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // If explicitly specified in body, set it; otherwise toggle
        if (req.body.status && ['published', 'draft'].includes(req.body.status)) {
            project.status = req.body.status;
        } else {
            project.status = project.status === 'draft' ? 'published' : 'draft';
        }

        project.updatedAt = new Date();
        await project.save();

        res.json({
            success: true,
            message: project.status === 'published' ? 'Project published publicly' : 'Project moved to draft',
            status: project.status,
            project
        });
    } catch (error) {
        console.error('Error toggling project publish status:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Synchronize repository metadata from GitHub (admin only)
router.post('/:id/sync', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.githubRepoFullName) {
            return res.status(400).json({ message: 'Project is not linked to any GitHub repository' });
        }

        const [owner, repo] = project.githubRepoFullName.split('/');
        if (!owner || !repo) {
            return res.status(400).json({ message: 'Invalid repository name format on project' });
        }

        const detailsRes = await githubService.getRepoDetails(owner, repo, { forceRefresh: true });
        const repoDetails = detailsRes.data;
        const s = repoDetails.suggested;

        project.githubMetadata = {
            stars: s.stars,
            forks: s.forks,
            primaryLanguage: repoDetails.repository.primary_language,
            languages: repoDetails.languages,
            topics: repoDetails.repository.topics,
            defaultBranch: s.defaultBranch,
            openIssues: repoDetails.repository.open_issues_count,
            repoCreatedAt: s.createdAt,
            repoPushedAt: s.pushedAt,
            readmeSummary: repoDetails.readme?.summary || project.githubMetadata?.readmeSummary || ''
        };
        project.lastSyncedAt = new Date();
        project.updatedAt = new Date();
        await project.save();

        res.json({
            success: true,
            message: `Synchronized telemetry for "${project.githubRepoFullName}"`,
            project
        });
    } catch (error) {
        console.error('Error syncing project GitHub telemetry:', error);
        res.status(500).json({ success: false, message: 'Failed to sync with GitHub', error: error.message });
    }
});

// Get single project
// For public visitors: strictly enforces published status (returns 404 for drafts/proposals/archived)
// For admin: allows previewing any project/proposal regardless of status
router.get('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isAdmin = isAdminRequest(req);

        // Strict Publication Check
        if (project.status !== 'published' && !isAdmin) {
            return res.status(404).json({ message: 'Project not found or not currently published' });
        }

        const doc = project.toObject();

        // Fetch related published projects
        try {
            const related = await Project.find({
                status: 'published',
                _id: { $ne: project._id },
                $or: [
                    { category: project.category },
                    { projectType: project.projectType }
                ]
            })
            .select('title category shortSummary description image images status projectType location')
            .limit(3)
            .lean();

            doc.relatedProjects = related || [];
        } catch (e) {
            doc.relatedProjects = [];
        }

        // Sanitize for public visitor
        if (!isAdmin) {
            delete doc.githubMetadata;
            delete doc.autoSyncMetrics;
            if (!doc.showGithubLink) {
                delete doc.githubUrl;
                delete doc.githubRepoUrl;
            }
        }

        res.json(doc);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update project publication lifecycle status (admin only)
// Statuses: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived'
router.put('/:id/status', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { status } = req.body;
        const validStatuses = ['draft', 'under_review', 'published', 'unpublished', 'archived'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Expected one of: ${validStatuses.join(', ')}`
            });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = status;
        project.updatedAt = new Date();
        await project.save();

        res.json({
            success: true,
            message: `Project status updated to "${status}"`,
            status: project.status,
            project
        });
    } catch (error) {
        console.error('Error updating project status:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Update proposal review status (admin only)
// proposalStatus: 'pending' | 'approved' | 'rejected'
router.put('/:id/proposal-status', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { proposalStatus, publishNow } = req.body;
        const valid = ['pending', 'approved', 'rejected'];
        if (!proposalStatus || !valid.includes(proposalStatus)) {
            return res.status(400).json({ message: `Invalid proposalStatus. Expected: ${valid.join(', ')}` });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.proposalStatus = proposalStatus;
        if (proposalStatus === 'approved' && publishNow) {
            project.status = 'published';
        } else if (proposalStatus === 'rejected') {
            project.status = 'unpublished';
        }
        project.updatedAt = new Date();
        await project.save();

        res.json({
            success: true,
            message: `Proposal marked as "${proposalStatus}"${project.status === 'published' ? ' and published publicly' : ''}`,
            project
        });
    } catch (error) {
        console.error('Error updating proposal status:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Manage project content sections (admin only)
router.post('/:id/sections', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { title, content, order, isVisible } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Section title is required' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newSection = {
            title: title.trim(),
            content: content?.trim() || '',
            order: typeof order === 'number' ? order : (project.contentSections?.length || 0),
            isVisible: isVisible !== false
        };

        if (!project.contentSections) project.contentSections = [];
        project.contentSections.push(newSection);
        project.updatedAt = new Date();
        await project.save();

        res.status(201).json({
            success: true,
            message: 'Content section added successfully',
            section: project.contentSections[project.contentSections.length - 1],
            project
        });
    } catch (error) {
        console.error('Error adding project section:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

router.put('/:id/sections/:sectionId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { title, content, order, isVisible } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const section = project.contentSections.id(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (title !== undefined) section.title = title.trim();
        if (content !== undefined) section.content = content.trim();
        if (order !== undefined) section.order = order;
        if (isVisible !== undefined) section.isVisible = isVisible;

        project.updatedAt = new Date();
        await project.save();

        res.json({ success: true, message: 'Section updated successfully', section, project });
    } catch (error) {
        console.error('Error updating project section:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

router.delete('/:id/sections/:sectionId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.contentSections.pull({ _id: req.params.sectionId });
        project.updatedAt = new Date();
        await project.save();

        res.json({ success: true, message: 'Section removed successfully', project });
    } catch (error) {
        console.error('Error deleting project section:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

router.put('/:id/sections-reorder', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const { sectionOrder } = req.body; // array of section IDs
        if (!Array.isArray(sectionOrder)) {
            return res.status(400).json({ message: 'sectionOrder must be an array of IDs' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        sectionOrder.forEach((id, idx) => {
            const sec = project.contentSections.id(id);
            if (sec) sec.order = idx;
        });

        project.contentSections.sort((a, b) => a.order - b.order);
        project.updatedAt = new Date();
        await project.save();

        res.json({ success: true, message: 'Sections reordered successfully', project });
    } catch (error) {
        console.error('Error reordering sections:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Create project (admin only)
router.post('/', auth, upload.single('image'), cloudinaryUpload, async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, demoUrl, role, isMini,
                githubRepoFullName, githubSourceScope, showGithubMetrics, autoSyncMetrics,
                category, highlights, status, pinned, githubRepoId, githubOwnerLogin, sourceType, githubMetadata,
                projectType, shortSummary, location, clientOrPartner, startDate, completionDate,
                proposalStatus, objectives, challenges, proposedSolution, expectedOutcomes, resultsAndImpact,
                equipment, showGithubLink, contentSections } = req.body;

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

        if (githubRepoFullName && !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(githubRepoFullName.trim())) {
            return res.status(400).json({ message: 'Invalid GitHub repository format. Expected: owner/repo' });
        }

        // Check for duplicate repository import
        if (githubRepoFullName && !req.body.allowDuplicate) {
            const existing = await Project.findOne({
                githubRepoFullName: { $regex: new RegExp(`^${githubRepoFullName.trim()}$`, 'i') }
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    isDuplicate: true,
                    existingProjectId: existing._id,
                    message: `Repository "${githubRepoFullName.trim()}" is already connected to project "${existing.title}".`
                });
            }
        }

        let parsedHighlights = [];
        if (highlights) {
            try {
                parsedHighlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
            } catch (e) {
                parsedHighlights = typeof highlights === 'string' ? highlights.split('\n').map(h => h.trim()).filter(Boolean) : [];
            }
        }

        let parsedObjectives = [];
        if (objectives) {
            try {
                parsedObjectives = typeof objectives === 'string' ? JSON.parse(objectives) : objectives;
            } catch (e) {
                parsedObjectives = typeof objectives === 'string' ? objectives.split('\n').map(o => o.trim()).filter(Boolean) : [];
            }
        }

        let parsedOutcomes = [];
        if (expectedOutcomes) {
            try {
                parsedOutcomes = typeof expectedOutcomes === 'string' ? JSON.parse(expectedOutcomes) : expectedOutcomes;
            } catch (e) {
                parsedOutcomes = typeof expectedOutcomes === 'string' ? expectedOutcomes.split('\n').map(o => o.trim()).filter(Boolean) : [];
            }
        }

        let parsedEquipment = [];
        if (equipment) {
            try {
                parsedEquipment = typeof equipment === 'string' ? JSON.parse(equipment) : equipment;
            } catch (e) {
                parsedEquipment = typeof equipment === 'string' ? equipment.split(',').map(e => e.trim()).filter(Boolean) : [];
            }
        }

        let parsedSections = [];
        if (contentSections) {
            try {
                parsedSections = typeof contentSections === 'string' ? JSON.parse(contentSections) : contentSections;
            } catch (e) {
                parsedSections = [];
            }
        }

        let parsedMetadata = {};
        if (githubMetadata) {
            try {
                parsedMetadata = typeof githubMetadata === 'string' ? JSON.parse(githubMetadata) : githubMetadata;
            } catch (e) {
                parsedMetadata = {};
            }
        }

        const resolvedSourceScope = githubSourceScope || (githubRepoFullName ? (githubRepoFullName.toLowerCase().startsWith('ariitimarket') ? 'ORGANIZATION' : 'PERSONAL') : null);
        const resolvedSourceType = sourceType || (resolvedSourceScope === 'ORGANIZATION' ? 'organization' : (resolvedSourceScope === 'PERSONAL' ? 'personal' : 'manual'));

        const validStatuses = ['draft', 'under_review', 'published', 'unpublished', 'archived'];
        const resolvedStatus = validStatuses.includes(status) ? status : 'draft';

        const validTypes = ['completed', 'ongoing', 'proposed'];
        const resolvedType = validTypes.includes(projectType) ? projectType : 'completed';

        const projectData = {
            title: title.trim(),
            category: category?.trim() || 'Enterprise Solutions',
            shortSummary: shortSummary?.trim() || '',
            description: description.trim(),
            location: location?.trim() || 'Addis Ababa, Ethiopia',
            clientOrPartner: clientOrPartner?.trim() || 'Ariiti Tech',
            startDate: startDate?.trim() || '',
            completionDate: completionDate?.trim() || '',
            projectType: resolvedType,
            status: resolvedStatus,
            pinned: pinned === 'true' || pinned === true,
            isMini: isMini === 'true' || isMini === true,
            proposalStatus: proposalStatus || 'pending',
            objectives: parsedObjectives,
            challenges: challenges?.trim() || '',
            proposedSolution: proposedSolution?.trim() || '',
            expectedOutcomes: parsedOutcomes,
            resultsAndImpact: resultsAndImpact?.trim() || '',
            contentSections: parsedSections,
            technologies: parsedTech,
            equipment: parsedEquipment,
            showGithubLink: showGithubLink === 'true' || showGithubLink === true,
            demoUrl: demoUrl?.trim() || '',
            githubUrl: githubUrl?.trim() || (githubRepoFullName ? `https://github.com/${githubRepoFullName.trim()}` : ''),
            role: role || 'Lead Software Architect',
            highlights: parsedHighlights,
            githubRepoId: githubRepoId ? Number(githubRepoId) : null,
            githubRepoFullName: githubRepoFullName ? githubRepoFullName.trim() : null,
            githubOwnerLogin: githubOwnerLogin ? githubOwnerLogin.trim() : (githubRepoFullName ? githubRepoFullName.split('/')[0] : null),
            githubRepoUrl: githubRepoFullName ? (githubUrl?.trim() || `https://github.com/${githubRepoFullName.trim()}`) : null,
            githubSourceScope: resolvedSourceScope,
            sourceType: resolvedSourceType,
            showGithubMetrics: showGithubMetrics === 'true' || showGithubMetrics === true,
            autoSyncMetrics: autoSyncMetrics === undefined ? true : (autoSyncMetrics === 'true' || autoSyncMetrics === true),
            lastSyncedAt: githubRepoFullName ? new Date() : null,
            githubMetadata: parsedMetadata,
            images: []
        };

        if (req.file && req.file.cloudinaryUrl) {
            projectData.image = req.file.cloudinaryUrl;
            projectData.images.push({
                url: req.file.cloudinaryUrl,
                public_id: req.file.public_id,
                title: 'Cover Image',
                caption: 'Primary project cover overview',
                imageType: 'overview',
                order: 0,
                isFeatured: true
            });
        } else if (req.body.image) {
            projectData.image = req.body.image;
            projectData.images.push({
                url: req.body.image,
                title: 'Cover Image',
                caption: 'Primary project cover overview',
                imageType: 'overview',
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

        const { title, description, technologies, githubUrl, demoUrl, role, isMini,
                githubRepoFullName, githubSourceScope, showGithubMetrics, autoSyncMetrics,
                category, highlights, status, pinned, githubRepoId, githubOwnerLogin, sourceType, githubMetadata,
                projectType, shortSummary, location, clientOrPartner, startDate, completionDate,
                proposalStatus, objectives, challenges, proposedSolution, expectedOutcomes, resultsAndImpact,
                equipment, showGithubLink, contentSections } = req.body;
        
        if (githubRepoFullName && !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(githubRepoFullName.trim())) {
            return res.status(400).json({ message: 'Invalid GitHub repository format. Expected: owner/repo' });
        }

        const updateData = {
            updatedAt: new Date()
        };

        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (shortSummary !== undefined) updateData.shortSummary = shortSummary.trim();
        if (category !== undefined) updateData.category = category.trim();
        if (location !== undefined) updateData.location = location.trim();
        if (clientOrPartner !== undefined) updateData.clientOrPartner = clientOrPartner.trim();
        if (startDate !== undefined) updateData.startDate = startDate.trim();
        if (completionDate !== undefined) updateData.completionDate = completionDate.trim();
        if (projectType !== undefined) updateData.projectType = projectType;
        if (status !== undefined) updateData.status = status;
        if (pinned !== undefined) updateData.pinned = pinned === 'true' || pinned === true;
        if (isMini !== undefined) updateData.isMini = isMini === 'true' || isMini === true;
        if (proposalStatus !== undefined) updateData.proposalStatus = proposalStatus;
        if (challenges !== undefined) updateData.challenges = challenges.trim();
        if (proposedSolution !== undefined) updateData.proposedSolution = proposedSolution.trim();
        if (resultsAndImpact !== undefined) updateData.resultsAndImpact = resultsAndImpact.trim();
        if (showGithubLink !== undefined) updateData.showGithubLink = showGithubLink === 'true' || showGithubLink === true;
        if (demoUrl !== undefined) updateData.demoUrl = demoUrl.trim();
        if (githubUrl !== undefined) updateData.githubUrl = githubUrl.trim();
        if (role !== undefined) updateData.role = role.trim();
        if (sourceType !== undefined) updateData.sourceType = sourceType;
        if (githubRepoId !== undefined) updateData.githubRepoId = githubRepoId ? Number(githubRepoId) : null;
        if (githubOwnerLogin !== undefined) updateData.githubOwnerLogin = githubOwnerLogin;

        if (technologies !== undefined) {
            updateData.technologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
        }

        if (equipment !== undefined) {
            try {
                updateData.equipment = typeof equipment === 'string' ? JSON.parse(equipment) : equipment;
            } catch (e) {
                updateData.equipment = typeof equipment === 'string' ? equipment.split(',').map(e => e.trim()).filter(Boolean) : equipment;
            }
        }

        if (objectives !== undefined) {
            try {
                updateData.objectives = typeof objectives === 'string' ? JSON.parse(objectives) : objectives;
            } catch (e) {
                updateData.objectives = typeof objectives === 'string' ? objectives.split('\n').map(o => o.trim()).filter(Boolean) : objectives;
            }
        }

        if (expectedOutcomes !== undefined) {
            try {
                updateData.expectedOutcomes = typeof expectedOutcomes === 'string' ? JSON.parse(expectedOutcomes) : expectedOutcomes;
            } catch (e) {
                updateData.expectedOutcomes = typeof expectedOutcomes === 'string' ? expectedOutcomes.split('\n').map(o => o.trim()).filter(Boolean) : expectedOutcomes;
            }
        }

        if (contentSections !== undefined) {
            try {
                updateData.contentSections = typeof contentSections === 'string' ? JSON.parse(contentSections) : contentSections;
            } catch (e) {
                // leave as is
            }
        }

        if (highlights !== undefined) {
            try {
                updateData.highlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
            } catch (e) {
                updateData.highlights = typeof highlights === 'string' ? highlights.split('\n').map(h => h.trim()).filter(Boolean) : highlights;
            }
        }

        if (githubMetadata !== undefined) {
            try {
                updateData.githubMetadata = typeof githubMetadata === 'string' ? JSON.parse(githubMetadata) : githubMetadata;
            } catch (e) {
                // Keep existing or leave as object
            }
        }

        if (githubRepoFullName !== undefined) {
            updateData.githubRepoFullName = githubRepoFullName ? githubRepoFullName.trim() : null;
            if (githubRepoFullName) {
                updateData.githubRepoUrl = githubUrl?.trim() || `https://github.com/${githubRepoFullName.trim()}`;
                if (!updateData.githubOwnerLogin) {
                    updateData.githubOwnerLogin = githubRepoFullName.split('/')[0];
                }
            } else {
                updateData.githubRepoUrl = null;
                updateData.githubRepoId = null;
                updateData.githubOwnerLogin = null;
            }
        }

        if (githubSourceScope !== undefined) {
            updateData.githubSourceScope = githubSourceScope || null;
            if (!sourceType) {
                updateData.sourceType = githubSourceScope === 'ORGANIZATION' ? 'organization' : (githubSourceScope === 'PERSONAL' ? 'personal' : 'manual');
            }
        }

        if (showGithubMetrics !== undefined) {
            updateData.showGithubMetrics = showGithubMetrics === 'true' || showGithubMetrics === true;
        }
        if (autoSyncMetrics !== undefined) {
            updateData.autoSyncMetrics = autoSyncMetrics === 'true' || autoSyncMetrics === true;
        }

        if (req.file && req.file.cloudinaryUrl) {
            updateData.image = req.file.cloudinaryUrl;
            const project = await Project.findById(req.params.id);
            if (project) {
                const existingUrls = project.images.map(img => img.url);
                if (!existingUrls.includes(req.file.cloudinaryUrl)) {
                    updateData.$push = {
                        images: {
                            url: req.file.cloudinaryUrl,
                            public_id: req.file.public_id,
                            title: 'Image ' + (project.images.length + 1),
                            caption: '',
                            imageType: 'general',
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
                title: req.body.titles?.[req.files.indexOf(file)] || req.body.title || `Image ${project.images.length + uploadedImages.length + 1}`,
                caption: req.body.captions?.[req.files.indexOf(file)] || req.body.caption || '',
                imageType: req.body.imageTypes?.[req.files.indexOf(file)] || req.body.imageType || 'general',
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

// Update image metadata (title, caption, imageType, isFeatured)
router.put('/:id/images/:imageId', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.imageId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const { title, caption, imageType, isFeatured } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const image = project.images.id(req.params.imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (title !== undefined) image.title = title;
        if (caption !== undefined) image.caption = caption;
        if (imageType !== undefined) {
            const validTypes = ['overview', 'installation', 'infrastructure', 'screenshot', 'before_after', 'implementation', 'general'];
            if (validTypes.includes(imageType)) image.imageType = imageType;
        }

        if (isFeatured !== undefined) {
            if (isFeatured) {
                // Unset all featured flags
                project.images.forEach(img => {
                    img.isFeatured = false;
                });
                image.isFeatured = true;
                project.image = image.url;
            } else {
                image.isFeatured = false;
            }
        }

        await project.save();

        res.json({ message: 'Image updated successfully', image, project });
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