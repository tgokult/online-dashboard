const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');

const getDashboardAnalytics = async (req, res) => {
    try {
        const [assets, totalEmployees, totalAssignments, activeAssignments] = await Promise.all([
            Asset.find({}).lean(),
            Employee.countDocuments(),
            Assignment.countDocuments(),
            Assignment.countDocuments({ returnDate: null }),
        ]);

        const summary = {
            totalAssets: assets.length,
            totalEmployees,
            activeAssignments,
            totalAssignments,
        };

        const statusMap = assets.reduce((acc, asset) => {
            acc[asset.status] = (acc[asset.status] || 0) + 1;
            return acc;
        }, {});

        const categoryMap = assets.reduce((acc, asset) => {
            acc[asset.category] = (acc[asset.category] || 0) + 1;
            return acc;
        }, {});

        const today = new Date();
        const warrantyThreshold = new Date(today);
        warrantyThreshold.setDate(warrantyThreshold.getDate() + 30);

        const maintenanceThreshold = new Date(today);
        maintenanceThreshold.setDate(maintenanceThreshold.getDate() + 14);

        const alerts = {
            warrantyExpiringSoon: assets.filter(
                (asset) => asset.warrantyExpiry && new Date(asset.warrantyExpiry) >= today && new Date(asset.warrantyExpiry) <= warrantyThreshold
            ).length,
            maintenanceDueSoon: assets.filter(
                (asset) => asset.maintenanceDue && new Date(asset.maintenanceDue) >= today && new Date(asset.maintenanceDue) <= maintenanceThreshold
            ).length,
        };

        const statusData = ['Available', 'Assigned', 'Maintenance'].map((name) => ({
            name,
            value: statusMap[name] || 0,
        }));

        const categories = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const recentAssignments = await Assignment.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('assetId', 'assetId assetName')
            .populate('employeeId', 'name department')
            .lean();

        res.json({
            success: true,
            data: {
                summary,
                statusData,
                categories,
                alerts,
                recentAssignments: recentAssignments.map((assignment) => ({
                    _id: assignment._id,
                    assetName: assignment.assetId?.assetName || 'Unknown asset',
                    assetTag: assignment.assetId?.assetId || 'N/A',
                    employeeName: assignment.employeeId?.name || 'Unknown employee',
                    department: assignment.employeeId?.department || 'N/A',
                    assignDate: assignment.assignDate,
                    returnDate: assignment.returnDate,
                })),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardAnalytics };
