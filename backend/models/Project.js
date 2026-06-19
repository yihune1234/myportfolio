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
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    image: { type: String },
    images: [projectImageSchema],
    githubUrl: { type: String },
    demoUrl: { type: String },
    role: { type: String, default: 'Developer' },
    isMini: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);