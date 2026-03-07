const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');

// Get all audit logs
router.get('/', auditLogController.getLogs);

// Create an audit log entry
router.post('/', auditLogController.createLog);

// Clear all audit logs
router.delete('/clear', auditLogController.clearLogs);

module.exports = router;
