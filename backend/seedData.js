require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Employee = require('./models/Employee');
const Asset = require('./models/Asset');
const Assignment = require('./models/Assignment');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');

const users = [
    { name: 'Gokul Admin', email: 'admin1@example.com', password: 'password123', role: 'Admin' },
    { name: 'Rahul Verma', email: 'user1@example.com', password: 'password123', role: 'User' },
    { name: 'Sneha Iyer', email: 'user2@example.com', password: 'password123', role: 'User' },
    { name: 'Arjun Nair', email: 'user3@example.com', password: 'password123', role: 'User' },
];

const employeeSeed = [
    { name: 'Ananya Sharma', email: 'ananya@company.com', department: 'Engineering' },
    { name: 'Rohit Gupta', email: 'rohit@company.com', department: 'Operations' },
    { name: 'Meera Pillai', email: 'meera@company.com', department: 'Finance' },
    { name: 'Vikram Rao', email: 'vikram@company.com', department: 'Design' },
    { name: 'Neha Kapoor', email: 'neha@company.com', department: 'Human Resources' },
];

const buildAssetSeed = (employees) => ([
    {
        assetId: 'LPT-001',
        assetName: 'MacBook Pro 14',
        category: 'Laptop',
        purchaseDate: new Date('2024-02-15'),
        status: 'Assigned',
        assignedTo: employees[0]._id,
        location: 'Chennai HQ',
        warrantyExpiry: new Date('2026-05-12'),
        maintenanceDue: new Date('2026-04-18'),
        notes: 'Primary engineering workstation',
        vendor: 'Apple',
        purchasePrice: 185000,
    },
    {
        assetId: 'MON-204',
        assetName: 'Dell UltraSharp 27',
        category: 'Monitor',
        purchaseDate: new Date('2024-06-20'),
        status: 'Available',
        location: 'Bengaluru Storage',
        warrantyExpiry: new Date('2026-08-01'),
        maintenanceDue: new Date('2026-07-10'),
        notes: 'Reserved for onboarding kits',
        vendor: 'Dell',
        purchasePrice: 32000,
    },
    {
        assetId: 'PHN-032',
        assetName: 'iPhone 15',
        category: 'Mobile',
        purchaseDate: new Date('2024-11-10'),
        status: 'Assigned',
        assignedTo: employees[1]._id,
        location: 'Remote - Mumbai',
        warrantyExpiry: new Date('2026-04-25'),
        maintenanceDue: new Date('2026-05-02'),
        notes: 'Operations escalation device',
        vendor: 'Apple',
        purchasePrice: 79000,
    },
    {
        assetId: 'SRV-010',
        assetName: 'Rack Server X10',
        category: 'Server',
        purchaseDate: new Date('2023-09-05'),
        status: 'Maintenance',
        location: 'Primary Data Room',
        warrantyExpiry: new Date('2026-04-16'),
        maintenanceDue: new Date('2026-04-12'),
        notes: 'Scheduled cooling-system inspection',
        vendor: 'Lenovo',
        purchasePrice: 248000,
    },
    {
        assetId: 'DST-118',
        assetName: 'HP ProDesk 600',
        category: 'Desktop',
        purchaseDate: new Date('2024-01-08'),
        status: 'Available',
        location: 'Hyderabad Office',
        warrantyExpiry: new Date('2026-06-30'),
        maintenanceDue: new Date('2026-05-20'),
        notes: 'Finance backup workstation',
        vendor: 'HP',
        purchasePrice: 54000,
    },
    {
        assetId: 'LPT-014',
        assetName: 'ThinkPad X1 Carbon',
        category: 'Laptop',
        purchaseDate: new Date('2024-03-01'),
        status: 'Assigned',
        assignedTo: employees[3]._id,
        location: 'Design Studio',
        warrantyExpiry: new Date('2026-04-20'),
        maintenanceDue: new Date('2026-04-29'),
        notes: 'Design team travel device',
        vendor: 'Lenovo',
        purchasePrice: 149000,
    },
]);

const buildNotifications = (assets) => ([
    {
        title: 'Warranty Alert',
        message: `${assets[3].assetName} warranty expires soon.`,
        type: 'warning',
        isRead: false,
        relatedEntity: 'Asset',
        relatedId: String(assets[3]._id),
    },
    {
        title: 'Asset Assigned',
        message: `${assets[0].assetName} was assigned to Ananya Sharma.`,
        type: 'info',
        isRead: true,
        relatedEntity: 'Assignment',
        relatedId: String(assets[0]._id),
    },
    {
        title: 'Maintenance Due',
        message: `${assets[3].assetName} is due for scheduled maintenance.`,
        type: 'warning',
        isRead: false,
        relatedEntity: 'Asset',
        relatedId: String(assets[3]._id),
    },
]);

const buildAuditLogs = (assets, employees) => ([
    {
        action: 'SEED_COMPLETED',
        entity: 'System',
        entityName: 'Initial Demo Data',
        details: 'Database seeded with demo users, employees, assets, assignments, notifications, and logs.',
        performedBy: 'Seeder',
    },
    {
        action: 'ASSET_CREATED',
        entity: 'Asset',
        entityId: String(assets[0]._id),
        entityName: assets[0].assetName,
        details: `${assets[0].assetId} was added to inventory.`,
        performedBy: 'Seeder',
    },
    {
        action: 'EMPLOYEE_CREATED',
        entity: 'Employee',
        entityId: String(employees[0]._id),
        entityName: employees[0].name,
        details: `${employees[0].name} was added to Engineering.`,
        performedBy: 'Seeder',
    },
    {
        action: 'ASSET_ASSIGNED',
        entity: 'Assignment',
        entityName: assets[2].assetName,
        details: `${assets[2].assetName} was assigned to Rohit Gupta.`,
        performedBy: 'Seeder',
    },
]);

const importData = async () => {
    try {
        await connectDB();

        await Promise.all([
            Assignment.deleteMany({}),
            Asset.deleteMany({}),
            Employee.deleteMany({}),
            User.deleteMany({}),
            Notification.deleteMany({}),
            AuditLog.deleteMany({}),
        ]);

        const createdUsers = [];
        for (const user of users) {
            const createdUser = await User.create(user);
            createdUsers.push(createdUser);
        }

        const employees = await Employee.insertMany(employeeSeed);
        const assets = await Asset.insertMany(buildAssetSeed(employees));

        const assignments = [
            {
                assetId: assets[0]._id,
                employeeId: employees[0]._id,
                assignDate: new Date('2026-04-01'),
                returnDate: null,
            },
            {
                assetId: assets[2]._id,
                employeeId: employees[1]._id,
                assignDate: new Date('2026-03-26'),
                returnDate: null,
            },
            {
                assetId: assets[5]._id,
                employeeId: employees[3]._id,
                assignDate: new Date('2026-03-18'),
                returnDate: new Date('2026-03-30'),
            },
        ];

        await Assignment.insertMany(assignments);
        await Notification.insertMany(buildNotifications(assets));
        await AuditLog.insertMany(buildAuditLogs(assets, employees));

        console.log('Seed data imported successfully.');
        console.log('Demo login users:');
        createdUsers.forEach((user) => {
            console.log(`- ${user.email} / password123 (${user.role})`);
        });
        process.exit(0);
    } catch (error) {
        console.error(`Seed import failed: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Promise.all([
            Assignment.deleteMany({}),
            Asset.deleteMany({}),
            Employee.deleteMany({}),
            User.deleteMany({}),
            Notification.deleteMany({}),
            AuditLog.deleteMany({}),
        ]);

        console.log('Seed data destroyed successfully.');
        process.exit(0);
    } catch (error) {
        console.error(`Seed destroy failed: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv.includes('--destroy')) {
    destroyData();
} else {
    importData();
}
