const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    relatedEntity: { type: String },
    relatedId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
