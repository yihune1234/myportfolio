const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://myportfolio-1-01m7.onrender.com',
    'https://portfoliobackend-a6ah.onrender.com',
    'https://yihune-software.vercel.app',
    process.env.FRONTEND_URL?.replace(/\/$/, '')
].filter(Boolean);

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/theme', require('./routes/themeRoutes'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/project-sections', require('./routes/projectSections'));
app.use('/api/section-media', require('./routes/sectionMedia'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/github', require('./routes/githubRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB connected successfully');
        try {
            const SiteSettings = require('./models/SiteSettings');
            const { githubService } = require('./services/github/githubService');
            const settings = await SiteSettings.findOne({ key: 'site_settings' });
            if (settings) {
                githubService.updateConfig({
                    username: settings.githubUsername,
                    org: settings.githubOrg
                });
                console.log(`📡 GitHub accounts initialized: User=${settings.githubUsername}, Org=${settings.githubOrg}`);
            }
        } catch (initErr) {
            console.error('Warning initializing GitHub config from SiteSettings:', initErr.message);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('❌ MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

const { githubScheduler } = require('./services/github/githubScheduler');

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
    githubScheduler.start();
});


process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    githubScheduler.stop();
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;
