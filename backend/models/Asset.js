const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    assetId: { type: String, required: true, unique: true },
    assetName: { type: String, required: true },
    category: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Maintenance'],
        default: 'Available'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },
    // New Fields
    location: { type: String, default: '' },
    warrantyExpiry: { type: Date, default: null },
    maintenanceDue: { type: Date, default: null },
    notes: { type: String, default: '' },
    vendor: { type: String, default: '' },
    purchasePrice: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
