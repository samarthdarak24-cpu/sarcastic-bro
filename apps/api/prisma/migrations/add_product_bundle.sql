-- Add ProductBundle model
CREATE TABLE IF NOT EXISTS "ProductBundle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "farmerId" TEXT NOT NULL,
    "productIds" TEXT NOT NULL,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductBundle_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "ProductBundle_farmerId_idx" ON "ProductBundle"("farmerId");
CREATE INDEX "ProductBundle_isActive_idx" ON "ProductBundle"("isActive");
