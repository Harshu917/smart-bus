import { io } from 'socket.io-client';

// Determine Socket server URL:
// 1. Explicit VITE_SOCKET_URL if defined (e.g. deployed persistent backend on Railway/Render)
// 2. Localhost fallback if running locally
// 3. Current host origin for unified fullstack hosting
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return typeof window !== 'undefined' ? window.location.origin : '/';
};

export const socket = io(getSocketUrl(), {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 5000,
  autoConnect: true
});
