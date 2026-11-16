const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, default: 'Yihune Belay' },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
