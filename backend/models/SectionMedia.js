const mongoose = require('mongoose');

const sectionMediaSchema = new mongoose.Schema({
    projectSection: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectSection', required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    alt: { type: String },
    caption: { type: String },
    order: { type: Number, required: true, default: 0 },
    isPrimary: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SectionMedia', sectionMediaSchema);
