import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gearguard.local' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@gearguard.local',
      role: 'ADMIN',
      isApproved: true,
      active: true,
      passwordHash: '', // Not needed for Firebase auth
      department: 'IT',
      jobTitle: 'System Administrator',
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password: (Use Firebase authentication - no password needed)');
    console.log('');
    console.log('IMPORTANT: This user can only log in via Firebase authentication.');
    console.log('Make sure to set up Firebase and enable the authentication providers.');
    console.log('After Firebase setup, sign in with the email: admin@gearguard.local');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
