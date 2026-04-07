const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { protect } = require('../middleware/authMiddleware');

// Get all audit logs
router.get('/', protect, auditLogController.getLogs);

// Create an audit log entry
router.post('/', protect, auditLogController.createLog);

// Clear all audit logs
router.delete('/clear', protect, auditLogController.clearLogs);

module.exports = router;
