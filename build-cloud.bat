@echo off
REM RiseWise Alarm Clock - Cloud Build Script
REM This script builds your app on Expo servers

color 0B
cls

echo.
echo ========================================================================
echo            RiseWise Alarm Clock - Cloud Build Setup
echo ========================================================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    color 0C
    echo ERROR: package.json not found!
    echo Please run this script from: e:\codsoft\Task-3
    pause
    exit /b 1
)

REM Step 1: Check Node and npm
echo Step 1: Checking Node.js and npm...
node --version
npm --version
echo.

REM Step 2: Check login status
echo Step 2: Checking Expo login status...
npx eas whoami >nul 2>&1
if errorlevel 1 (
    echo Not logged in. Please login to Expo...
    npx eas login
) else (
    echo Already logged in to Expo
)
echo.

REM Step 3: Check EAS configuration
echo Step 3: Checking EAS configuration...
if not exist "eas.json" (
    echo Initializing EAS configuration...
    npx eas init
) else (
    echo EAS configuration found
)
echo.

REM Step 4: Build
echo Step 4: Building Android APK on Expo servers...
echo This may take 10-15 minutes on first build...
echo.

npx eas build --platform android --profile preview

echo.
echo ========================================================================
echo                     Build Complete!
echo ========================================================================
echo.
echo Next Steps:
echo 1. Go to https://expo.dev/dashboard
echo 2. Sign in with your account
echo 3. Find your 'risewise' project
echo 4. Click the APK file to download
echo 5. Transfer APK to your Android phone
echo 6. Tap to install and run!
echo.
echo To check build status, run:
echo   npx eas build:list
echo.
echo Your RiseWise alarm clock is ready!
echo.

pause
