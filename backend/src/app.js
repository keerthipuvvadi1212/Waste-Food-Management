import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import hygieneRoutes from './routes/hygiene.routes.js';
import pickupRoutes from './routes/pickup.routes.js';
import statsRoutes from './routes/stats.routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Enable CORS
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/hygiene', hygieneRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/stats', statsRoutes);

// Fallback route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found.`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
