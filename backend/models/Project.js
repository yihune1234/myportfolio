const mongoose = require('mongoose');

const projectImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String },
    title: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    technologies: [{ type: String, trim: true }],
    image: { type: String },
    images: [projectImageSchema],
    githubUrl: { type: String, trim: true },
    demoUrl: { type: String, trim: true },
    role: { type: String, default: 'Developer', trim: true },
    category: { type: String, default: 'Full-Stack', trim: true },
    highlights: [{ type: String, trim: true }],
    isMini: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'published', index: true },

    // Stable GitHub references
    githubRepoId: { type: Number, default: null, index: true },
    githubRepoFullName: { type: String, default: null, trim: true, index: true },
    githubOwnerLogin: { type: String, default: null, trim: true },
    githubRepoUrl: { type: String, default: null, trim: true },
    githubSourceScope: { type: String, enum: ['PERSONAL', 'ORGANIZATION', null], default: null },
    sourceType: { type: String, enum: ['personal', 'organization', 'manual'], default: 'manual' },

    // Telemetry and Synchronization
    showGithubMetrics: { type: Boolean, default: true },
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

module.exports = mongoose.model('Project', projectSchema);
