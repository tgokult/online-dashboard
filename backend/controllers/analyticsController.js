const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();
        const totalEmployees = await Employee.countDocuments();
        const activeAssignments = await Assignment.countDocuments({ status: 'Assigned' });

        // Category breakdown
        const categoryData = await Asset.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Status breakdown
        const statusData = await Asset.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalAssets,
                    totalEmployees,
                    activeAssignments
                },
                categories: categoryData.map(c => ({ name: c._id || 'Uncategorized', value: c.count })),
                statusData: statusData.map(s => ({ name: s._id, value: s.count }))
            }
        });
    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving analytics' });
    }
};
