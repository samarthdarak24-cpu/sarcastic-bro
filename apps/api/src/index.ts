/* ========================================================================
   Server Entry Point — ODOP Connect API
   HTTP + Socket.IO server with graceful shutdown.
   ======================================================================== */

import http from "http";
import app from "./app";
import { env } from "./config/env";
import prisma from "./prisma/client";
import { SocketService } from "./config/socket";
import { initializeSocketService } from "./services/socketService";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with JWT auth and room-based architecture
SocketService.initialize(server);

// Initialize Socket Service for event emissions
const io = SocketService.getIO();
initializeSocketService(io);

/* ─── Server Start ──────────────────────────────────────────────────── */

async function start() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("[DB] Connected to database");

    // Initialize Intelligent Operations Schedulers
    // const { AutoSellService } = require("./modules/auto-sell/auto-sell.service");
    // AutoSellService.initScheduler();
    // console.log("[Cron] Auto-Sell Scheduler Active ✓");

    server.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║   ODOP Connect API v2.0                  ║
║   Port: ${env.PORT}                             ║
║   Mode: ${env.NODE_ENV.padEnd(20)}         ║
║   DB:   Connected ✓                      ║
║   WS:   Socket.IO Ready ✓               ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("[FATAL] Failed to start server:", error);
    process.exit(1);
  }
}

/* ─── Graceful Shutdown ─────────────────────────────────────────────── */

const shutdown = async (signal: string) => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log("[Server] Closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start();
