/* ========================================================================
   Express App Configuration — ODOP Connect API
   Sets up middleware stack, routes, and error handling.
   ======================================================================== */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";

// Module routes
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import productHubRoutes from "./modules/product/product-hub.routes";
import orderRoutes from "./modules/order/order.routes";
import messageRoutes from "./modules/message/message.routes";
import proposalRoutes from "./modules/proposal/proposal.routes";
import reviewRoutes from "./modules/review/review.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import tenderRoutes from "./modules/tender/tender.routes";
import sampleRequestRoutes from "./modules/sampleRequest/sampleRequest.routes";
import logisticsRoutes from "./modules/logistics/logistics.routes";
import exportRoutes from "./modules/export/export.routes";
import contractRoutes from "./modules/contract/contract.routes";
import searchRoutes from "./modules/search/search.routes";
// import aiRoutes from "./modules/ai/ai.routes";  // DISABLED - missing file
// import aiChatRoutes from "./modules/ai/ai-chat.routes";  // DISABLED - missing file
// import langchainChatRoutes from "./modules/ai/langchain-chat.routes";  // DISABLED - missing file
// import simpleLangchainChatRoutes from "./modules/ai/simple-langchain-chat.routes";  // DISABLED - missing file
// import streamChatRoutes from "./modules/ai/stream-chat.routes";  // DISABLED - missing file
// import financeRoutes from "./modules/finance/finance.routes";  // DISABLED - missing file
import sustainabilityRoutes from "./modules/sustainability/sustainability.routes";
import blockchainRoutes from "./modules/blockchain/blockchain.routes";
import agricultureRoutes from "./modules/agriculture/agriculture.routes";
import buyerRoutes from "./modules/buyer/buyer.routes";
import paymentRoutes from "./routes/paymentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import insightsRoutes from "./modules/insights/insights.routes";
import aggregationRoutes from "./modules/aggregation/aggregation.routes";
import reputationRoutes from "./modules/reputation/reputation.routes";
import supplierInsightsRoutes from "./modules/supplier-insights/supplier-insights.routes";
// import whisperRoutes from "./modules/whisper/whisper.routes";  // DISABLED - missing file
import paymentModuleRoutes from "./modules/payment/payment.routes";
import escrowRoutes from "./modules/escrow/escrow.routes";
import blockchainTraceRoutes from "./modules/blockchain-trace/blockchain-trace.routes";
import farmerOverviewRoutes from "./modules/farmer/farmer.routes";
// import { ollamaChatRoutes } from "./modules/ollama-chat/ollama-chat.routes";  // DISABLED - missing file
import n8nChatRoutes from "./modules/n8n-chat/n8n-chat.routes";
import chatRoutes from "./modules/chat/chat.routes";
import chatRoomRoutes from "./modules/chat-room/chat-room.routes";
import agriChatRoutes from "./modules/agri-chat/agri-chat.routes";
import uploadsRoutes from "./modules/uploads/uploads.routes";
import realtimeScanRoutes from "./modules/realtime-scan/realtime-scan.routes";
// import communicationsRoutes from "./modules/communications/communications.routes";  // DISABLED - missing file
import favoritesRoutes from "./modules/favorites/favorites.routes";
import trustRatingRoutes from "./modules/trust-rating/trust-rating.routes";

const app = express();

/* ─── Global Middleware ─────────────────────────────────────────────── */

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connect-src": ["'self'", "http:", "https:", "ws:", "wss:"],
      "img-src": ["'self'", "data:", "https:"],
    },
  },
}));

// Response compression
app.use(compression({
  threshold: 1024, // Only compress responses > 1KB
  level: 6, // Compression level (0-9)
}));

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(morgan(env.IS_DEV ? "dev" : "combined"));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per window
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many authentication attempts, please try again later",
    },
  },
});

// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);

/* ─── Health Check ──────────────────────────────────────────────────── */

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      service: "ODOP Connect API",
      version: "2.0.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

/* ─── API Routes ────────────────────────────────────────────────────── */

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/product-hub", productHubRoutes);
app.use("/orders", orderRoutes);
app.use("/messages", messageRoutes);
app.use("/chat-rooms", chatRoomRoutes);  // WhatsApp-like chat system
app.use("/api/agri-chat", agriChatRoutes);  // AgriChat - User-to-user messaging
app.use("/uploads", uploadsRoutes);  // File uploads for chat
app.use("/api/realtime-scan", realtimeScanRoutes); // AI Quality Shield & Real-time scan logic
app.use("/proposals", proposalRoutes);
app.use("/reviews", reviewRoutes);
app.use("/notifications", notificationRoutes);
app.use("/tenders", tenderRoutes);
app.use("/samples", sampleRequestRoutes);
app.use("/logistics", logisticsRoutes);
app.use("/export", exportRoutes);
app.use("/contracts", contractRoutes);
app.use("/search", searchRoutes);
// app.use("/ai", aiRoutes);  // DISABLED - missing file
// app.use("/ai-chat", aiChatRoutes);  // DISABLED - missing file
// app.use("/ai/langchain-chat", langchainChatRoutes);  // DISABLED - missing file
// app.use("/ai/simple-langchain-chat", simpleLangchainChatRoutes);  // DISABLED - missing file
// app.use("/stream-chat", streamChatRoutes);  // DISABLED - missing file
// app.use("/finance", financeRoutes);  // DISABLED - missing file
app.use("/sustainability", sustainabilityRoutes);
app.use("/blockchain", blockchainRoutes);
app.use("/agriculture", agricultureRoutes);
app.use("/buyer", buyerRoutes);
app.use("/payments", paymentRoutes);
app.use("/api/payments", paymentModuleRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/insights", insightsRoutes);
app.use("/aggregation", aggregationRoutes);
app.use("/reputation", reputationRoutes);
app.use("/supplier-insights", supplierInsightsRoutes);
// app.use("/whisper", whisperRoutes);  // DISABLED - missing file
app.use("/escrow", escrowRoutes);
app.use("/blockchain-trace", blockchainTraceRoutes);
app.use("/api/farmer", farmerOverviewRoutes);
// app.use("/ollama-chat", ollamaChatRoutes);  // DISABLED - missing file
app.use("/api/n8n", n8nChatRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/trust-rating", trustRatingRoutes);
// app.use("/communications", communicationsRoutes);  // DISABLED - missing file
// app.use("/chat", chatRoutes);  // DISABLED - missing file

/* ─── 404 Handler ───────────────────────────────────────────────────── */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${_req.method} ${_req.originalUrl}`,
  });
});

/* ─── Global Error Handler ──────────────────────────────────────────── */

app.use(errorMiddleware);

export default app;
