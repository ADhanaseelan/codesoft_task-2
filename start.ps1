# RiseWise Alarm Clock - Development Server Starter Script
# Purpose: Start Expo dev server with increased memory allocation

Write-Host "Starting RiseWise Alarm Clock - Development Server..." -ForegroundColor Green
Write-Host ""

# Set Node memory to 8GB to avoid heap issues
$env:NODE_OPTIONS = "--max-old-space-size=8192"

Write-Host "Node Memory Configuration:" -ForegroundColor Yellow
Write-Host "   NODE_OPTIONS=$env:NODE_OPTIONS" -ForegroundColor Gray
Write-Host ""

Write-Host "Starting Expo development server..." -ForegroundColor Cyan
Write-Host "   This may take 30-60 seconds on first run..." -ForegroundColor Gray
Write-Host ""

# Run npm start
npm start

Write-Host ""
Write-Host "Development server started!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   * Press 'a' for Android" -ForegroundColor Gray
Write-Host "   * Press 'i' for iOS" -ForegroundColor Gray
Write-Host "   * Press 'w' for Web" -ForegroundColor Gray
Write-Host "   * Press 'r' to reload" -ForegroundColor Gray
Write-Host "   * Press 'q' to quit" -ForegroundColor Gray
Write-Host ""
