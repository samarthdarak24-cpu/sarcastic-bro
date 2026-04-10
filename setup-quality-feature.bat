@echo off
echo ========================================
echo AI Quality Certification Feature Setup
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
cd apps\api
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/4] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

cd ..\..

echo [3/4] Installing frontend dependencies...
cd apps\web
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

cd ..\..

echo [4/4] Creating database migration SQL...
echo.
echo ========================================
echo DATABASE SETUP REQUIRED
echo ========================================
echo.
echo Please run this SQL in your PostgreSQL database:
echo.
echo CREATE TABLE IF NOT EXISTS "QualityScan" (
echo     "id" TEXT NOT NULL,
echo     "farmerId" TEXT NOT NULL,
echo     "productId" TEXT,
echo     "imageUrl" TEXT NOT NULL,
echo     "grade" TEXT NOT NULL,
echo     "score" INTEGER NOT NULL,
echo     "defects" INTEGER NOT NULL DEFAULT 0,
echo     "freshness" INTEGER NOT NULL DEFAULT 0,
echo     "color" INTEGER NOT NULL DEFAULT 0,
echo     "size" INTEGER NOT NULL DEFAULT 0,
echo     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
echo     "updatedAt" TIMESTAMP(3) NOT NULL,
echo     CONSTRAINT "QualityScan_pkey" PRIMARY KEY ("id")
echo );
echo.
echo CREATE INDEX IF NOT EXISTS "QualityScan_farmerId_idx" ON "QualityScan"("farmerId");
echo CREATE INDEX IF NOT EXISTS "QualityScan_productId_idx" ON "QualityScan"("productId");
echo CREATE INDEX IF NOT EXISTS "QualityScan_createdAt_idx" ON "QualityScan"("createdAt");
echo CREATE INDEX IF NOT EXISTS "QualityScan_grade_idx" ON "QualityScan"("grade");
echo.
echo ALTER TABLE "QualityScan" ADD CONSTRAINT "QualityScan_farmerId_fkey" 
echo   FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
echo.
echo ALTER TABLE "QualityScan" ADD CONSTRAINT "QualityScan_productId_fkey" 
echo   FOREIGN KEY ("productId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
echo.
echo ========================================
echo.
echo ✓ Setup complete!
echo.
echo NEXT STEPS:
echo 1. Run the SQL above in your PostgreSQL database
echo 2. Start backend: cd apps\api ^&^& npm run dev
echo 3. Start frontend: cd apps\web ^&^& npm run dev
echo 4. Navigate to Farmer Dashboard -^> AI Quality Scan
echo.
echo TROUBLESHOOTING:
echo - Ensure PostgreSQL is running
echo - Check DATABASE_URL in apps\api\.env
echo - Verify JWT_SECRET is set in apps\api\.env
echo - Check ports 3001 (API) and 3000 (Web) are available
echo.
pause
