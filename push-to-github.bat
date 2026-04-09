@echo off
echo ========================================
echo   Push to GitHub
echo ========================================
echo.
echo Repository: https://github.com/samarthdarak24-cpu/sarcastic-bro.git
echo Branch: main
echo.

echo [1/5] Checking git status...
git status
echo.

echo [2/5] Staging all changes...
git add -A
echo.

echo [3/5] Checking what will be committed...
git status
echo.

set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=feat: implement live mandi ticker and fix TypeScript errors

echo.
echo [4/5] Committing changes...
git commit -m "%commit_msg%"
echo.

echo [5/5] Pushing to GitHub...
git push origin main
echo.

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR: Push failed!
    echo ========================================
    echo.
    echo Common solutions:
    echo 1. Check your internet connection
    echo 2. Verify GitHub authentication
    echo 3. Try: git pull origin main
    echo 4. Check PUSH_TO_GITHUB.md for help
    echo.
) else (
    echo.
    echo ========================================
    echo   SUCCESS! Changes pushed to GitHub
    echo ========================================
    echo.
    echo View your repository at:
    echo https://github.com/samarthdarak24-cpu/sarcastic-bro
    echo.
)

pause
