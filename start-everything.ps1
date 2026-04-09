# ============================================
# ODOP Connect - Complete Startup Script
# ============================================

Write-Host "🚀 Starting ODOP Connect - Complete Real-Time Dashboard" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "📋 Step 1: Checking Docker..." -ForegroundColor Cyan
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""

# Check if PostgreSQL container exists
Write-Host "📋 Step 2: Setting up PostgreSQL..." -ForegroundColor Cyan
$containerExists = docker ps -a --filter "name=odop-postgres" --format "{{.Names}}"

if ($containerExists -eq "odop-postgres") {
    Write-Host "Container exists. Checking status..." -ForegroundColor Yellow
    $containerRunning = docker ps --filter "name=odop-postgres" --format "{{.Names}}"
    
    if ($containerRunning -eq "odop-postgres") {
        Write-Host "✅ PostgreSQL container is already running" -ForegroundColor Green
    } else {
        Write-Host "Starting existing container..." -ForegroundColor Yellow
        docker start odop-postgres
        Write-Host "✅ PostgreSQL container started" -ForegroundColor Green
        Start-Sleep -Seconds 5
    }
} else {
    Write-Host "Creating new PostgreSQL container..." -ForegroundColor Yellow
    docker run --name odop-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=odop_connect -p 5432:5432 -d postgres:15
    Write-Host "✅ PostgreSQL container created" -ForegroundColor Green
    Write-Host "Waiting for PostgreSQL to initialize (10 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host ""

# Setup database schema
Write-Host "📋 Step 3: Setting up database schema..." -ForegroundColor Cyan
Set-Location -Path "apps/api"
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database schema created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create database schema" -ForegroundColor Red
    Set-Location -Path "../.."
    exit 1
}

Write-Host ""

# Seed test data
Write-Host "📋 Step 4: Adding test data..." -ForegroundColor Cyan
npm run db:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Test data added" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: Failed to seed data (may already exist)" -ForegroundColor Yellow
}

Write-Host ""

# Start backend
Write-Host "📋 Step 5: Starting backend server..." -ForegroundColor Cyan
Write-Host "Backend will start on http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "👤 Test Accounts:" -ForegroundColor Cyan
Write-Host "   Farmer: farmer@test.com / Farmer123" -ForegroundColor White
Write-Host "   Buyer:  buyer@test.com / Buyer123" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Starting backend server now..." -ForegroundColor Cyan
Write-Host "   (Press Ctrl+C to stop)" -ForegroundColor Yellow
Write-Host ""

npm run dev
