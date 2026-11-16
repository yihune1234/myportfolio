const { aiService } = require('../services/aiService');

/**
 * Handle AI chat interaction
 * POST /api/ai/chat
 */
exports.chat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Messages must be a non-empty array'
            });
        }

        // Limit message history to prevent massive payload abuse
        const trimmedMessages = messages.slice(-10);

        for (const msg of trimmedMessages) {
            if (!msg || typeof msg.content !== 'string' || !msg.content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Each message must have non-empty text content'
                });
            }
        }

        const result = await aiService.chat(trimmedMessages);
        res.json(result);
    } catch (error) {
        console.error('Error in AI Chat controller:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process AI chat request'
        });
    }
};
