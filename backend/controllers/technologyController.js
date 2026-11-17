const Technology = require('../models/Technology');
const { githubService } = require('../services/github/githubService');
const SiteSettings = require('../models/SiteSettings');

const SEED_TECHNOLOGIES = [
    // Programming Languages
    {
        name: 'TypeScript',
        slug: 'typescript',
        category: 'Programming Languages',
        icon: 'typescript',
        description: 'Typed JavaScript superset for scalable, enterprise-grade architecture',
        experienceLevel: 'Primary Stack',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'JavaScript',
        slug: 'javascript',
        category: 'Programming Languages',
        icon: 'javascript',
        description: 'Modern ES6+ for full-stack web and cross-platform native logic',
        experienceLevel: 'Primary Stack',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },
    {
        name: 'Python',
        slug: 'python',
        category: 'Programming Languages',
        icon: 'python',
        description: 'Scripting, backend asynchronous APIs, automation, and data operations',
        experienceLevel: 'Advanced',
        source: 'manual',
        featured: true,
        visible: true,
        order: 3
    },
    {
        name: 'PHP',
        slug: 'php',
        category: 'Programming Languages',
        icon: 'php',
        description: 'Server-side web engineering and enterprise application backend solutions',
        experienceLevel: 'Production',
        source: 'manual',
        featured: false,
        visible: true,
        order: 4
    },
    {
        name: 'HTML5',
        slug: 'html5',
        category: 'Programming Languages',
        icon: 'html5',
        description: 'Semantic document markup, accessibility standards, and web structure',
        experienceLevel: 'Semantic Core',
        source: 'manual',
        featured: false,
        visible: true,
        order: 5
    },
    {
        name: 'CSS3',
        slug: 'css3',
        category: 'Programming Languages',
        icon: 'css3',
        description: 'Modern CSS Grid, Flexbox, responsive layouts, and fluid transitions',
        experienceLevel: 'Advanced Layouts',
        source: 'manual',
        featured: false,
        visible: true,
        order: 6
    },

    // Frontend Development
    {
        name: 'React',
        slug: 'react',
        category: 'Frontend Development',
        icon: 'react',
        description: 'Component architecture, custom hooks, and high-performance SPA state',
        experienceLevel: 'Primary Stack',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'Next.js',
        slug: 'nextjs',
        category: 'Frontend Development',
        icon: 'nextjs',
        description: 'Hybrid SSR/SSG framework with API routes and edge performance',
        experienceLevel: 'Production Framework',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },
    {
        name: 'Tailwind CSS',
        slug: 'tailwindcss',
        category: 'Frontend Development',
        icon: 'tailwindcss',
        description: 'Utility-first CSS architecture for custom responsive design systems',
        experienceLevel: 'Daily Driver',
        source: 'manual',
        featured: true,
        visible: true,
        order: 3
    },

    // Backend Development
    {
        name: 'Node.js',
        slug: 'nodejs',
        category: 'Backend Development',
        icon: 'nodejs',
        description: 'Asynchronous event-driven JavaScript/TypeScript backend runtime',
        experienceLevel: 'Primary Runtime',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'Express.js',
        slug: 'express',
        category: 'Backend Development',
        icon: 'express',
        description: 'Lightweight RESTful API framework with modular middleware routing',
        experienceLevel: 'Production Core',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },
    {
        name: 'NestJS',
        slug: 'nestjs',
        category: 'Backend Development',
        icon: 'nestjs',
        description: 'Structured enterprise TypeScript backend with dependency injection',
        experienceLevel: 'Enterprise Tier',
        source: 'manual',
        featured: true,
        visible: true,
        order: 3
    },

    // Mobile Development
    {
        name: 'React Native',
        slug: 'reactnative',
        category: 'Mobile Development',
        icon: 'reactnative',
        description: 'Native cross-platform mobile application development for Android & iOS',
        experienceLevel: 'Production',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'Expo',
        slug: 'expo',
        category: 'Mobile Development',
        icon: 'expo',
        description: 'Managed workflow, native OTA updates, and universal build ecosystem',
        experienceLevel: 'Production Toolchain',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },

    // Databases
    {
        name: 'PostgreSQL',
        slug: 'postgresql',
        category: 'Databases',
        icon: 'postgresql',
        description: 'Relational ACID persistence with advanced indexing and JSONB queries',
        experienceLevel: 'Primary Relational',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'MongoDB',
        slug: 'mongodb',
        category: 'Databases',
        icon: 'mongodb',
        description: 'Document database for flexible schemas, aggregation, and distributed models',
        experienceLevel: 'Document Store',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },
    {
        name: 'MySQL',
        slug: 'mysql',
        category: 'Databases',
        icon: 'mysql',
        description: 'High-performance transactional relational database storage',
        experienceLevel: 'Relational Standard',
        source: 'manual',
        featured: false,
        visible: true,
        order: 3
    },
    {
        name: 'Redis',
        slug: 'redis',
        category: 'Databases',
        icon: 'redis',
        description: 'In-memory data store, high-speed cache, and pub/sub message broker',
        experienceLevel: 'Caching & State',
        source: 'manual',
        featured: true,
        visible: true,
        order: 4
    },

    // DevOps and Cloud
    {
        name: 'Docker',
        slug: 'docker',
        category: 'DevOps and Cloud',
        icon: 'docker',
        description: 'Containerization, reproducible environment manifests, and microservices',
        experienceLevel: 'Daily Driver',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'Git',
        slug: 'git',
        category: 'DevOps and Cloud',
        icon: 'git',
        description: 'Distributed version control, branching strategies, and repository hygiene',
        experienceLevel: 'Core Standard',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },
    {
        name: 'GitHub',
        slug: 'github',
        category: 'DevOps and Cloud',
        icon: 'github',
        description: 'Collaborative engineering workflows, actions, and repository governance',
        experienceLevel: 'Daily Driver',
        source: 'manual',
        featured: true,
        visible: true,
        order: 3
    },
    {
        name: 'Linux',
        slug: 'linux',
        category: 'DevOps and Cloud',
        icon: 'linux',
        description: 'Server environment administration, shell scripting, and service security',
        experienceLevel: 'Production Environment',
        source: 'manual',
        featured: true,
        visible: true,
        order: 4
    },

    // Development Tools
    {
        name: 'VS Code',
        slug: 'vscode',
        category: 'Development Tools',
        icon: 'vscode',
        description: 'Configured developer environment with TypeScript language servers',
        experienceLevel: 'Primary Editor',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'Postman',
        slug: 'postman',
        category: 'Development Tools',
        icon: 'postman',
        description: 'API endpoint inspection, mock servers, and automated integration tests',
        experienceLevel: 'Testing & QA',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    },

    // Design and Prototyping
    {
        name: 'Figma',
        slug: 'figma',
        category: 'Design and Prototyping',
        icon: 'figma',
        description: 'Product wireframing, high-fidelity UI design, and responsive prototyping',
        experienceLevel: 'UI/UX Prototyping',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },

    // Frameworks and Libraries
    {
        name: 'Vite',
        slug: 'vite',
        category: 'Frameworks and Libraries',
        icon: 'vite',
        description: 'Next-generation ES-module frontend build tool and hot module replacement',
        experienceLevel: 'Primary Bundler',
        source: 'manual',
        featured: true,
        visible: true,
        order: 1
    },
    {
        name: 'Framer Motion',
        slug: 'framermotion',
        category: 'Frameworks and Libraries',
        icon: 'framermotion',
        description: 'Production-ready declarative physics animations and page transition engine',
        experienceLevel: 'UI Animation',
        source: 'manual',
        featured: true,
        visible: true,
        order: 2
    }
];

exports.SEED_TECHNOLOGIES = SEED_TECHNOLOGIES;

/**
 * Get all technologies
 */
exports.getTechnologies = async (req, res) => {
    const showAll = req.query.all === 'true';
    const filter = showAll ? {} : { visible: true };

    try {
        let items = await Technology.find(filter).sort({ order: 1, name: 1 });

        // If collection is completely empty, seed automatically
        if (items.length === 0) {
            try {
                await Technology.insertMany(SEED_TECHNOLOGIES);
                items = await Technology.find(filter).sort({ order: 1, name: 1 });
            } catch (seedErr) {
                console.warn('Auto-seed warning:', seedErr.message);
                items = SEED_TECHNOLOGIES.filter(t => (showAll ? true : t.visible));
            }
        }

        res.json({
            success: true,
            count: items.length,
            technologies: items
        });
    } catch (error) {
        console.warn('Warning: Database unavailable or query timed out, serving verified technology stack:', error.message);
        const fallback = SEED_TECHNOLOGIES.filter(t => (showAll ? true : t.visible));
        res.json({
            success: true,
            count: fallback.length,
            technologies: fallback,
            fallback: true
        });
    }
};

/**
 * Create a new technology
 */
exports.createTechnology = async (req, res) => {
    try {
        const { name, category, icon, description, experienceLevel, source, featured, visible, order } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Technology name is required.' });
        }
        if (!category) {
            return res.status(400).json({ success: false, message: 'Category is required.' });
        }
        if (!icon) {
            return res.status(400).json({ success: false, message: 'Icon identifier is required.' });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const existing = await Technology.findOne({ slug });
        if (existing) {
            return res.status(409).json({ success: false, message: `Technology with slug "${slug}" already exists.` });
        }

        const tech = new Technology({
            name: name.trim(),
            slug,
            category,
            icon: icon.trim().toLowerCase(),
            description: description ? description.trim() : '',
            experienceLevel: experienceLevel ? experienceLevel.trim() : 'Production',
            source: source === 'github_detected' ? 'github_detected' : 'manual',
            featured: Boolean(featured),
            visible: visible !== false,
            order: Number(order) || 0
        });

        await tech.save();

        res.status(201).json({
            success: true,
            message: `Created technology "${tech.name}"`,
            technology: tech
        });
    } catch (error) {
        console.error('Error creating technology:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create technology' });
    }
};

/**
 * Update an existing technology
 */
exports.updateTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const tech = await Technology.findById(id);

        if (!tech) {
            return res.status(404).json({ success: false, message: 'Technology not found.' });
        }

        const { name, category, icon, description, experienceLevel, source, featured, visible, order } = req.body;

        if (name && name.trim()) {
            tech.name = name.trim();
            tech.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (category) tech.category = category;
        if (icon) tech.icon = icon.trim().toLowerCase();
        if (typeof description !== 'undefined') tech.description = description.trim();
        if (typeof experienceLevel !== 'undefined') tech.experienceLevel = experienceLevel.trim();
        if (source) tech.source = source;
        if (typeof featured !== 'undefined') tech.featured = Boolean(featured);
        if (typeof visible !== 'undefined') tech.visible = Boolean(visible);
        if (typeof order !== 'undefined') tech.order = Number(order);

        tech.updatedAt = new Date();
        await tech.save();

        res.json({
            success: true,
            message: `Updated technology "${tech.name}"`,
            technology: tech
        });
    } catch (error) {
        console.error('Error updating technology:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to update technology' });
    }
};

/**
 * Delete a technology
 */
exports.deleteTechnology = async (req, res) => {
    try {
        const { id } = req.params;
        const tech = await Technology.findByIdAndDelete(id);

        if (!tech) {
            return res.status(404).json({ success: false, message: 'Technology not found.' });
        }

        res.json({
            success: true,
            message: `Deleted technology "${tech.name}"`
        });
    } catch (error) {
        console.error('Error deleting technology:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to delete technology' });
    }
};

/**
 * Reset / Seed technologies to verified stack
 */
exports.seedTechnologies = async (req, res) => {
    try {
        let created = 0;
        let updated = 0;

        for (const seedItem of SEED_TECHNOLOGIES) {
            const existing = await Technology.findOne({ slug: seedItem.slug });
            if (!existing) {
                await Technology.create(seedItem);
                created++;
            } else {
                existing.category = seedItem.category;
                existing.icon = seedItem.icon;
                if (!existing.description) existing.description = seedItem.description;
                if (!existing.experienceLevel) existing.experienceLevel = seedItem.experienceLevel;
                await existing.save();
                updated++;
            }
        }

        const all = await Technology.find().sort({ order: 1, name: 1 });

        res.json({
            success: true,
            message: `Synchronized technologies: ${created} created, ${updated} verified.`,
            count: all.length,
            technologies: all
        });
    } catch (error) {
        console.error('Error seeding technologies:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to seed technologies' });
    }
};

/**
 * Detect & sync technologies from connected GitHub repositories
 */
exports.syncWithGitHub = async (req, res) => {
    try {
        const settings = await SiteSettings.findOne({ key: 'site_settings' });
        const username = settings?.githubUsername || 'yihune1234';
        const org = settings?.githubOrg || 'AriitiMarket';

        // Fetch repository languages
        let personalLangRes = null;
        let orgLangRes = null;

        try {
            personalLangRes = await githubService.getLanguages(username, false);
        } catch (e) {
            console.warn('GitHub personal languages fetch error:', e.message);
        }

        try {
            if (org) {
                orgLangRes = await githubService.getLanguages(org, true);
            }
        } catch (e) {
            console.warn('GitHub org languages fetch error:', e.message);
        }

        const detectedLanguages = new Set();
        if (personalLangRes?.languages) {
            personalLangRes.languages.forEach(l => detectedLanguages.add(l.language.toLowerCase()));
        }
        if (orgLangRes?.languages) {
            orgLangRes.languages.forEach(l => detectedLanguages.add(l.language.toLowerCase()));
        }

        let flaggedCount = 0;
        const allTechnologies = await Technology.find();

        for (const tech of allTechnologies) {
            const matchesLang = detectedLanguages.has(tech.name.toLowerCase()) ||
                detectedLanguages.has(tech.slug.toLowerCase());

            if (matchesLang && tech.source !== 'github_detected') {
                tech.source = 'github_detected';
                tech.updatedAt = new Date();
                await tech.save();
                flaggedCount++;
            }
        }

        const refreshed = await Technology.find().sort({ order: 1, name: 1 });

        res.json({
            success: true,
            message: `GitHub sync complete. Identified ${detectedLanguages.size} repository language(s); flagged ${flaggedCount} matching technology entries.`,
            detectedLanguages: Array.from(detectedLanguages),
            flaggedCount,
            technologies: refreshed
        });
    } catch (error) {
        console.error('Error syncing with GitHub:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to sync with GitHub' });
    }
};
