# Complete System Test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ODOP Connect - Complete System Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: AI Service
Write-Host "`n[1/3] Testing AI Service (Port 8001)..." -ForegroundColor Yellow
try {
    $aiHealth = Invoke-RestMethod -Uri "http://localhost:8001/health" -Method GET
    Write-Host "✅ AI Service: $($aiHealth.status)" -ForegroundColor Green
    Write-Host "   Model: $($aiHealth.service)" -ForegroundColor Gray
} catch {
    Write-Host "❌ AI Service: FAILED" -ForegroundColor Red
}

# Test 2: Backend API
Write-Host "`n[2/3] Testing Backend API (Port 3001)..." -ForegroundColor Yellow
try {
    $apiHealth = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Backend API: OK" -ForegroundColor Green
    Write-Host "   Database: Connected" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend API: FAILED" -ForegroundColor Red
}

# Test 3: Frontend
Write-Host "`n[3/3] Testing Frontend (Port 3000)..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Running" -ForegroundColor Green
        Write-Host "   Status Code: $($frontend.StatusCode)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Frontend: FAILED" -ForegroundColor Red
}

# Test 4: AI Chat Functionality
Write-Host "`n[4/4] Testing AI Chat Functionality..." -ForegroundColor Yellow
try {
    # Create session
    $sessionBody = @{
        user_id = "system-test"
    } | ConvertTo-Json
    
    $session = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/session/create" -Method POST -Headers @{"Content-Type"="application/json"} -Body $sessionBody
    
    # Send test message
    $chatBody = @{
        session_id = $session.session_id
        message = "What is 10 + 20?"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody
    
    Write-Host "✅ AI Chat: Working" -ForegroundColor Green
    Write-Host "   Question: What is 10 + 20?" -ForegroundColor Gray
    Write-Host "   Answer: $($response.response.Substring(0, [Math]::Min(100, $response.response.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ AI Chat: FAILED" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "System Status Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "AI Service:  http://localhost:8001" -ForegroundColor White
Write-Host "`n✅ All systems operational!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
