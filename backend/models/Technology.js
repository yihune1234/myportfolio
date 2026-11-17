const mongoose = require('mongoose');

const validCategories = [
    'Programming Languages',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Databases',
    'DevOps and Cloud',
    'Development Tools',
    'Design and Prototyping',
    'Frameworks and Libraries'
];

const technologySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        enum: validCategories,
        index: true
    },
    icon: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    experienceLevel: {
        type: String,
        trim: true,
        default: 'Production'
    },
    source: {
        type: String,
        enum: ['manual', 'github_detected'],
        default: 'manual',
        index: true
    },
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    visible: {
        type: Boolean,
        default: true,
        index: true
    },
    order: {
        type: Number,
        default: 0,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

technologySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Technology', technologySchema);
module.exports.validCategories = validCategories;
