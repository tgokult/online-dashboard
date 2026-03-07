const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },  // e.g. 'ASSET_CREATED', 'ASSET_ASSIGNED'
    entity: { type: String, required: true },   // e.g. 'Asset', 'Employee', 'Assignment'
    entityId: { type: String },
    entityName: { type: String },               // human readable name for display
    details: { type: String },                  // extra detail message
    performedBy: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
