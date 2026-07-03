import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB Atlas connection...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Atlas Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    await mongoose.disconnect();
    console.log('✓ Disconnected gracefully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection Failed:', error.message);
    process.exit(1);
  }
};

testConnection();
