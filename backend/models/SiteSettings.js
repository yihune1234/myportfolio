const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'site_settings', unique: true },
    githubUsername: { type: String, default: 'yihune1234' },
    githubOrg: { type: String, default: 'AriitiMarket' },
    personalVisibility: { type: Boolean, default: true },
    orgVisibility: { type: Boolean, default: true },
    showHeroPulse: { type: Boolean, default: true },
    showSkillsIntegration: { type: Boolean, default: true },
    showEngineeringShowcase: { type: Boolean, default: true },
    autoSyncEnabled: { type: Boolean, default: true },
    syncIntervalMs: { type: Number, default: 900000 },
    featuredRepos: [{ type: String }],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
