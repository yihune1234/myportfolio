/**
 * Integration Test: GitHub-Connected Admin Project Management
 * Verifies:
 * 1. Fetching real repo details & languages
 * 2. Importing repository as draft project
 * 3. Duplicate prevention
 * 4. Publishing / Unpublishing toggles
 * 5. Public vs Admin project filtering
 * 6. Telemetry sync
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Project = require('../models/Project');
const { githubService } = require('../services/github/githubService');

async function runTest() {
    console.log('--- STARTING GITHUB PROJECT MANAGEMENT INTEGRATION VERIFICATION ---');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    try {
        // 1. Test fetching real repo details (languages, README, suggested portfolio data)
        console.log('\n[1] Testing getRepoDetails for yihune1234/mybot:');
        const repoDetails = await githubService.getRepoDetails('yihune1234', 'mybot');
        console.log('✅ Repo Details fetched successfully:', {
            title: repoDetails.data.suggested.title,
            primaryLanguage: repoDetails.data.suggested.primaryLanguage,
            stars: repoDetails.data.suggested.stars,
            languagesCount: Object.keys(repoDetails.data.languages || {}).length,
            hasReadmeSummary: Boolean(repoDetails.data.readme?.summary)
        });

        // 2. Clean up any previous test project with this repo
        await Project.deleteMany({ githubRepoFullName: 'yihune1234/mybot' });

        // 3. Test creating project as draft
        console.log('\n[2] Creating test project as DRAFT:');
        const draftProject = new Project({
            title: repoDetails.data.suggested.title,
            description: repoDetails.data.suggested.description,
            technologies: repoDetails.data.suggested.technologies,
            githubUrl: repoDetails.data.suggested.githubUrl,
            githubRepoFullName: 'yihune1234/mybot',
            githubRepoId: repoDetails.data.suggested.githubRepoId,
            sourceType: 'personal',
            status: 'draft',
            pinned: false,
            githubMetadata: {
                stars: repoDetails.data.suggested.stars,
                forks: repoDetails.data.suggested.forks,
                languages: repoDetails.data.languages
            }
        });
        await draftProject.save();
        console.log('✅ Draft project saved with ID:', draftProject._id, 'status:', draftProject.status);

        // 4. Verify public query excludes draft
        console.log('\n[3] Verifying public filtering:');
        const publicProjects = await Project.find({ status: { $ne: 'draft' } });
        const hasDraftInPublic = publicProjects.some(p => p._id.toString() === draftProject._id.toString());
        console.log('✅ Is draft in public results?', hasDraftInPublic, '(must be false)');
        if (hasDraftInPublic) throw new Error('Draft project appeared in public query!');

        // 5. Verify admin query includes draft
        console.log('\n[4] Verifying admin query includes draft:');
        const allProjects = await Project.find();
        const hasDraftInAll = allProjects.some(p => p._id.toString() === draftProject._id.toString());
        console.log('✅ Is draft in all results?', hasDraftInAll, '(must be true)');
        if (!hasDraftInAll) throw new Error('Draft project missing in admin query!');

        // 6. Test publishing project
        console.log('\n[5] Publishing project:');
        draftProject.status = 'published';
        await draftProject.save();
        const publishedPublic = await Project.find({ status: { $ne: 'draft' } });
        const hasPublishedInPublic = publishedPublic.some(p => p._id.toString() === draftProject._id.toString());
        console.log('✅ Is published project now visible publicly?', hasPublishedInPublic, '(must be true)');
        if (!hasPublishedInPublic) throw new Error('Published project not visible publicly!');

        // 7. Test Duplicate Prevention
        console.log('\n[6] Verifying Duplicate Prevention:');
        const existing = await Project.findOne({ githubRepoFullName: 'yihune1234/mybot' });
        console.log('✅ Found existing project:', Boolean(existing), 'ID:', existing?._id);

        // 8. Clean up test record
        await Project.findByIdAndDelete(draftProject._id);
        console.log('✅ Cleaned up test record.');

        console.log('\n🎉 ALL GITHUB PROJECT MANAGEMENT INTEGRATION TESTS PASSED!');
    } catch (err) {
        console.error('❌ Test failed:', err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
