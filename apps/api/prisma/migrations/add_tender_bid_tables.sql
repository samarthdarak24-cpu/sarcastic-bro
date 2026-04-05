-- CreateTable
CREATE TABLE IF NOT EXISTS "Tender" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "product" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "buyerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Bid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenderId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("tenderId") REFERENCES "Tender" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Tender_buyerId_idx" ON "Tender"("buyerId");
CREATE INDEX IF NOT EXISTS "Tender_status_idx" ON "Tender"("status");
CREATE INDEX IF NOT EXISTS "Tender_deadline_idx" ON "Tender"("deadline");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Bid_tenderId_idx" ON "Bid"("tenderId");
CREATE INDEX IF NOT EXISTS "Bid_farmerId_idx" ON "Bid"("farmerId");
CREATE INDEX IF NOT EXISTS "Bid_status_idx" ON "Bid"("status");
