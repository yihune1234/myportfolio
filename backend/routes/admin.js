const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Validate ObjectId
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Setup initial admin (one-time use)
router.post('/setup', async (req, res) => {
    try {
        const { email, password, setupKey } = req.body;
        
        // Validate input
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        
        if (setupKey !== process.env.SETUP_KEY) {
            return res.status(403).json({ message: 'Invalid setup key' });
        }

        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ email: email.trim(), password: hashedPassword });
        await admin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login — restricted to owner only
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        
        res.json({ 
            success: true,
            token, 
            admin: { 
                id: admin._id, 
                email: admin.email,
                name: 'Yihune Belay'
            } 
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Get admin profile
router.get('/profile', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.adminId)) {
            return res.status(400).json({ message: 'Invalid admin ID' });
        }

        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update email
router.put('/email', auth, async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate input
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!isValidObjectId(req.adminId)) {
            return res.status(400).json({ message: 'Invalid admin ID' });
        }
        
        const existingAdmin = await Admin.findOne({ email: email.trim(), _id: { $ne: req.adminId } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const admin = await Admin.findByIdAndUpdate(
            req.adminId,
            { email: email.trim() },
            { new: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({ message: 'Email updated successfully', admin });
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update password
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        if (!isValidObjectId(req.adminId)) {
            return res.status(400).json({ message: 'Invalid admin ID' });
        }

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const SiteSettings = require('../models/SiteSettings');
const { githubScheduler } = require('../services/github/githubScheduler');
const { githubService } = require('../services/github/githubService');

// Get GitHub settings & health (admin only)
router.get('/github-settings', auth, async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'site_settings' });
        if (!settings) {
            settings = await SiteSettings.create({
                key: 'site_settings',
                githubUsername: process.env.GITHUB_USERNAME || 'yihune1234',
                githubOrg: process.env.GITHUB_ORG || 'AriitiMarket',
            });
        }

        const health = await githubService.getHealthStatus();
        res.json({ success: true, settings, health });
    } catch (error) {
        console.error('Error fetching GitHub settings:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Update GitHub settings (admin only)
router.put('/github-settings', auth, async (req, res) => {
    try {
        const {
            githubUsername,
            githubOrg,
            personalVisibility,
            orgVisibility,
            showHeroPulse,
            showSkillsIntegration,
            showEngineeringShowcase,
            autoSyncEnabled,
            syncIntervalMs,
            featuredRepos
        } = req.body;

        let settings = await SiteSettings.findOne({ key: 'site_settings' });
        if (!settings) {
            settings = new SiteSettings({ key: 'site_settings' });
        }

        if (githubUsername !== undefined) settings.githubUsername = githubUsername.trim();
        if (githubOrg !== undefined) settings.githubOrg = githubOrg.trim();
        if (personalVisibility !== undefined) settings.personalVisibility = Boolean(personalVisibility);
        if (orgVisibility !== undefined) settings.orgVisibility = Boolean(orgVisibility);
        if (showHeroPulse !== undefined) settings.showHeroPulse = Boolean(showHeroPulse);
        if (showSkillsIntegration !== undefined) settings.showSkillsIntegration = Boolean(showSkillsIntegration);
        if (showEngineeringShowcase !== undefined) settings.showEngineeringShowcase = Boolean(showEngineeringShowcase);
        if (autoSyncEnabled !== undefined) settings.autoSyncEnabled = Boolean(autoSyncEnabled);
        if (syncIntervalMs !== undefined) settings.syncIntervalMs = Number(syncIntervalMs);
        if (Array.isArray(featuredRepos)) settings.featuredRepos = featuredRepos;
        settings.updatedAt = new Date();

        await settings.save();
        githubService.cache.clear();

        res.json({ success: true, message: 'GitHub settings saved successfully', settings });
    } catch (error) {
        console.error('Error saving GitHub settings:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Trigger manual synchronization (admin only)
router.post('/github-sync', auth, async (req, res) => {
    try {
        const result = await githubScheduler.runOnce('admin_manual');
        const health = await githubService.getHealthStatus();
        res.json({ success: true, message: 'Synchronization triggered successfully', result, health });
    } catch (error) {
        console.error('Error triggering GitHub sync:', error);
        res.status(500).json({ success: false, message: 'Synchronization failed', error: error.message });
    }
});

// Get current theme (admin)
router.get('/theme', auth, async (req, res) => {
    try {
        let settings = await SiteSettings.findOne({ key: 'site_settings' });
        if (!settings) {
            settings = await SiteSettings.create({ key: 'site_settings' });
        }
        res.json({ success: true, theme: settings.theme });
    } catch (error) {
        console.error('Error fetching admin theme:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Update portfolio theme (admin only)
router.put('/theme', auth, async (req, res) => {
    try {
        const {
            preset,
            background,
            primary,
            primaryText,
            secondaryText,
            secondaryAccent,
            cardSurface,
            cardElevated,
            border
        } = req.body;

        let settings = await SiteSettings.findOne({ key: 'site_settings' });
        if (!settings) {
            settings = new SiteSettings({ key: 'site_settings' });
        }

        if (!settings.theme) {
            settings.theme = {};
        }

        if (preset !== undefined) settings.theme.preset = preset;
        if (background !== undefined) settings.theme.background = background.trim();
        if (primary !== undefined) settings.theme.primary = primary.trim();
        if (primaryText !== undefined) settings.theme.primaryText = primaryText.trim();
        if (secondaryText !== undefined) settings.theme.secondaryText = secondaryText.trim();
        if (secondaryAccent !== undefined) settings.theme.secondaryAccent = secondaryAccent.trim();
        if (cardSurface !== undefined) settings.theme.cardSurface = cardSurface.trim();
        if (cardElevated !== undefined) settings.theme.cardElevated = cardElevated.trim();
        if (border !== undefined) settings.theme.border = border.trim();
        settings.theme.updatedAt = new Date();
        settings.updatedAt = new Date();

        await settings.save();

        res.json({ success: true, message: 'Portfolio theme updated successfully', theme: settings.theme });
    } catch (error) {
        console.error('Error saving portfolio theme:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
