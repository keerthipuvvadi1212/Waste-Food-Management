import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Check backend server and MongoDB Atlas connection status
 * @access  Public
 */
router.get('/', (req, res) => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    status: 'ok',
    db: isDbConnected ? 'connected' : 'disconnected',
    message: 'Zero Waste Platform API is operational',
    timestamp: new Date().toISOString(),
  });
});

export default router;
