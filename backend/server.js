import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './services/socketService.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Setup socket events & rooms
initSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
=====================================================
🚀 FixNear API Server running in [${process.env.NODE_ENV || 'development'}] mode
🌐 HTTP Server: http://localhost:${PORT}
⚡ Socket.IO Ready on port ${PORT}
=====================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // Keep server running in development
});
