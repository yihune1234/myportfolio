/**
 * Project Management & Showcase Controller
 * Handles project lifecycle, publication workflows, proposals, GitHub sync, multi-image galleries, and custom sections.
 */

const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const cloudinary = require('cloudinary').v2;
const { githubService } = require('../services/github/githubService');

const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

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

/**
 * Public & Admin Project Retrieval
 */
exports.getProjects = async (req, res) => {
    try {
        const includeAll = (req.query.includeDrafts === 'true' || req.query.all === 'true') && isAdminRequest(req);
        const filter = includeAll ? {} : { status: 'published' };

        if (req.query.type && ['completed', 'ongoing', 'proposed'].includes(req.query.type)) {
            filter.projectType = req.query.type;
        }

        if (req.query.category && req.query.category !== 'ALL') {
            filter.category = req.query.category;
        }

        if (req.query.proposalStatus) {
            filter.proposalStatus = req.query.proposalStatus;
        }

        // Ownership filter: PERSONAL vs ARIITII_TECH
        if (req.query.ownership) {
            const requestedOwnership = String(req.query.ownership).toUpperCase();
            if (requestedOwnership === 'PERSONAL') {
                filter.$or = [
                    { ownership: 'PERSONAL' },
                    { ownership: { $exists: false }, sourceType: { $ne: 'organization' }, githubSourceScope: { $ne: 'ORGANIZATION' } }
                ];
            } else if (requestedOwnership === 'ARIITII_TECH' || requestedOwnership === 'ORGANIZATION') {
                filter.$or = [
                    { ownership: 'ARIITII_TECH' },
                    { ownership: { $exists: false }, $or: [{ sourceType: 'organization' }, { githubSourceScope: 'ORGANIZATION' }, { clientOrPartner: /ariiti/i }] }
                ];
            }
        }

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

        if (!includeAll) {
            const sanitized = projects.map(p => {
                const doc = p.toObject();
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
};

exports.getAdminAll = async (req, res) => {
    try {
        const projects = await Project.find().sort({ pinned: -1, order: 1, createdAt: -1 });

        res.json({
            success: true,
            total: projects.length,
            counts: {
                published: projects.filter(p => p.status === 'published').length,
                draft: projects.filter(p => p.status === 'draft').length,
                under_review: projects.filter(p => p.status === 'under_review').length,
                unpublished: projects.filter(p => p.status === 'unpublished').length,
                archived: projects.filter(p => p.status === 'archived').length,
                completed: projects.filter(p => p.projectType === 'completed').length,
                ongoing: projects.filter(p => p.projectType === 'ongoing').length,
                proposed: projects.filter(p => p.projectType === 'proposed').length,
                pending_proposals: projects.filter(p => p.projectType === 'proposed' && p.proposalStatus === 'pending').length,
                approved_proposals: projects.filter(p => p.projectType === 'proposed' && p.proposalStatus === 'approved').length
            },
            projects
        });
    } catch (error) {
        console.error('Error fetching admin projects:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isAdmin = isAdminRequest(req);

        if (project.status !== 'published' && !isAdmin) {
            return res.status(404).json({ message: 'Project not found or not currently published' });
        }

        const doc = project.toObject();

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
};

/**
 * Import & Synchronization with GitHub
 */
exports.importGitHub = async (req, res) => {
    try {
        const { owner, repo, publishNow, category, role } = req.body;
        if (!owner || !repo) {
            return res.status(400).json({ success: false, message: 'owner and repo are required.' });
        }

        const repoDetails = await githubService.getRepoDetails(owner, repo);
        const { suggested, readme, raw } = repoDetails;

        const existingProject = await Project.findOne({
            $or: [
                { githubRepoId: raw.id },
                { githubRepoFullName: { $regex: new RegExp(`^${suggested.githubRepoFullName}$`, 'i') } }
            ]
        });

        if (existingProject) {
            return res.status(409).json({
                success: false,
                isDuplicate: true,
                existingProjectId: existingProject._id,
                message: `Repository "${suggested.githubRepoFullName}" is already imported as "${existingProject.title}".`
            });
        }

        const targetOwnership = req.body.ownership || (suggested.githubSourceScope === 'ORGANIZATION' ? 'ARIITII_TECH' : 'PERSONAL');

        const newProject = new Project({
            title: suggested.title,
            ownership: targetOwnership,
            developmentStatus: 'completed',
            clientOrPartner: targetOwnership === 'ARIITII_TECH' ? 'Ariitii Tech' : 'Personal Lab',
            description: suggested.description,
            shortSummary: suggested.description.slice(0, 150),
            technologies: suggested.technologies,
            githubUrl: suggested.githubUrl,
            githubRepoUrl: suggested.githubRepoUrl,
            demoUrl: suggested.demoUrl,
            role: role || suggested.role,
            category: category || suggested.category,
            projectType: 'completed',
            status: publishNow === true ? 'published' : 'draft',
            pinned: false,
            isMini: false,
            githubRepoId: suggested.githubRepoId,
            githubRepoFullName: suggested.githubRepoFullName,
            githubOwnerLogin: suggested.githubOwnerLogin,
            githubSourceScope: suggested.githubSourceScope,
            sourceType: suggested.sourceType,
            showGithubMetrics: true,
            autoSyncMetrics: true,
            showGithubLink: true,
            highlights: readme.summary ? [readme.summary.slice(0, 200)] : [],
            githubMetadata: {
                stars: raw.stargazers_count,
                forks: raw.forks_count,
                primaryLanguage: raw.language,
                openIssues: raw.open_issues_count,
                defaultBranch: raw.default_branch,
                pushedAt: raw.pushed_at,
                sizeKb: raw.size,
                topics: raw.topics || []
            },
            lastSyncedAt: new Date()
        });

        await newProject.save();

        res.status(201).json({
            success: true,
            message: `Successfully imported "${newProject.title}" from GitHub`,
            project: newProject
        });
    } catch (error) {
        console.error('GitHub Import Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to import repository from GitHub' });
    }
};

exports.syncProject = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        if (!project.githubRepoFullName) {
            return res.status(400).json({ success: false, message: 'Project has no linked GitHub repository' });
        }

        const [owner, repoName] = project.githubRepoFullName.split('/');
        const repoDetails = await githubService.getRepoDetails(owner, repoName);
        const { raw, suggested } = repoDetails;

        project.githubMetadata = {
            stars: raw.stargazers_count,
            forks: raw.forks_count,
            primaryLanguage: raw.language,
            openIssues: raw.open_issues_count,
            defaultBranch: raw.default_branch,
            pushedAt: raw.pushed_at,
            sizeKb: raw.size,
            topics: raw.topics || []
        };
        project.lastSyncedAt = new Date();

        if (!project.githubRepoId) project.githubRepoId = raw.id;
        if (!project.githubOwnerLogin) project.githubOwnerLogin = raw.owner?.login || owner;
        if (!project.githubSourceScope) project.githubSourceScope = suggested.githubSourceScope;

        await project.save();

        res.json({
            success: true,
            message: `Telemetry synchronized for ${project.githubRepoFullName}`,
            project
        });
    } catch (error) {
        console.error('Sync Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to sync with GitHub' });
    }
};

/**
 * Status & Lifecycle Handlers
 */
exports.togglePublish = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.status = project.status === 'published' ? 'draft' : 'published';
        project.updatedAt = new Date();
        await project.save();

        res.json({ success: true, status: project.status, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.togglePin = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.pinned = !project.pinned;
        project.updatedAt = new Date();
        await project.save();

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        const { status } = req.body;
        const validStatuses = ['draft', 'under_review', 'published', 'unpublished', 'archived'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.status = status;
        project.updatedAt = new Date();
        await project.save();

        res.json({
            success: true,
            message: `Project publication status updated to "${status}"`,
            status: project.status,
            project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProposalStatus = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        const { proposalStatus, publishNow } = req.body;
        const validStatuses = ['pending', 'approved', 'rejected'];

        if (!proposalStatus || !validStatuses.includes(proposalStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid proposalStatus. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.proposalStatus = proposalStatus;
        if (proposalStatus === 'approved' && publishNow === true) {
            project.status = 'published';
        }
        project.updatedAt = new Date();
        await project.save();

        res.json({
            success: true,
            message: `Proposal review status updated to "${proposalStatus}"`,
            proposalStatus: project.proposalStatus,
            project
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Creation & Modification CRUD
 */
exports.createProject = async (req, res) => {
    try {
        const {
            title, description, technologies, githubUrl, demoUrl, role, isMini,
            githubRepoFullName, githubSourceScope, showGithubMetrics, autoSyncMetrics,
            category, highlights, status, pinned, githubRepoId, githubOwnerLogin, sourceType, githubMetadata,
            projectType, shortSummary, location, clientOrPartner, startDate, completionDate,
            proposalStatus, objectives, challenges, proposedSolution, expectedOutcomes, resultsAndImpact,
            equipment, showGithubLink, contentSections
        } = req.body;

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

        const parseJSONorList = (input, delim = '\n') => {
            if (!input) return [];
            try {
                return typeof input === 'string' ? JSON.parse(input) : input;
            } catch (e) {
                return typeof input === 'string' ? input.split(delim).map(item => item.trim()).filter(Boolean) : [];
            }
        };

        let finalOwnership = 'PERSONAL';
        if (req.body.ownership === 'ARIITII_TECH' || req.body.ownership === 'PERSONAL') {
            finalOwnership = req.body.ownership;
        } else if (sourceType === 'organization' || githubSourceScope === 'ORGANIZATION' || /ariiti/i.test(clientOrPartner || '')) {
            finalOwnership = 'ARIITII_TECH';
        }

        const validDevStatuses = ['completed', 'in_progress', 'active', 'maintenance'];
        const devStatus = validDevStatuses.includes(req.body.developmentStatus) ? req.body.developmentStatus : 'completed';

        const project = new Project({
            title: title.trim(),
            ownership: finalOwnership,
            developmentStatus: devStatus,
            description: description.trim(),
            shortSummary: shortSummary ? shortSummary.trim() : description.trim().slice(0, 150),
            technologies: parsedTech,
            githubUrl: githubUrl ? githubUrl.trim() : undefined,
            githubRepoUrl: githubUrl ? githubUrl.trim() : undefined,
            demoUrl: demoUrl ? demoUrl.trim() : undefined,
            role: role ? role.trim() : 'Developer',
            category: category ? category.trim() : 'Full-Stack',
            location: location ? location.trim() : undefined,
            clientOrPartner: clientOrPartner ? clientOrPartner.trim() : (finalOwnership === 'ARIITII_TECH' ? 'Ariitii Tech' : 'Personal Lab'),
            startDate: startDate ? startDate.trim() : undefined,
            completionDate: completionDate ? completionDate.trim() : undefined,
            projectType: ['completed', 'ongoing', 'proposed'].includes(projectType) ? projectType : 'completed',
            status: ['draft', 'under_review', 'published', 'unpublished', 'archived'].includes(status) ? status : 'published',
            proposalStatus: ['pending', 'approved', 'rejected'].includes(proposalStatus) ? proposalStatus : 'pending',
            challenges: challenges ? challenges.trim() : undefined,
            proposedSolution: proposedSolution ? proposedSolution.trim() : undefined,
            objectives: parseJSONorList(objectives, '\n'),
            expectedOutcomes: parseJSONorList(expectedOutcomes, '\n'),
            resultsAndImpact: parseJSONorList(resultsAndImpact, '\n'),
            equipment: parseJSONorList(equipment, ','),
            contentSections: parseJSONorList(contentSections),
            pinned: pinned === 'true' || pinned === true,
            isMini: isMini === 'true' || isMini === true,
            showGithubLink: showGithubLink !== 'false' && showGithubLink !== false,
            githubRepoId: githubRepoId ? Number(githubRepoId) : null,
            githubRepoFullName: githubRepoFullName ? githubRepoFullName.trim() : '',
            githubOwnerLogin: githubOwnerLogin ? githubOwnerLogin.trim() : '',
            githubSourceScope: ['PERSONAL', 'ORGANIZATION'].includes(githubSourceScope) ? githubSourceScope : null,
            sourceType: ['personal', 'organization', 'manual'].includes(sourceType) ? sourceType : 'manual',
            showGithubMetrics: showGithubMetrics !== 'false' && showGithubMetrics !== false,
            autoSyncMetrics: autoSyncMetrics !== 'false' && autoSyncMetrics !== false,
            highlights: parseJSONorList(highlights, '\n'),
            githubMetadata: parseJSONorList(githubMetadata) || {},
            image: req.file ? (req.file.path || `/uploads/${req.file.filename}`) : undefined
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const {
            title, description, technologies, githubUrl, demoUrl, role, isMini,
            githubRepoFullName, githubSourceScope, showGithubMetrics, autoSyncMetrics,
            category, highlights, status, pinned, githubRepoId, githubOwnerLogin, sourceType, githubMetadata,
            projectType, shortSummary, location, clientOrPartner, startDate, completionDate,
            proposalStatus, objectives, challenges, proposedSolution, expectedOutcomes, resultsAndImpact,
            equipment, showGithubLink, contentSections
        } = req.body;

        if (githubRepoFullName && !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(githubRepoFullName.trim())) {
            return res.status(400).json({ message: 'Invalid GitHub repository format. Expected: owner/repo' });
        }

        const updateData = { updatedAt: new Date() };

        if (req.body.ownership !== undefined) {
            updateData.ownership = req.body.ownership === 'ARIITII_TECH' ? 'ARIITII_TECH' : 'PERSONAL';
            if (!req.body.clientOrPartner) {
                updateData.clientOrPartner = updateData.ownership === 'ARIITII_TECH' ? 'Ariitii Tech' : 'Personal Lab';
            }
        }
        if (req.body.developmentStatus !== undefined) {
            const validDevStatuses = ['completed', 'in_progress', 'active', 'maintenance'];
            if (validDevStatuses.includes(req.body.developmentStatus)) {
                updateData.developmentStatus = req.body.developmentStatus;
            }
        }

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
        if (role !== undefined) updateData.role = role.trim();
        if (githubUrl !== undefined) {
            updateData.githubUrl = githubUrl ? githubUrl.trim() : '';
            updateData.githubRepoUrl = updateData.githubUrl;
        }
        if (demoUrl !== undefined) updateData.demoUrl = demoUrl ? demoUrl.trim() : '';
        if (showGithubLink !== undefined) updateData.showGithubLink = showGithubLink !== 'false' && showGithubLink !== false;
        if (githubRepoFullName !== undefined) updateData.githubRepoFullName = githubRepoFullName ? githubRepoFullName.trim() : '';
        if (githubRepoId !== undefined) updateData.githubRepoId = githubRepoId ? Number(githubRepoId) : null;
        if (githubOwnerLogin !== undefined) updateData.githubOwnerLogin = githubOwnerLogin ? githubOwnerLogin.trim() : '';
        if (githubSourceScope !== undefined) updateData.githubSourceScope = githubSourceScope || null;
        if (sourceType !== undefined) updateData.sourceType = sourceType || 'manual';
        if (showGithubMetrics !== undefined) updateData.showGithubMetrics = showGithubMetrics !== 'false' && showGithubMetrics !== false;
        if (autoSyncMetrics !== undefined) updateData.autoSyncMetrics = autoSyncMetrics !== 'false' && autoSyncMetrics !== false;

        const parseJSONorList = (input, delim = '\n') => {
            if (!input) return [];
            try {
                return typeof input === 'string' ? JSON.parse(input) : input;
            } catch (e) {
                return typeof input === 'string' ? input.split(delim).map(item => item.trim()).filter(Boolean) : [];
            }
        };

        if (technologies !== undefined) {
            try {
                updateData.technologies = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
            } catch (e) {
                updateData.technologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];
            }
        }

        if (highlights !== undefined) updateData.highlights = parseJSONorList(highlights, '\n');
        if (objectives !== undefined) updateData.objectives = parseJSONorList(objectives, '\n');
        if (expectedOutcomes !== undefined) updateData.expectedOutcomes = parseJSONorList(expectedOutcomes, '\n');
        if (resultsAndImpact !== undefined) updateData.resultsAndImpact = parseJSONorList(resultsAndImpact, '\n');
        if (equipment !== undefined) updateData.equipment = parseJSONorList(equipment, ',');
        if (contentSections !== undefined) updateData.contentSections = parseJSONorList(contentSections);
        if (githubMetadata !== undefined) updateData.githubMetadata = parseJSONorList(githubMetadata) || {};

        if (req.file) {
            updateData.image = req.file.path || `/uploads/${req.file.filename}`;
        }

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.image && project.image.includes('cloudinary')) {
            try {
                const parts = project.image.split('/');
                const filenameWithExt = parts[parts.length - 1];
                const publicId = `portfolio/projects/${filenameWithExt.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (e) {
                console.warn('Cloudinary delete warning:', e.message);
            }
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Image Gallery Management
 */
exports.getImages = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        res.json({ success: true, data: project.images || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadImages = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        if (!req.files || !req.files.length) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const newImages = req.files.map((file, idx) => ({
            url: file.path || `/uploads/${file.filename}`,
            title: req.body.title || file.originalname || 'Screenshot',
            caption: req.body.caption || '',
            imageType: req.body.imageType || 'general',
            isFeatured: false,
            order: (project.images?.length || 0) + idx
        }));

        project.images = [...(project.images || []), ...newImages];
        await project.save();

        res.status(201).json({ success: true, data: project.images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        project.images = (project.images || []).filter(img => img._id.toString() !== req.params.imageId);
        await project.save();

        res.json({ success: true, data: project.images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateImage = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const img = (project.images || []).id(req.params.imageId);
        if (!img) return res.status(404).json({ success: false, message: 'Image not found' });

        if (req.body.isFeatured !== undefined) {
            if (req.body.isFeatured === true) {
                project.images.forEach(i => (i.isFeatured = false));
                img.isFeatured = true;
                project.image = img.url;
            } else {
                img.isFeatured = false;
            }
        }

        if (req.body.title !== undefined) img.title = req.body.title;
        if (req.body.caption !== undefined) img.caption = req.body.caption;
        if (req.body.imageType !== undefined) img.imageType = req.body.imageType;
        if (req.body.order !== undefined) img.order = req.body.order;

        await project.save();
        res.json({ success: true, data: project.images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.reorderImages = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const { imageIds } = req.body;
        if (!Array.isArray(imageIds)) {
            return res.status(400).json({ success: false, message: 'imageIds array is required' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const map = new Map(imageIds.map((id, index) => [id.toString(), index]));
        project.images.forEach(img => {
            if (map.has(img._id.toString())) {
                img.order = map.get(img._id.toString());
            }
        });

        project.images.sort((a, b) => a.order - b.order);
        await project.save();

        res.json({ success: true, data: project.images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Content Sections Management
 */
exports.addSection = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const { title, content, order } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'title and content are required' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const section = {
            title: title.trim(),
            content: content.trim(),
            order: typeof order === 'number' ? order : (project.contentSections?.length || 0)
        };

        project.contentSections = [...(project.contentSections || []), section];
        await project.save();

        res.status(201).json({ success: true, data: project.contentSections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSection = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const sec = (project.contentSections || []).id(req.params.sectionId);
        if (!sec) return res.status(404).json({ success: false, message: 'Section not found' });

        if (req.body.title !== undefined) sec.title = req.body.title.trim();
        if (req.body.content !== undefined) sec.content = req.body.content.trim();
        if (req.body.order !== undefined) sec.order = req.body.order;

        await project.save();
        res.json({ success: true, data: project.contentSections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        project.contentSections = (project.contentSections || []).filter(sec => sec._id.toString() !== req.params.sectionId);
        await project.save();

        res.json({ success: true, data: project.contentSections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.reorderSections = async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid project ID' });
        }
        const { sectionIds } = req.body;
        if (!Array.isArray(sectionIds)) {
            return res.status(400).json({ success: false, message: 'sectionIds array is required' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const map = new Map(sectionIds.map((id, index) => [id.toString(), index]));
        project.contentSections.forEach(sec => {
            if (map.has(sec._id.toString())) {
                sec.order = map.get(sec._id.toString());
            }
        });

        project.contentSections.sort((a, b) => a.order - b.order);
        await project.save();

        res.json({ success: true, data: project.contentSections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
