const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    assignDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
