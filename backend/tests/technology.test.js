const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Technology = require('../models/Technology');
const { validCategories } = require('../models/Technology');
const { SEED_TECHNOLOGIES } = require('../controllers/technologyController');

describe('Technology Model & Seed Validation', () => {
    it('should have all 9 required official categories', () => {
        const requiredCategories = [
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

        for (const cat of requiredCategories) {
            assert.ok(validCategories.includes(cat), `Category "${cat}" must be in validCategories`);
        }
    });

    it('seed technologies should cover all specifically requested technologies', () => {
        const expectedSlugs = [
            'javascript', 'typescript', 'python', 'php',
            'react', 'nextjs', 'html5', 'css3', 'tailwindcss',
            'nodejs', 'express', 'nestjs',
            'reactnative', 'expo',
            'postgresql', 'mongodb', 'mysql', 'redis',
            'docker', 'git', 'github', 'linux',
            'figma', 'postman', 'vscode'
        ];

        const seedSlugs = SEED_TECHNOLOGIES.map(t => t.slug);
        for (const slug of expectedSlugs) {
            assert.ok(seedSlugs.includes(slug), `Seed stack must include "${slug}"`);
        }
    });

    it('each seed item should contain required fields and valid category', () => {
        for (const item of SEED_TECHNOLOGIES) {
            assert.ok(item.name, 'item name required');
            assert.ok(item.slug, 'item slug required');
            assert.ok(item.icon, 'item icon required');
            assert.ok(validCategories.includes(item.category), `Invalid category "${item.category}" for ${item.name}`);
            assert.ok(typeof item.featured === 'boolean', 'item.featured must be boolean');
            assert.ok(typeof item.visible === 'boolean', 'item.visible must be boolean');
        }
    });

    it('githubService.getHealthStatus should be a function and return health status', async () => {
        const { githubService } = require('../services/github/githubService');
        assert.equal(typeof githubService.getHealthStatus, 'function', 'getHealthStatus must be a function on githubService');
        assert.equal(typeof githubService.getHealth, 'function', 'getHealth must be a function on githubService');

        const health = await githubService.getHealthStatus();
        assert.ok(health, 'Health status object must be returned');
        assert.ok(['healthy', 'degraded'].includes(health.status), 'Health status must be healthy or degraded');
        assert.ok(health.sources, 'Health status must contain sources');
        assert.ok(health.sources.personal, 'Health status must contain personal source');
    });
});
