const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications
router.get('/', protect, notificationController.getNotifications);

// Create a new notification
router.post('/', protect, notificationController.createNotification);

// Mark all notifications as read
router.put('/mark-all-read', protect, notificationController.markAllRead);

// Mark a specific notification as read
router.put('/:id/read', protect, notificationController.markRead);

// Delete a notification
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;
