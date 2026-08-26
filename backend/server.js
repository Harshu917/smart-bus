import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './src/config/env.js';
import { setupSocketHandlers } from './src/services/socketService.js';
import { GPSSimulator } from './src/services/gpsSimulator.js';

// Route imports
import busRoutes from './src/routes/busRoutes.js';
import routeRoutes from './src/routes/routeRoutes.js';
import stopRoutes from './src/routes/stopRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import driverRoutes from './src/routes/driverRoutes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

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

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Setup WebSocket event handlers
setupSocketHandlers(io);

// Start GPS Tracker Simulation Engine
const simulator = new GPSSimulator(io, config.simulationIntervalMs);
simulator.start();

// Start HTTP Server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🚍 SMART BUS TRANSIT BACKEND SERVER STARTED`);
  console.log(` 🌐 Server URL: http://localhost:${PORT}`);
  console.log(` ⚡ WebSocket (Socket.io) initialized`);
  console.log(` 📡 GPS Real-time Simulation Engine Active`);
  console.log(` 🔧 Environment: ${config.nodeEnv}`);
  console.log(`====================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  simulator.stop();
  server.close(() => {
    console.log('HTTP server closed');
  });
});
