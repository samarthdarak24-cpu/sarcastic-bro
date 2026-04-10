-- FPO Features Enhancement Migration
-- Adds tables and fields for complete FPO functionality

-- Add FPO chat support
CREATE TABLE IF NOT EXISTS "FPOChat" (
  "id" TEXT PRIMARY KEY,
  "fpoId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "orderId" TEXT,
  "lastMessage" TEXT,
  "lastMessageAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FPOChat_fpoId_fkey" FOREIGN KEY ("fpoId") REFERENCES "FPO"("id") ON DELETE CASCADE,
  CONSTRAINT "FPOChat_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Add FPO chat messages
CREATE TABLE IF NOT EXISTS "FPOChatMessage" (
  "id" TEXT PRIMARY KEY,
  "chatId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "attachments" TEXT[],
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FPOChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "FPOChat"("id") ON DELETE CASCADE,
  CONSTRAINT "FPOChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Add FPO logistics tracking
CREATE TABLE IF NOT EXISTS "FPOLogistics" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL UNIQUE,
  "fpoId" TEXT NOT NULL,
  "trackingNumber" TEXT,
  "carrier" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "currentLocation" TEXT,
  "estimatedDelivery" TIMESTAMP(3),
  "actualDelivery" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FPOLogistics_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  CONSTRAINT "FPOLogistics_fpoId_fkey" FOREIGN KEY ("fpoId") REFERENCES "FPO"("id") ON DELETE CASCADE
);

-- Add logistics tracking events
CREATE TABLE IF NOT EXISTS "LogisticsEvent" (
  "id" TEXT PRIMARY KEY,
  "logisticsId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "location" TEXT,
  "description" TEXT,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LogisticsEvent_logisticsId_fkey" FOREIGN KEY ("logisticsId") REFERENCES "FPOLogistics"("id") ON DELETE CASCADE
);

-- Add FPO payout splits
CREATE TABLE IF NOT EXISTS "FPOPayoutSplit" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "fpoId" TEXT NOT NULL,
  "fpoFarmerId" TEXT NOT NULL,
  "cropId" TEXT NOT NULL,
  "farmerShare" DECIMAL(10,2) NOT NULL,
  "fpoCommission" DECIMAL(10,2) NOT NULL,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FPOPayoutSplit_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  CONSTRAINT "FPOPayoutSplit_fpoId_fkey" FOREIGN KEY ("fpoId") REFERENCES "FPO"("id") ON DELETE CASCADE,
  CONSTRAINT "FPOPayoutSplit_fpoFarmerId_fkey" FOREIGN KEY ("fpoFarmerId") REFERENCES "FPOFarmer"("id") ON DELETE CASCADE,
  CONSTRAINT "FPOPayoutSplit_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "FPOChat_fpoId_idx" ON "FPOChat"("fpoId");
CREATE INDEX IF NOT EXISTS "FPOChat_buyerId_idx" ON "FPOChat"("buyerId");
CREATE INDEX IF NOT EXISTS "FPOChatMessage_chatId_idx" ON "FPOChatMessage"("chatId");
CREATE INDEX IF NOT EXISTS "FPOChatMessage_senderId_idx" ON "FPOChatMessage"("senderId");
CREATE INDEX IF NOT EXISTS "FPOLogistics_orderId_idx" ON "FPOLogistics"("orderId");
CREATE INDEX IF NOT EXISTS "FPOLogistics_fpoId_idx" ON "FPOLogistics"("fpoId");
CREATE INDEX IF NOT EXISTS "LogisticsEvent_logisticsId_idx" ON "LogisticsEvent"("logisticsId");
CREATE INDEX IF NOT EXISTS "FPOPayoutSplit_orderId_idx" ON "FPOPayoutSplit"("orderId");
CREATE INDEX IF NOT EXISTS "FPOPayoutSplit_fpoId_idx" ON "FPOPayoutSplit"("fpoId");
CREATE INDEX IF NOT EXISTS "FPOPayoutSplit_fpoFarmerId_idx" ON "FPOPayoutSplit"("fpoFarmerId");
