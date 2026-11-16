/**
 * Express Route Integration Tests for GitHub Endpoints
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const githubRoutes = require('../routes/githubRoutes');

// Helper to make mock HTTP requests to an Express app without external network calls
function createTestApp() {
    const app = express();
    app.use(express.json());
    app.use('/api/github', githubRoutes);

    // Error handler
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ message: err.message });
    });

    return app;
}

describe('GitHub Express Routes', () => {
    const app = createTestApp();

    it('should validate invalid pagination params on /api/github/personal/repos', async () => {
        const server = app.listen(0);
        const port = server.address().port;

        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/github/personal/repos?page=-1`);
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.match(data.message, /page/);
        } finally {
            server.close();
        }
    });

    it('should validate invalid sort params on /api/github/personal/repos', async () => {
        const server = app.listen(0);
        const port = server.address().port;

        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/github/personal/repos?sort=invalid_column`);
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.match(data.message, /sort/);
        } finally {
            server.close();
        }
    });

    it('should validate invalid per_page on /api/github/organization/repos', async () => {
        const server = app.listen(0);
        const port = server.address().port;

        try {
            const res = await fetch(`http://127.0.0.1:${port}/api/github/organization/repos?per_page=999`);
            assert.equal(res.status, 400);
            const data = await res.json();
            assert.match(data.message, /per_page/);
        } finally {
            server.close();
        }
    });
});
