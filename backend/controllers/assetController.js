const Asset = require('../models/Asset');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

const getAssets = async (req, res) => {
    try {
        const assets = await Asset.find({}).populate('assignedTo', 'name email');
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id).populate('assignedTo', 'name email');
        if (asset) {
            res.json(asset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAsset = async (req, res) => {
    const { assetId, assetName, category, purchaseDate, status, location, warrantyExpiry, maintenanceDue, notes, vendor, purchasePrice } = req.body;
    try {
        const existing = await Asset.findOne({ assetId });
        if (existing) return res.status(400).json({ message: 'Asset ID already exists' });

        const asset = new Asset({
            assetId, assetName, category, purchaseDate, status,
            location, warrantyExpiry, maintenanceDue, notes, vendor, purchasePrice
        });
        const createdAsset = await asset.save();

        // Audit Log
        await AuditLog.create({
            action: 'ASSET_CREATED', entity: 'Asset', entityId: createdAsset._id,
            entityName: assetName, details: `Asset ${assetId} registered.`
        });

        // Notification
        await Notification.create({
            title: 'New Asset Added',
            message: `${assetName} (${assetId}) was added to inventory.`,
            type: 'success', relatedEntity: 'Asset', relatedId: createdAsset._id
        });

        res.status(201).json(createdAsset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (asset) {
            const fields = ['assetId', 'assetName', 'category', 'purchaseDate', 'status', 'assignedTo',
                'location', 'warrantyExpiry', 'maintenanceDue', 'notes', 'vendor', 'purchasePrice'];
            fields.forEach(f => { if (req.body[f] !== undefined) asset[f] = req.body[f]; });

            const updatedAsset = await asset.save();

            await AuditLog.create({
                action: 'ASSET_UPDATED', entity: 'Asset', entityId: updatedAsset._id,
                entityName: updatedAsset.assetName, details: `Asset ${updatedAsset.assetId} was updated.`
            });

            res.json(updatedAsset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (asset) {
            if (asset.status === 'Assigned') {
                return res.status(400).json({ message: 'Assigned assets must be returned before deletion' });
            }

            await AuditLog.create({
                action: 'ASSET_DELETED', entity: 'Asset', entityId: asset._id,
                entityName: asset.assetName, details: `Asset ${asset.assetId} was removed from inventory.`
            });
            await Asset.findByIdAndDelete(req.params.id);
            res.json({ message: 'Asset removed' });
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    try {
        const total = await Asset.countDocuments({});
        const assigned = await Asset.countDocuments({ status: 'Assigned' });
        const available = await Asset.countDocuments({ status: 'Available' });
        const maintenance = await Asset.countDocuments({ status: 'Maintenance' });

        // Assets with warranty expiring in next 30 days
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const warrantyExpiringSoon = await Asset.countDocuments({
            warrantyExpiry: { $gte: new Date(), $lte: thirtyDaysFromNow }
        });

        // Assets with maintenance due in next 7 days
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const maintenanceDueSoon = await Asset.countDocuments({
            maintenanceDue: { $gte: new Date(), $lte: sevenDaysFromNow }
        });

        res.json({ total, assigned, available, maintenance, warrantyExpiringSoon, maintenanceDueSoon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assets with warranty expiring soon
const getWarrantyAlerts = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const assets = await Asset.find({
            warrantyExpiry: { $gte: new Date(), $lte: futureDate }
        }).populate('assignedTo', 'name email').sort({ warrantyExpiry: 1 });

        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get maintenance schedule
const getMaintenanceSchedule = async (req, res) => {
    try {
        const assets = await Asset.find({
            $or: [
                { maintenanceDue: { $exists: true, $ne: null } },
                { status: 'Maintenance' }
            ]
        }).populate('assignedTo', 'name email').sort({ maintenanceDue: 1 });

        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk import assets from CSV
const bulkImportAssets = async (req, res) => {
    try {
        const { assets } = req.body;
        if (!assets || !Array.isArray(assets)) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array of assets.' });
        }

        const results = { success: 0, failed: 0, errors: [] };

        for (const assetData of assets) {
            try {
                const existing = await Asset.findOne({ assetId: assetData.assetId });
                if (!existing) {
                    await Asset.create(assetData);
                    results.success++;
                } else {
                    results.failed++;
                    results.errors.push(`Asset ID ${assetData.assetId} already exists`);
                }
            } catch (err) {
                results.failed++;
                results.errors.push(`Error importing ${assetData.assetId}: ${err.message}`);
            }
        }

        if (results.success > 0) {
            await AuditLog.create({
                action: 'BULK_IMPORT', entity: 'Asset', entityName: 'Bulk Import',
                details: `${results.success} assets imported via CSV.`
            });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssets, getAssetById, createAsset, updateAsset, deleteAsset, getStats,
    getWarrantyAlerts, getMaintenanceSchedule, bulkImportAssets
};
