const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Temporary storage for multer before uploading to Cloudinary
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// Middleware to handle the Cloudinary upload after multer saves the file
const cloudinaryUpload = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const localFilename = path.basename(req.file.path);
    const localFallbackUrl = `/uploads/${localFilename}`;

    // If Cloudinary is not configured, keep the local upload and continue
    if (!process.env.CLOUDINARY_CLOUD_NAME || (!process.env.CLOUDINARY_API_KEY && !process.env.CLOUDINARY_UPLOAD_PRESET)) {
        req.file.cloudinaryUrl = localFallbackUrl;
        return next();
    }

    try {
        const preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'portfolio';

        const uploadOptions = {
            folder: 'portfolio',
            use_filename: true,
            unique_filename: true,
            timeout: 60000
        };

        let result;
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
        } else {
            // Unsigned upload using the preset
            result = await cloudinary.uploader.unsigned_upload(req.file.path, preset, uploadOptions);
        }

        // Delete the local temp file after uploading to Cloudinary
        if (fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkErr) {
                console.warn('Could not remove local temp upload:', unlinkErr.message);
            }
        }

        // Add the cloudinary URL
        req.file.cloudinaryUrl = result.secure_url;
        req.file.public_id = result.public_id;

        next();
    } catch (error) {
        console.warn('⚠️ Cloudinary Upload Warning (falling back to local file storage):', error.message || error);
        // Fall back gracefully to local file so project creation or image upload never fails with 500
        req.file.cloudinaryUrl = localFallbackUrl;
        next();
    }
};

module.exports = {
    upload,
    cloudinaryUpload
};
