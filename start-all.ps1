# Master Startup Script for Sweet Home Bakery
# Starts both backend and frontend servers in separate PowerShell windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sweet Home Bakery - Local Development" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = $false
try {
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq 'Running') {
        $mongoRunning = $true
        Write-Host "MongoDB is running" -ForegroundColor Green
    }
} catch {
    $mongoRunning = $false
}

if (-not $mongoRunning) {
    Write-Host "MongoDB is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "  Option 1: Start MongoDB service" -ForegroundColor White
    Write-Host "    net start MongoDB" -ForegroundColor Gray
    Write-Host "  Option 2: Run in separate terminal" -ForegroundColor White
    Write-Host "    mongod --dbpath C:\data\db" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit 1
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\backend'; .\start-backend.ps1"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\frontend'; .\start-frontend.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Servers are starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Close the individual PowerShell windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
