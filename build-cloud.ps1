#!/usr/bin/env pwsh
# RiseWise Alarm Clock - Cloud Build Script
# This script builds your app on Expo servers and prepares it for download

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         RiseWise Alarm Clock - Cloud Build Setup              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$projectPath = "e:\codsoft\Task-3"
if (-not (Test-Path "$projectPath\package.json")) {
    Write-Host "Error: package.json not found at $projectPath" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath

Write-Host "Step 1: Checking npm and Node installation..." -ForegroundColor Green
node --version
npm --version
Write-Host ""

Write-Host "Step 2: Checking if you're logged into Expo..." -ForegroundColor Green
try {
    $result = npx eas whoami 2>&1
    if ($result -like "*Not authenticated*") {
        Write-Host "Not logged in. Please login..." -ForegroundColor Yellow
        npx eas login
    } else {
        Write-Host "Logged in as: $result" -ForegroundColor Green
    }
} catch {
    Write-Host "Please login to Expo" -ForegroundColor Yellow
    npx eas login
}
Write-Host ""

Write-Host "Step 3: Checking EAS configuration..." -ForegroundColor Green
if (-not (Test-Path "eas.json")) {
    Write-Host "Initializing EAS configuration..." -ForegroundColor Yellow
    npx eas init
} else {
    Write-Host "EAS configuration found" -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 4: Building Android APK on Expo servers..." -ForegroundColor Green
Write-Host "This may take 10-15 minutes on first build..." -ForegroundColor Yellow
Write-Host ""

npx eas build --platform android --profile preview

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Build Complete!                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "1. Go to https://expo.dev/dashboard" -ForegroundColor White
Write-Host "2. Sign in with your account" -ForegroundColor White
Write-Host "3. Find your 'risewise' project" -ForegroundColor White
Write-Host "4. Click the APK file to download" -ForegroundColor White
Write-Host "5. Transfer APK to your Android phone" -ForegroundColor White
Write-Host "6. Tap to install and run!" -ForegroundColor White
Write-Host ""

Write-Host "Instant Download Link:" -ForegroundColor Green
Write-Host "Run this to check build status:" -ForegroundColor White
Write-Host "  npx eas build:list" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your RiseWise alarm clock is ready!" -ForegroundColor Green
