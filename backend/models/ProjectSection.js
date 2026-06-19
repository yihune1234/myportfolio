const mongoose = require('mongoose');

const projectSectionSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    isVisible: { type: Boolean, default: true },
    isDraft: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

projectSectionSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('content') || this.isModified('title') || this.isModified('isVisible') || this.isModified('isDraft')) {
        this.updatedAt = Date.now();
    }
    next();
});

module.exports = mongoose.model('ProjectSection', projectSectionSchema);
