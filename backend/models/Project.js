const mongoose = require('mongoose');

const projectImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String },
    title: { type: String, default: '' },
    caption: { type: String, default: '' },
    imageType: {
        type: String,
        enum: ['overview', 'installation', 'infrastructure', 'screenshot', 'before_after', 'implementation', 'general'],
        default: 'general'
    },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const contentSectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    ownership: {
        type: String,
        enum: ['PERSONAL', 'ARIITII_TECH'],
        default: 'PERSONAL',
        index: true
    },
    developmentStatus: {
        type: String,
        enum: ['completed', 'in_progress', 'active', 'maintenance'],
        default: 'completed',
        index: true
    },
    category: { type: String, default: 'Enterprise Solutions', trim: true },
    shortSummary: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, default: 'Addis Ababa, Ethiopia', trim: true },
    clientOrPartner: { type: String, default: 'Ariiti Tech', trim: true },
    startDate: { type: String, default: '', trim: true },
    completionDate: { type: String, default: '', trim: true },

    // Publication and Workflow Lifecycle
    status: {
        type: String,
        enum: ['draft', 'under_review', 'published', 'unpublished', 'archived'],
        default: 'draft',
        index: true
    },
    projectType: {
        type: String,
        enum: ['completed', 'ongoing', 'proposed'],
        default: 'completed',
        index: true
    },
    pinned: { type: Boolean, default: false },
    isMini: { type: Boolean, default: false },
    order: { type: Number, default: 0 },

    // Proposal-Specific Fields
    proposalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    objectives: [{ type: String, trim: true }],
    challenges: { type: String, default: '', trim: true },
    proposedSolution: { type: String, default: '', trim: true },
    expectedOutcomes: [{ type: String, trim: true }],
    resultsAndImpact: [{ type: String, trim: true }],

    // Content Sections & Gallery
    contentSections: [contentSectionSchema],
    technologies: [{ type: String, trim: true }],
    equipment: [{ type: String, trim: true }],
    image: { type: String },
    images: [projectImageSchema],

    // Public Links (admin-controlled)
    demoUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    showGithubLink: { type: Boolean, default: false },

    // Connected Repository References
    role: { type: String, default: 'Lead Software Architect', trim: true },
    highlights: [{ type: String, trim: true }],
    githubRepoId: { type: Number, default: null, index: true },
    githubRepoFullName: { type: String, default: null, trim: true, index: true },
    githubOwnerLogin: { type: String, default: null, trim: true },
    githubRepoUrl: { type: String, default: null, trim: true },
    githubSourceScope: { type: String, enum: ['PERSONAL', 'ORGANIZATION', null], default: null },
    sourceType: { type: String, enum: ['personal', 'organization', 'manual'], default: 'manual' },

    // Telemetry and Synchronization
    showGithubMetrics: { type: Boolean, default: false },
    autoSyncMetrics: { type: Boolean, default: true },
    lastSyncedAt: { type: Date, default: null },

    // Isolated imported metadata
    githubMetadata: {
        stars: { type: Number, default: 0 },
        forks: { type: Number, default: 0 },
        primaryLanguage: { type: String, default: null },
        languages: { type: mongoose.Schema.Types.Mixed, default: {} },
        topics: [{ type: String }],
        defaultBranch: { type: String, default: 'main' },
        openIssues: { type: Number, default: 0 },
        repoCreatedAt: { type: Date },
        repoPushedAt: { type: Date },
        readmeSummary: { type: String, default: '' }
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

projectSchema.pre('save', function (next) {
    if (!this.ownership) {
        if (this.sourceType === 'organization' || this.githubSourceScope === 'ORGANIZATION' || /ariiti/i.test(this.clientOrPartner || '')) {
            this.ownership = 'ARIITII_TECH';
        } else {
            this.ownership = 'PERSONAL';
        }
    }
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Project', projectSchema);

