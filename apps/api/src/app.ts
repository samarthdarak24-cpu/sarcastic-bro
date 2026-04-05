/* ========================================================================
   Express App Configuration — ODOP Connect API
   Sets up middleware stack, routes, and error handling.
   ======================================================================== */

import express from "express";
import cors from "cors";
import morgan from "morgan";
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
import aiRoutes from "./modules/ai/ai.routes";
import financeRoutes from "./modules/finance/finance.routes";
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
import voiceRoutes from "./modules/voice/voice.routes";

const app = express();

/* ─── Global Middleware ─────────────────────────────────────────────── */

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
app.use("/proposals", proposalRoutes);
app.use("/reviews", reviewRoutes);
app.use("/notifications", notificationRoutes);
app.use("/tenders", tenderRoutes);
app.use("/samples", sampleRequestRoutes);
app.use("/logistics", logisticsRoutes);
app.use("/export", exportRoutes);
app.use("/contracts", contractRoutes);
app.use("/search", searchRoutes);
app.use("/ai", aiRoutes);
app.use("/finance", financeRoutes);
app.use("/sustainability", sustainabilityRoutes);
app.use("/blockchain", blockchainRoutes);
app.use("/agriculture", agricultureRoutes);
app.use("/buyer", buyerRoutes);
app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/insights", insightsRoutes);
app.use("/aggregation", aggregationRoutes);
app.use("/reputation", reputationRoutes);
app.use("/supplier-insights", supplierInsightsRoutes);
app.use("/voice", voiceRoutes);

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
