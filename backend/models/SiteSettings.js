const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'site_settings', unique: true },
    githubUsername: { type: String, default: 'yihune1234' },
    githubOrg: { type: String, default: 'AriitiMarket' },
    personalVisibility: { type: Boolean, default: true },
    orgVisibility: { type: Boolean, default: true },
    personalEnabled: { type: Boolean, default: true },
    orgEnabled: { type: Boolean, default: true },
    personalValidatedUrl: { type: String, default: 'https://github.com/yihune1234' },
    orgValidatedUrl: { type: String, default: 'https://github.com/AriitiMarket' },
    lastPersonalSync: { type: Date },
    lastOrgSync: { type: Date },
    showHeroPulse: { type: Boolean, default: true },
    showSkillsIntegration: { type: Boolean, default: true },
    showEngineeringShowcase: { type: Boolean, default: true },
    autoSyncEnabled: { type: Boolean, default: true },
    syncIntervalMs: { type: Number, default: 900000 },
    featuredRepos: [{ type: String }],
    theme: {
        preset: { type: String, default: 'warm-charcoal' },
        background: { type: String, default: '#302E2D' },
        primary: { type: String, default: '#FFDD9B' },
        primaryText: { type: String, default: '#FFFFFF' },
        secondaryText: { type: String, default: '#FFF1D8' },
        secondaryAccent: { type: String, default: '#FFDD9B' },
        cardSurface: { type: String, default: '#403C38' },
        cardElevated: { type: String, default: '#4A4642' },
        border: { type: String, default: 'rgba(255, 221, 155, 0.18)' },
        updatedAt: { type: Date, default: Date.now }
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
