const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications
router.get('/', notificationController.getNotifications);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark all notifications as read
router.put('/mark-all-read', notificationController.markAllRead);

// Mark a specific notification as read
router.put('/:id/read', notificationController.markRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
