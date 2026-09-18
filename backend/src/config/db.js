import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Windows Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not allowed
}

/**
 * Connect to MongoDB Atlas cluster using Mongoose
 * Reads connection string from process.env.MONGODB_URI
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    const options = {
      // Timeout after 5 seconds instead of waiting indefinitely
      serverSelectionTimeoutMS: 5000,
      // Maintain up to 10 socket connections
      maxPoolSize: 10,
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB Atlas connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;