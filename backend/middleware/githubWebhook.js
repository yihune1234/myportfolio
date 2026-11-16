/**
 * GitHub Webhook Verification Middleware
 * Secure HMAC SHA-256 signature verification and delivery deduplication.
 */

const crypto = require('crypto');
const githubConfig = require('../config/githubConfig');
const { githubCache } = require('../services/github/githubCache');

/**
 * Verifies GitHub webhook signature using HMAC SHA-256 and constant-time comparison
 */
function verifyWebhookSignature(req, res, next) {
    // 1. Check if webhooks are configured
    const secret = githubConfig.webhookSecret;
    if (!secret) {
        return res.status(503).json({
            message: 'GitHub webhook integration is not configured (missing GITHUB_WEBHOOK_SECRET)',
            code: 'WEBHOOK_NOT_CONFIGURED'
        });
    }

    // 2. Validate signature header
    const signatureHeader = req.headers['x-hub-signature-256'];
    if (!signatureHeader) {
        return res.status(401).json({
            message: 'Missing X-Hub-Signature-256 header',
            code: 'MISSING_SIGNATURE'
        });
    }

    if (!signatureHeader.startsWith('sha256=')) {
        return res.status(401).json({
            message: 'Invalid signature algorithm. Expected sha256',
            code: 'INVALID_SIGNATURE_ALGORITHM'
        });
    }

    const providedSignature = signatureHeader.slice('sha256='.length);

    // 3. Extract raw payload buffer
    const payload = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

    // 4. Compute expected HMAC SHA-256 signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    // 5. Compare signatures using constant-time comparison
    const providedBuffer = Buffer.from(providedSignature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
        return res.status(401).json({
            message: 'Invalid webhook signature',
            code: 'INVALID_SIGNATURE'
        });
    }

    // 6. Delivery Deduplication
    const deliveryId = req.headers['x-github-delivery'];
    if (deliveryId) {
        if (githubCache.hasDelivery(deliveryId)) {
            console.log(`ℹ️  [GitHubWebhook] Duplicate delivery ${deliveryId} ignored`);
            return res.status(200).json({
                message: 'Duplicate webhook delivery ignored',
                delivery_id: deliveryId,
                duplicate: true
            });
        }
        githubCache.recordDelivery(deliveryId);
    }

    req.webhookMeta = {
        deliveryId,
        event: req.headers['x-github-event'] || 'unknown',
        verified: true
    };

    next();
}

module.exports = {
    verifyWebhookSignature
};
