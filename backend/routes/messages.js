const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
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

// Reply to message (admin only) — sends email via SMTP
router.post('/:id/reply', auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const { replyBody } = req.body;
    if (!replyBody || !replyBody.trim()) {
      return res.status(400).json({ message: 'Reply body is required' });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'yihunebelay@gmail.com';
    const adminName = process.env.ADMIN_NAME || 'Yihune Belay';

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || adminEmail,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${adminName}" <${adminEmail}>`,
      to: message.email,
      replyTo: adminEmail,
      subject: `Re: ${message.subject}`,
      text: replyBody,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF8A00, #FF6B00); padding: 3px; border-radius: 12px;">
            <div style="background: #0B1637; border-radius: 10px; padding: 24px;">
              <h2 style="color: #F5F7FA; margin: 0 0 16px;">${adminName}</h2>
              <div style="color: #B7C0D1; line-height: 1.6; white-space: pre-wrap;">${replyBody}</div>
              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;" />
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                --- Original message ---<br/>
                From: ${message.name} &lt;${message.email}&gt;<br/>
                Subject: ${message.subject}<br/>
                Date: ${message.createdAt.toLocaleString()}<br/><br/>
                ${message.message}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Reply sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ success: false, message: 'Failed to send reply', error: error.message });
  }
});

module.exports = router;
