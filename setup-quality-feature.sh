#!/bin/bash

echo "🚀 Setting up AI Quality Certification Feature..."
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd apps/api
npm install
echo "✅ Backend dependencies installed"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Create database table (if using PostgreSQL)
echo "🗄️  Creating QualityScan table..."
echo "Run this SQL in your PostgreSQL database:"
echo ""
cat << 'EOF'
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

CREATE INDEX IF NOT EXISTS "QualityScan_farmerId_idx" ON "QualityScan"("farmerId");
CREATE INDEX IF NOT EXISTS "QualityScan_productId_idx" ON "QualityScan"("productId");
CREATE INDEX IF NOT EXISTS "QualityScan_createdAt_idx" ON "QualityScan"("createdAt");
CREATE INDEX IF NOT EXISTS "QualityScan_grade_idx" ON "QualityScan"("grade");

ALTER TABLE "QualityScan" ADD CONSTRAINT "QualityScan_farmerId_fkey" 
  FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "QualityScan" ADD CONSTRAINT "QualityScan_productId_fkey" 
  FOREIGN KEY ("productId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EOF
echo ""

cd ../..

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd apps/web
npm install
echo "✅ Frontend dependencies installed"
echo ""

cd ../..

echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run the SQL above in your PostgreSQL database"
echo "2. Start the backend: cd apps/api && npm run dev"
echo "3. Start the frontend: cd apps/web && npm run dev"
echo "4. Navigate to Farmer Dashboard → AI Quality Scan"
echo ""
echo "🔍 Troubleshooting:"
echo "- Make sure PostgreSQL is running"
echo "- Check DATABASE_URL in apps/api/.env"
echo "- Verify JWT_SECRET is set in apps/api/.env"
echo "- Check that port 3001 (API) and 3000 (Web) are available"
