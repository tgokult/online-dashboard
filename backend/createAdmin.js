require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userExists = await User.findOne({ email: 'admin@example.com' });
        if (userExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const user = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'Admin'
        });

        console.log('Admin user created successfully:', user.email);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
