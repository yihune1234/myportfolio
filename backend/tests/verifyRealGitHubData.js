/**
 * Live API Verification Script
 * Tests all GitHub endpoints with ACTUAL public GitHub data from personal & org accounts.
 */

require('dotenv').config();
const express = require('express');
const githubRoutes = require('../routes/githubRoutes');

async function runLiveVerification() {
    console.log('🚀 Starting Real GitHub Data Verification...');
    console.log(`Config: GITHUB_USERNAME=${process.env.GITHUB_USERNAME || 'yihune1234'}, GITHUB_ORG=${process.env.GITHUB_ORG || 'AriitiMarket'}`);

    const app = express();
    app.use(express.json());
    app.use('/api/github', githubRoutes);

    // Global error handler
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ error: err.message });
    });

    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}/api/github`;

    const results = [];

    async function check(name, url, validator) {
        process.stdout.write(`Testing ${name}... `);
        try {
            const start = Date.now();
            const res = await fetch(url);
            const duration = Date.now() - start;
            const data = await res.json();

            if (!res.ok) {
                console.log(`❌ Failed (${res.status}): ${JSON.stringify(data)}`);
                results.push({ name, passed: false, status: res.status, error: data.message });
                return;
            }

            const error = validator(data);
            if (error) {
                console.log(`❌ Failed validation: ${error}`);
                results.push({ name, passed: false, status: res.status, error });
            } else {
                console.log(`✅ Passed (${res.status}, ${duration}ms)`);
                results.push({ name, passed: true, status: res.status, dataSample: data });
            }
        } catch (err) {
            console.log(`❌ Exception: ${err.message}`);
            results.push({ name, passed: false, error: err.message });
        }
    }

    try {
        // 1. GET /api/github/personal
        await check('GET /api/github/personal', `${baseUrl}/personal`, (data) => {
            if (!data.data) return 'Missing data property';
            if (data.data.login !== 'yihune1234') return `Expected login yihune1234, got ${data.data.login}`;
            if (data.data.source_scope !== 'PERSONAL') return `Expected PERSONAL source_scope, got ${data.data.source_scope}`;
            return null;
        });

        // 2. GET /api/github/personal/repos (with pagination)
        await check('GET /api/github/personal/repos?page=1&per_page=5', `${baseUrl}/personal/repos?page=1&per_page=5`, (data) => {
            if (!Array.isArray(data.repos)) return 'Expected repos array';
            if (data.repos.length > 5) return 'Pagination exceeded limit of 5';
            if (data.pagination?.page !== 1) return 'Pagination page mismatch';
            if (data.pagination?.per_page !== 5) return 'Pagination per_page mismatch';
            for (const repo of data.repos) {
                if (repo.source_scope !== 'PERSONAL') return `Repo ${repo.name} has incorrect source_scope`;
                if (repo.visibility !== 'public') return `Repo ${repo.name} is not public`;
                if (!repo.html_url) return `Repo ${repo.name} missing html_url`;
                if (typeof repo.stars !== 'number') return `Repo ${repo.name} missing stars number`;
                if (typeof repo.forks !== 'number') return `Repo ${repo.name} missing forks number`;
                if (!Array.isArray(repo.topics)) return `Repo ${repo.name} missing topics array`;
            }
            return null;
        });

        // 3. GET /api/github/personal/activity
        await check('GET /api/github/personal/activity?per_page=5', `${baseUrl}/personal/activity?per_page=5`, (data) => {
            if (!Array.isArray(data.activity)) return 'Expected activity array';
            for (const act of data.activity) {
                if (act.source_scope !== 'PERSONAL') return 'Activity source_scope mismatch';
                if (!act.summary) return 'Activity missing summary';
                if (!act.actor || !act.repo) return 'Activity missing actor/repo';
            }
            return null;
        });

        // 4. GET /api/github/organization
        await check('GET /api/github/organization', `${baseUrl}/organization`, (data) => {
            if (!data.data) return 'Missing data property';
            if (data.data.login !== 'AriitiMarket') return `Expected login AriitiMarket, got ${data.data.login}`;
            if (data.data.source_scope !== 'ORGANIZATION') return `Expected ORGANIZATION source_scope, got ${data.data.source_scope}`;
            if (data.data.type !== 'Organization') return `Expected type Organization, got ${data.data.type}`;
            return null;
        });

        // 5. GET /api/github/organization/repos
        await check('GET /api/github/organization/repos?page=1&per_page=5', `${baseUrl}/organization/repos?page=1&per_page=5`, (data) => {
            if (!Array.isArray(data.repos)) return 'Expected repos array';
            if (data.pagination?.page !== 1) return 'Pagination page mismatch';
            for (const repo of data.repos) {
                if (repo.source_scope !== 'ORGANIZATION') return `Repo ${repo.name} has incorrect source_scope`;
                if (repo.visibility !== 'public') return `Repo ${repo.name} is not public`;
                if (!repo.html_url) return `Repo ${repo.name} missing html_url`;
            }
            return null;
        });

        // 6. GET /api/github/organization/activity
        await check('GET /api/github/organization/activity?per_page=5', `${baseUrl}/organization/activity?per_page=5`, (data) => {
            if (!Array.isArray(data.activity)) return 'Expected activity array';
            for (const act of data.activity) {
                if (act.source_scope !== 'ORGANIZATION') return 'Activity source_scope mismatch';
            }
            return null;
        });

        // 7. GET /api/github/overview
        await check('GET /api/github/overview', `${baseUrl}/overview`, (data) => {
            if (!data.status) return 'Missing status object';
            if (data.status.personal !== 'ok') return `Personal status is ${data.status.personal}`;
            if (data.status.organization !== 'ok') return `Organization status is ${data.status.organization}`;
            if (!data.accounts?.personal || !data.accounts?.organization) return 'Missing account profile data';
            if (typeof data.metrics?.total_public_repos !== 'number') return 'Missing total_public_repos';
            if (typeof data.metrics?.total_stars !== 'number') return 'Missing total_stars';
            if (!Array.isArray(data.metrics?.top_languages)) return 'Missing top_languages';
            if (!Array.isArray(data.featured_repos)) return 'Missing featured_repos';
            if (!Array.isArray(data.recent_activity)) return 'Missing recent_activity';
            // Verify source_scope is retained on featured_repos
            for (const repo of data.featured_repos) {
                if (!['PERSONAL', 'ORGANIZATION'].includes(repo.source_scope)) {
                    return `Featured repo ${repo.name} missing valid source_scope`;
                }
            }
            return null;
        });

        // 8. GET /api/github/health (Phase 2 monitoring)
        await check('GET /api/github/health', `${baseUrl}/health`, (data) => {
            if (!data.status) return 'Missing health status';
            if (!data.sources?.personal || !data.sources?.organization) return 'Missing sources status';
            if (!data.cache?.ttls) return 'Missing cache ttls';
            if (!data.scheduler) return 'Missing scheduler status';
            if (data.webhook?.configured === undefined) return 'Missing webhook status';
            return null;
        });

        // 9. POST /api/github/webhook (Phase 2 webhook ping)
        const crypto = require('crypto');
        const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || 'phase2_test_webhook_secret_key';
        const pingPayload = JSON.stringify({ zen: 'Practicality beats purity.', hook_id: 123456 });
        const pingSignature = 'sha256=' + crypto.createHmac('sha256', webhookSecret).update(pingPayload).digest('hex');

        process.stdout.write('Testing POST /api/github/webhook (ping)... ');
        try {
            const res = await fetch(`${baseUrl}/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Hub-Signature-256': pingSignature,
                    'X-GitHub-Event': 'ping',
                    'X-GitHub-Delivery': `deliv-ping-${Date.now()}`
                },
                body: pingPayload
            });
            const data = await res.json();
            if (res.ok && data.message?.includes('ping')) {
                console.log(`✅ Passed (${res.status})`);
                results.push({ name: 'POST /api/github/webhook (ping)', passed: true, status: res.status });
            } else {
                console.log(`❌ Failed: ${JSON.stringify(data)}`);
                results.push({ name: 'POST /api/github/webhook (ping)', passed: false, status: res.status });
            }
        } catch (e) {
            console.log(`❌ Exception: ${e.message}`);
            results.push({ name: 'POST /api/github/webhook (ping)', passed: false, error: e.message });
        }

        console.log('\n--- VERIFICATION SUMMARY ---');
        const passedCount = results.filter(r => r.passed).length;
        console.log(`Total Endpoints Tested: ${results.length}`);
        console.log(`Passed: ${passedCount}/${results.length}`);
        console.log(`All Passed: ${passedCount === results.length ? 'YES' : 'NO'}`);

        return results;
    } finally {
        server.close();
    }
}

if (require.main === module) {
    runLiveVerification()
        .then(results => {
            const allPassed = results.every(r => r.passed);
            process.exit(allPassed ? 0 : 1);
        })
        .catch(err => {
            console.error('Test execution failed:', err);
            process.exit(1);
        });
}

module.exports = runLiveVerification;
