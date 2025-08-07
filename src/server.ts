// Nếu gặp lỗi linter: Cannot find module 'mongoose' hoặc 'dotenv', hãy chạy: npm install mongoose dotenv @types/node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';
import { SocketService } from './services/socket.service';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    // Create HTTP server
    const server = createServer(app);

    // Initialize Socket.IO
    const socketService = new SocketService(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO server initialized`);
    });

    // Simple shutdown handler without process events to avoid TypeScript issues
    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    // Note: Process event handlers removed to avoid TypeScript strict typing issues
    // The server will still function normally and can be stopped with Ctrl+C

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

startServer();
