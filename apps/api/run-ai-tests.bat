@echo off
REM Script to run AI module integration tests on Windows

echo ========================================
echo AI Module Integration Tests
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if Prisma client is generated
echo Checking Prisma setup...
call npm run db:generate
echo.

REM Run the AI integration tests
echo Running AI module tests...
echo.
call npm run test:ai

echo.
echo ========================================
echo Tests completed!
echo ========================================
echo.
echo To run all tests: npm test
echo To run with coverage: npm run test:coverage
echo To run in watch mode: npm run test:watch
echo.

pause
