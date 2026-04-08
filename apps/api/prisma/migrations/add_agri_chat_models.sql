-- Migration: Add AgriChat Models
-- Description: Adds WhatsApp-like chat system for Farmers and Buyers
-- Date: 2024

-- ChatRoom table
CREATE TABLE IF NOT EXISTS "ChatRoom" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL UNIQUE,
  "farmerId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "productName" TEXT,
  "orderAmount" REAL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastMessageBy" TEXT,
  "unreadCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "ChatRoom_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
  CONSTRAINT "ChatRoom_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id"),
  CONSTRAINT "ChatRoom_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id")
);

CREATE INDEX "ChatRoom_farmerId_idx" ON "ChatRoom"("farmerId");
CREATE INDEX "ChatRoom_buyerId_idx" ON "ChatRoom"("buyerId");
CREATE INDEX "ChatRoom_status_idx" ON "ChatRoom"("status");
CREATE INDEX "ChatRoom_lastMessageAt_idx" ON "ChatRoom"("lastMessageAt");
CREATE INDEX "ChatRoom_createdAt_idx" ON "ChatRoom"("createdAt");

-- ChatRoomMessage table
CREATE TABLE IF NOT EXISTS "ChatRoomMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatRoomId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'text',
  "fileUrl" TEXT,
  "fileName" TEXT,
  "fileSize" INTEGER,
  "mimeType" TEXT,
  "status" TEXT NOT NULL DEFAULT 'SENT',
  "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deliveredAt" DATETIME,
  "seenAt" DATETIME,
  "metadata" TEXT,
  "isEdited" BOOLEAN NOT NULL DEFAULT 0,
  "editedAt" DATETIME,
  "isDeleted" BOOLEAN NOT NULL DEFAULT 0,
  "deletedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "ChatRoomMessage_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE,
  CONSTRAINT "ChatRoomMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id")
);

CREATE INDEX "ChatRoomMessage_chatRoomId_idx" ON "ChatRoomMessage"("chatRoomId");
CREATE INDEX "ChatRoomMessage_senderId_idx" ON "ChatRoomMessage"("senderId");
CREATE INDEX "ChatRoomMessage_status_idx" ON "ChatRoomMessage"("status");
CREATE INDEX "ChatRoomMessage_type_idx" ON "ChatRoomMessage"("type");
CREATE INDEX "ChatRoomMessage_createdAt_idx" ON "ChatRoomMessage"("createdAt");
CREATE INDEX "ChatRoomMessage_chatRoomId_createdAt_idx" ON "ChatRoomMessage"("chatRoomId", "createdAt");

-- MessageReaction table
CREATE TABLE IF NOT EXISTS "MessageReaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "messageId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "emoji" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatRoomMessage" ("id") ON DELETE CASCADE,
  CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  UNIQUE("messageId", "userId", "emoji")
);

CREATE INDEX "MessageReaction_messageId_idx" ON "MessageReaction"("messageId");
CREATE INDEX "MessageReaction_userId_idx" ON "MessageReaction"("userId");

-- TypingIndicator table
CREATE TABLE IF NOT EXISTS "TypingIndicator" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatRoomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" DATETIME NOT NULL,
  CONSTRAINT "TypingIndicator_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE,
  CONSTRAINT "TypingIndicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id")
);

CREATE INDEX "TypingIndicator_chatRoomId_idx" ON "TypingIndicator"("chatRoomId");
CREATE INDEX "TypingIndicator_userId_idx" ON "TypingIndicator"("userId");
CREATE INDEX "TypingIndicator_expiresAt_idx" ON "TypingIndicator"("expiresAt");

-- UserOnlineStatus table
CREATE TABLE IF NOT EXISTS "UserOnlineStatus" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatRoomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "isOnline" BOOLEAN NOT NULL DEFAULT 1,
  "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "socketId" TEXT,
  CONSTRAINT "UserOnlineStatus_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE,
  CONSTRAINT "UserOnlineStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  UNIQUE("chatRoomId", "userId")
);

CREATE INDEX "UserOnlineStatus_chatRoomId_idx" ON "UserOnlineStatus"("chatRoomId");
CREATE INDEX "UserOnlineStatus_userId_idx" ON "UserOnlineStatus"("userId");
CREATE INDEX "UserOnlineStatus_isOnline_idx" ON "UserOnlineStatus"("isOnline");

-- MessageSearchIndex table
CREATE TABLE IF NOT EXISTS "MessageSearchIndex" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "messageId" TEXT NOT NULL UNIQUE,
  "chatRoomId" TEXT NOT NULL,
  "searchableText" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageSearchIndex_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatRoomMessage" ("id") ON DELETE CASCADE
);

CREATE INDEX "MessageSearchIndex_chatRoomId_idx" ON "MessageSearchIndex"("chatRoomId");

-- ChatNotification table
CREATE TABLE IF NOT EXISTS "ChatNotification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatRoomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT 0,
  "soundEnabled" BOOLEAN NOT NULL DEFAULT 1,
  "pushEnabled" BOOLEAN NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChatNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id")
);

CREATE INDEX "ChatNotification_userId_idx" ON "ChatNotification"("userId");
CREATE INDEX "ChatNotification_chatRoomId_idx" ON "ChatNotification"("chatRoomId");
CREATE INDEX "ChatNotification_isRead_idx" ON "ChatNotification"("isRead");

-- ChatRoomUser table
CREATE TABLE IF NOT EXISTS "ChatRoomUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatRoomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leftAt" DATETIME,
  "isActive" BOOLEAN NOT NULL DEFAULT 1,
  "role" TEXT NOT NULL DEFAULT 'PARTICIPANT',
  CONSTRAINT "ChatRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  UNIQUE("chatRoomId", "userId")
);

CREATE INDEX "ChatRoomUser_chatRoomId_idx" ON "ChatRoomUser"("chatRoomId");
CREATE INDEX "ChatRoomUser_userId_idx" ON "ChatRoomUser"("userId");
