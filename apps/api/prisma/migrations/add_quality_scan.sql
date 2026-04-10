-- CreateTable
CREATE TABLE IF NOT EXISTS "QualityScan" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "productId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "defects" INTEGER NOT NULL DEFAULT 0,
    "freshness" INTEGER NOT NULL DEFAULT 0,
    "color" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QualityScan_farmerId_idx" ON "QualityScan"("farmerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QualityScan_productId_idx" ON "QualityScan"("productId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QualityScan_createdAt_idx" ON "QualityScan"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QualityScan_grade_idx" ON "QualityScan"("grade");

-- AddForeignKey
ALTER TABLE "QualityScan" ADD CONSTRAINT "QualityScan_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityScan" ADD CONSTRAINT "QualityScan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
