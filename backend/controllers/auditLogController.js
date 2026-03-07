const AuditLog = require('../models/AuditLog');

// Get all audit logs (newest first)
exports.getLogs = async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;
        const skip = (page - 1) * limit;
        const logs = await AuditLog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await AuditLog.countDocuments();
        res.json({ logs, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a log entry
exports.createLog = async (req, res) => {
    try {
        const log = new AuditLog(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Clear all logs
exports.clearLogs = async (req, res) => {
    try {
        await AuditLog.deleteMany({});
        res.json({ message: 'All logs cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
