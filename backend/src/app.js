import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';

// Route imports
import busRoutes from './routes/busRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import stopRoutes from './routes/stopRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import driverRoutes from './routes/driverRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/driver', driverRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err?.message || 'Unknown error' });
});

export { app };
export default app;
