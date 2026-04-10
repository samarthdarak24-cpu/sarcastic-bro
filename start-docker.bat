@echo off
REM ========================================
REM Start AgriTrust with Docker
REM ========================================

echo.
echo ========================================
echo   AgriTrust - Docker Startup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check if services are already running
docker-compose ps | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Services are already running!
    echo.
    echo To restart, run: docker-compose down -v
    echo.
    echo Frontend: http://localhost:3000
    echo Backend:  http://localhost:3001
    echo.
    pause
    exit /b 0
)

echo [START] Starting all services...
echo.
echo This will:
echo   1. Start PostgreSQL database
echo   2. Run database migrations
echo   3. Seed logistics data (3 entries)
echo   4. Start backend API
echo   5. Start frontend web app
echo.
echo Please wait... (this may take 2-3 minutes on first run)
echo.

docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Services Started Successfully!
    echo ========================================
    echo.
    echo Waiting for database to be ready...
    timeout /t 10 /nobreak >nul
    
    echo.
    echo Checking service status...
    docker-compose ps
    
    echo.
    echo ========================================
    echo   Access Points
    echo ========================================
    echo.
    echo   Frontend:  http://localhost:3000
    echo   Backend:   http://localhost:3001
    echo   Database:  localhost:5432
    echo.
    echo ========================================
    echo   Login Credentials
    echo ========================================
    echo.
    echo   FPO Admin:  fpo@test.com / Test@1234
    echo   Buyer:      buyer@test.com / Test@1234
    echo   Farmer:     farmer@test.com / Test@1234
    echo.
    echo ========================================
    echo   Logistics Data
    echo ========================================
    echo.
    echo   3 logistics entries seeded:
    echo     - 1 DELIVERED (Wheat - 1300kg)
    echo     - 1 IN_TRANSIT (Soybean - 900kg)
    echo     - 1 REQUESTED (Onion - 500kg)
    echo.
    echo ========================================
    echo   Next Steps
    echo ========================================
    echo.
    echo   1. Visit http://localhost:3000
    echo   2. Login as FPO Admin
    echo   3. Go to /fpo/logistics
    echo   4. See the logistics dashboard!
    echo.
    echo ========================================
    echo   Useful Commands
    echo ========================================
    echo.
    echo   View logs:     docker-compose logs -f
    echo   Stop services: docker-compose stop
    echo   Reset all:     docker-compose down -v
    echo   Rebuild:       docker-compose up -d --build
    echo.
    echo ========================================
) else (
    echo.
    echo [ERROR] Failed to start services!
    echo.
    echo Check the error messages above.
    echo Common issues:
    echo   - Ports 3000, 3001, or 5432 already in use
    echo   - Docker not running
    echo   - Insufficient disk space
    echo.
)

pause
