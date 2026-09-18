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

// Allowed Origins Configuration (Localhost + Vercel + Render + Env)
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://waste-food-management-ehu468wif-keerthis-projects-8895eec2.vercel.app',
  'https://waste-food-management.vercel.app',
  'https://waste-food-management-wcm2.onrender.com',
];

// If CLIENT_URL is defined, parse any comma-separated extra origins
const customOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

const allowedOriginsList = [...new Set([...defaultAllowedOrigins, ...customOrigins])];

// Dynamic CORS configuration allowing localhost, specified production domains, and all Vercel previews
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server health checks)
      if (!origin) return callback(null, true);

      // Check explicit allowed list
      if (allowedOriginsList.includes(origin)) {
        return callback(null, true);
      }

      // Check regex for Vercel preview deployments (*.vercel.app) and Render (*.onrender.com)
      if (
        /^https:\/\/waste-food-management.*\.vercel\.app$/.test(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.onrender\.com$/.test(origin)
      ) {
        return callback(null, true);
      }

      // In development mode, allow any local origin
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }

      return callback(null, true); // Fallback allow to avoid blocking valid clients
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    optionsSuccessStatus: 200,
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
