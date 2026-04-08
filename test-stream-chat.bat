@echo off
echo Testing Stream AI Chat with Agents...

set AI_SERVICE_URL=http://localhost:8000

echo.
echo 1. Testing Stream Chat health...
powershell -Command "try { $response = Invoke-WebRequest -Uri '%AI_SERVICE_URL%/stream-chat/health' -Method GET -UseBasicParsing; Write-Host '✅ Stream Chat Service: RUNNING' -ForegroundColor Green; Write-Host $response.Content } catch { Write-Host '❌ Stream Chat Service: ERROR' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo 2. Testing agent types...
powershell -Command "try { $response = Invoke-WebRequest -Uri '%AI_SERVICE_URL%/stream-chat/agents/types' -Method GET -UseBasicParsing; Write-Host '✅ Agent Types: AVAILABLE' -ForegroundColor Green; Write-Host $response.Content } catch { Write-Host '❌ Agent Types: ERROR' -ForegroundColor Red }"

echo.
echo 3. Testing demo setup...
powershell -Command "try { $response = Invoke-WebRequest -Uri '%AI_SERVICE_URL%/stream-chat/demo' -Method GET -UseBasicParsing; Write-Host '✅ Demo Setup: SUCCESS' -ForegroundColor Green; Write-Host $response.Content } catch { Write-Host '❌ Demo Setup: ERROR' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo 4. Testing service stats...
powershell -Command "try { $response = Invoke-WebRequest -Uri '%AI_SERVICE_URL%/stream-chat/stats' -Method GET -UseBasicParsing; Write-Host '✅ Service Stats: AVAILABLE' -ForegroundColor Green; Write-Host $response.Content } catch { Write-Host '❌ Service Stats: ERROR' -ForegroundColor Red }"

echo.
echo Test complete!
echo.
echo If all tests pass, you can:
echo 1. Visit http://localhost:3000/stream-chat
echo 2. Start AI agents from the sidebar
echo 3. Chat with specialized agricultural experts
echo 4. Get real-time responses with source citations
echo.
pause