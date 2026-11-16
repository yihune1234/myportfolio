const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');

const DEFAULT_THEME = {
    preset: 'warm-charcoal',
    background: '#302E2D',
    primary: '#FFDD9B',
    primaryText: '#FFFFFF',
    secondaryText: '#FFF1D8',
    secondaryAccent: '#FFDD9B',
    cardSurface: '#3A3836',
    cardElevated: '#444240',
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

module.exports = router;
