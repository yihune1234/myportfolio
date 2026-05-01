const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate ObjectId
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// Create message (public - from contact form)
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!subject || !subject.trim()) {
            return res.status(400).json({ message: 'Subject is required' });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Validate email format
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate field lengths
        if (name.trim().length > 100) {
            return res.status(400).json({ message: 'Name must be less than 100 characters' });
        }
        if (subject.trim().length > 200) {
            return res.status(400).json({ message: 'Subject must be less than 200 characters' });
        }
        if (message.trim().length > 5000) {
            return res.status(400).json({ message: 'Message must be less than 5000 characters' });
        }

        const newMessage = new Message({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all messages (admin only)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single message (admin only)
router.get('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }

        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark message as read (admin only)
router.put('/:id/read', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }

        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message marked as read', data: message });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete message (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid message ID' });
        }

        const message = await Message.findByIdAndDelete(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
