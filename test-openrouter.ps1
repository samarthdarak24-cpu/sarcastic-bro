# Test OpenRouter Integration
Write-Host "Testing OpenRouter AI..." -ForegroundColor Cyan

# Create Session
$sessionBody = @{
    user_id = "test-user-456"
} | ConvertTo-Json

$session = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/session/create" -Method POST -Headers @{"Content-Type"="application/json"} -Body $sessionBody
Write-Host "Session ID: $($session.session_id)" -ForegroundColor Green

# Test 1: General Knowledge Question
Write-Host "`n[Test 1] General Knowledge Question..." -ForegroundColor Yellow
$chatBody = @{
    session_id = $session.session_id
    message = "Explain quantum computing in simple terms"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody
Write-Host "AI Response:`n$($response.response)" -ForegroundColor Green

# Test 2: Math Question
Write-Host "`n[Test 2] Math Question..." -ForegroundColor Yellow
$chatBody2 = @{
    session_id = $session.session_id
    message = "What is 25 * 47?"
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody2
Write-Host "AI Response:`n$($response2.response)" -ForegroundColor Green

# Test 3: ODOP Platform Question
Write-Host "`n[Test 3] ODOP Platform Question..." -ForegroundColor Yellow
$chatBody3 = @{
    session_id = $session.session_id
    message = "What features does ODOP Connect offer for farmers?"
} | ConvertTo-Json

$response3 = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody3
Write-Host "AI Response:`n$($response3.response)" -ForegroundColor Green

Write-Host "`n✅ OpenRouter tests complete!" -ForegroundColor Green
