const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({})
            .populate('assetId', 'assetId assetName status')
            .populate('employeeId', 'name email department')
            .sort({ assignDate: -1 });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
};

const assignAsset = async (req, res) => {
    const { assetId, employeeId } = req.body;
    try {
        const asset = await Asset.findById(assetId);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        if (asset.status !== 'Available') return res.status(400).json({ message: `Asset is currently ${asset.status}` });

        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const assignment = new Assignment({
            assetId,
            employeeId
        });

        const createdAssignment = await assignment.save();

        // Update asset status
        asset.status = 'Assigned';
        asset.assignedTo = employeeId;
        await asset.save();

        await AuditLog.create({
            action: 'ASSET_ASSIGNED',
            entity: 'Assignment',
            entityId: createdAssignment._id,
            entityName: asset.assetName,
            details: `${asset.assetName} (${asset.assetId}) was assigned to ${employee.name}.`,
        });

        await Notification.create({
            title: 'Asset Assigned',
            message: `${asset.assetName} was assigned to ${employee.name}.`,
            type: 'info',
            relatedEntity: 'Assignment',
            relatedId: createdAssignment._id,
        });

        res.status(201).json(createdAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const returnAsset = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        if (assignment.returnDate) return res.status(400).json({ message: 'Asset already returned' });

        assignment.returnDate = new Date();
        await assignment.save();

        // Update asset status
        const asset = await Asset.findById(assignment.assetId);
        if (asset) {
            asset.status = 'Available';
            asset.assignedTo = null;
            await asset.save();

            const employee = await Employee.findById(assignment.employeeId);

            await AuditLog.create({
                action: 'ASSET_RETURNED',
                entity: 'Assignment',
                entityId: assignment._id,
                entityName: asset.assetName,
                details: `${asset.assetName} (${asset.assetId}) was returned${employee ? ` by ${employee.name}` : ''}.`,
            });

            await Notification.create({
                title: 'Asset Returned',
                message: `${asset.assetName} is now back in inventory.`,
                type: 'success',
                relatedEntity: 'Assignment',
                relatedId: assignment._id,
            });
        }

        res.json({ message: 'Asset returned successfully', assignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAssignments, assignAsset, returnAsset };
