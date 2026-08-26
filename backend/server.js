import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './src/app.js';
import { config } from './src/config/env.js';
import { setupSocketHandlers } from './src/services/socketService.js';
import { GPSSimulator } from './src/services/gpsSimulator.js';

const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
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
