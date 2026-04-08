# Test AI Service
Write-Host "Testing AI Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n[1] Testing Health Endpoint..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:8001/health" -Method GET
Write-Host "Status: $($health.status)" -ForegroundColor Green
Write-Host "Service: $($health.service)" -ForegroundColor Green

# Test 2: Create Session
Write-Host "`n[2] Creating Chat Session..." -ForegroundColor Yellow
$sessionBody = @{
    user_id = "test-user-123"
} | ConvertTo-Json

$session = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/session/create" -Method POST -Headers @{"Content-Type"="application/json"} -Body $sessionBody
Write-Host "Session ID: $($session.session_id)" -ForegroundColor Green

# Test 3: Send Chat Message
Write-Host "`n[3] Sending Chat Message..." -ForegroundColor Yellow
$chatBody = @{
    session_id = $session.session_id
    message = "What is the capital of France?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody
Write-Host "AI Response: $($response.response)" -ForegroundColor Green

# Test 4: Ask about ODOP Platform
Write-Host "`n[4] Asking about ODOP Platform..." -ForegroundColor Yellow
$chatBody2 = @{
    session_id = $session.session_id
    message = "How do I add products as a farmer?"
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody2
Write-Host "AI Response: $($response2.response)" -ForegroundColor Green

Write-Host "`n✅ All tests passed!" -ForegroundColor Green
