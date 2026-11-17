const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Project = require('../models/Project');

test('Project Schema Lifecycle & Proposal Support', async (t) => {
    await t.test('should validate project statuses correctly', () => {
        const validStatuses = ['draft', 'under_review', 'published', 'unpublished', 'archived'];
        for (const st of validStatuses) {
            const doc = new Project({
                title: `Test ${st}`,
                description: 'Test description',
                technologies: ['Node.js'],
                status: st
            });
            assert.equal(doc.status, st);
        }
    });

    await t.test('should validate project types correctly', () => {
        const validTypes = ['completed', 'ongoing', 'proposed'];
        for (const pt of validTypes) {
            const doc = new Project({
                title: `Test ${pt}`,
                description: 'Test description',
                technologies: ['React'],
                projectType: pt
            });
            assert.equal(doc.projectType, pt);
        }
    });

    await t.test('should validate proposal fields and proposalStatus', () => {
        const doc = new Project({
            title: 'Proposed Agri-Platform',
            description: 'A platform for regional agriculture distribution',
            technologies: ['Python', 'PostgreSQL'],
            projectType: 'proposed',
            proposalStatus: 'pending',
            objectives: ['Improve distribution speed', 'Reduce post-harvest loss'],
            challenges: 'Fragmented supply chains in rural zones',
            proposedSolution: 'Decentralized inventory routing service',
            expectedOutcomes: ['30% reduction in wastage'],
            resultsAndImpact: ['Pre-deployment pilot with 5 cooperatives'],
            equipment: ['Edge IoT gateways', 'Solar battery backup'],
            showGithubLink: false,
        });

        assert.equal(doc.projectType, 'proposed');
        assert.equal(doc.proposalStatus, 'pending');
        assert.equal(doc.objectives.length, 2);
        assert.equal(doc.challenges, 'Fragmented supply chains in rural zones');
        assert.equal(doc.proposedSolution, 'Decentralized inventory routing service');
        assert.equal(doc.expectedOutcomes[0], '30% reduction in wastage');
        assert.equal(doc.equipment[0], 'Edge IoT gateways');
        assert.equal(doc.showGithubLink, false);
    });

    await t.test('should support multiple images with captions and imageType', () => {
        const doc = new Project({
            title: 'Multi-Image Project',
            description: 'Visual architecture project',
            technologies: ['Vue', 'Express'],
            images: [
                {
                    url: 'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
                    title: 'Overview Architecture',
                    caption: 'System block diagram and message broker',
                    imageType: 'infrastructure',
                    isFeatured: true,
                    order: 0
                },
                {
                    url: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
                    title: 'Merchant Checkout',
                    caption: 'Mobile responsive checkout view',
                    imageType: 'screenshot',
                    isFeatured: false,
                    order: 1
                }
            ]
        });

        assert.equal(doc.images.length, 2);
        assert.equal(doc.images[0].caption, 'System block diagram and message broker');
        assert.equal(doc.images[0].imageType, 'infrastructure');
        assert.equal(doc.images[0].isFeatured, true);
        assert.equal(doc.images[1].imageType, 'screenshot');
    });

    await t.test('should support structured contentSections', () => {
        const doc = new Project({
            title: 'Deep-Dive Project',
            description: 'Comprehensive documentation',
            technologies: ['Go', 'Docker'],
            contentSections: [
                {
                    title: 'System Architecture',
                    content: 'Detailed explanation of the distributed consensus algorithm.',
                    order: 0
                },
                {
                    title: 'Deployment & Scaling',
                    content: 'Container orchestration across hybrid cloud nodes.',
                    order: 1
                }
            ]
        });

        assert.equal(doc.contentSections.length, 2);
        assert.equal(doc.contentSections[0].title, 'System Architecture');
        assert.equal(doc.contentSections[1].order, 1);
    });
});
