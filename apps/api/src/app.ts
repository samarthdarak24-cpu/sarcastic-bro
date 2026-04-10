import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error.middleware';
import marketIntelligenceRoutes from './modules/market-intelligence/market-intelligence.routes';
import authRoutes from './modules/auth/auth.routes';
import mandiIntelligenceRoutes from './routes/mandi-intelligence.routes';
import fpoRoutes from './modules/fpo/fpo.routes';
import farmerRoutes from './modules/farmer/farmer.routes';
import farmerNewRoutes from './modules/farmer/farmer-new.routes';
import buyerRoutes from './modules/buyer/buyer.routes';
import logisticsRoutes from './modules/logistics/logistics.routes';
import complianceRoutes from './modules/compliance/compliance.routes';
import n8nChatRoutes from './modules/n8n-chat/n8n-chat.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market-intelligence', marketIntelligenceRoutes);
app.use('/api/mandi-intelligence', mandiIntelligenceRoutes);
app.use('/api/fpo', fpoRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/farmers', farmerNewRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/n8n', n8nChatRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
