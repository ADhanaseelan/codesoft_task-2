@echo off
REM RiseWise Alarm Clock - Development Server Starter Script (Windows CMD)
REM Purpose: Start Expo dev server with increased memory allocation

echo.
echo ========================================
echo   RiseWise Alarm Clock
echo   Development Server Starter
echo ========================================
echo.

REM Set Node memory to 8GB to avoid heap issues
set NODE_OPTIONS=--max-old-space-size=8192

echo Node Memory Configuration:
echo   NODE_OPTIONS=%NODE_OPTIONS%
echo.

echo Starting Expo development server...
echo (This may take 30-60 seconds on first run)
echo.

REM Run npm start
call npm start

echo.
echo ========================================
echo   Development server started!
echo ========================================
echo.
echo Next steps:
echo   * Press 'a' for Android
echo   * Press 'i' for iOS  
echo   * Press 'w' for Web
echo   * Press 'r' to reload
echo   * Press 'q' to quit
echo.
pause
