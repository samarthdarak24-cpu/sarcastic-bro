import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import prisma from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { setupSocketHandlers } from './socket/socketHandlers';

// Routes
import authRoutes from './routes/auth.routes';
import farmerRoutes from './routes/farmer.routes';
import buyerRoutes from './routes/buyer.routes';
import fpoRoutes from './routes/fpo.routes';
import marketPriceRoutes from './routes/marketPrice.routes';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/fpo', fpoRoutes);
app.use('/api/market-prices', marketPriceRoutes);
app.use('/api/chat', chatRoutes);

// Error handling
app.use(errorHandler);

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log('✓ Database connected');

    server.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║   AgriTrust API Server                   ║
║   Port: ${PORT}                             ║
║   Environment: ${process.env.NODE_ENV || 'development'}        ║
║   Database: Connected ✓                  ║
║   Socket.IO: Ready ✓                     ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

start();

export { io };
