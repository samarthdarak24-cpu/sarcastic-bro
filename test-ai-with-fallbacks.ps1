# Test AI with Multiple Model Fallbacks
Write-Host "Testing AI with Fallback Models..." -ForegroundColor Cyan

# Create Session
$sessionBody = @{
    user_id = "fallback-test"
} | ConvertTo-Json

$session = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/session/create" -Method POST -Headers @{"Content-Type"="application/json"} -Body $sessionBody
Write-Host "Session ID: $($session.session_id)" -ForegroundColor Green

# Test 1: Simple greeting
Write-Host "`n[Test 1] Simple Greeting..." -ForegroundColor Yellow
$chatBody = @{
    session_id = $session.session_id
    message = "Hello! How are you?"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody
Write-Host "AI Response:`n$($response.response)" -ForegroundColor Green

# Test 2: Order question
Write-Host "`n[Test 2] Order Question..." -ForegroundColor Yellow
$chatBody2 = @{
    session_id = $session.session_id
    message = "I need to check my orders"
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody2
Write-Host "AI Response:`n$($response2.response)" -ForegroundColor Green

# Test 3: General knowledge
Write-Host "`n[Test 3] General Knowledge..." -ForegroundColor Yellow
$chatBody3 = @{
    session_id = $session.session_id
    message = "What is the capital of India?"
} | ConvertTo-Json

$response3 = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/simple-chat/chat" -Method POST -Headers @{"Content-Type"="application/json"} -Body $chatBody3
Write-Host "AI Response:`n$($response3.response)" -ForegroundColor Green

Write-Host "`n✅ Tests complete!" -ForegroundColor Green
