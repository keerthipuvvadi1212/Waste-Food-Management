import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize server after attempting DB connection
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(` Port: http://localhost:${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();