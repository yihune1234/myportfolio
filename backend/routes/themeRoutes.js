const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');

const DEFAULT_THEME = {
    preset: 'warm-charcoal',
    background: '#302E2D',
    primary: '#FFDD9B',
    primaryText: '#FFFFFF',
    secondaryText: '#FFF1D8',
    secondaryAccent: '#FFDD9B',
    cardSurface: '#403C38',
    cardElevated: '#4A4642',
    border: 'rgba(255, 221, 155, 0.18)'
};

// GET /api/theme — Public endpoint returning the current portfolio theme
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne({ key: 'site_settings' });
        if (!settings || !settings.theme || !settings.theme.background) {
            return res.json({ success: true, theme: DEFAULT_THEME });
        }
        res.json({
            success: true,
            theme: {
                preset: settings.theme.preset || DEFAULT_THEME.preset,
                background: settings.theme.background || DEFAULT_THEME.background,
                primary: settings.theme.primary || DEFAULT_THEME.primary,
                primaryText: settings.theme.primaryText || DEFAULT_THEME.primaryText,
                secondaryText: settings.theme.secondaryText || DEFAULT_THEME.secondaryText,
                secondaryAccent: settings.theme.secondaryAccent || DEFAULT_THEME.secondaryAccent,
                cardSurface: settings.theme.cardSurface || DEFAULT_THEME.cardSurface,
                cardElevated: settings.theme.cardElevated || DEFAULT_THEME.cardElevated,
                border: settings.theme.border || DEFAULT_THEME.border
            }
        });
    } catch (err) {
        console.error('Error fetching theme:', err);
        res.json({ success: true, theme: DEFAULT_THEME });
    }
});

// PUT /api/theme — Admin endpoint to update portfolio theme
router.put('/', auth, async (req, res) => {
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
        if (background !== undefined) settings.theme.background = String(background).trim();
        if (primary !== undefined) settings.theme.primary = String(primary).trim();
        if (primaryText !== undefined) settings.theme.primaryText = String(primaryText).trim();
        if (secondaryText !== undefined) settings.theme.secondaryText = String(secondaryText).trim();
        if (secondaryAccent !== undefined) settings.theme.secondaryAccent = String(secondaryAccent).trim();
        if (cardSurface !== undefined) settings.theme.cardSurface = String(cardSurface).trim();
        if (cardElevated !== undefined) settings.theme.cardElevated = String(cardElevated).trim();
        if (border !== undefined) settings.theme.border = String(border).trim();
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
