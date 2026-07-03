import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/gearguard';

    if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
      console.warn('Warning: No `MONGODB_URI` or `MONGO_URI` found in environment — using local fallback:', mongoURI);
      console.warn('For production, create a `backend/.env` file with `MONGODB_URI=` set to your MongoDB connection string.');
    }

    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Retrying connection in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

export default connectDB;
