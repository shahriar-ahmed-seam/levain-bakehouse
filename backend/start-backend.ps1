# Backend Startup Script for Windows PowerShell
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
$mongoRunning = $false
try {
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq 'Running') {
        $mongoRunning = $true
        Write-Host "MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "MongoDB is not running" -ForegroundColor Red
    }
} catch {
    Write-Host "MongoDB is not running" -ForegroundColor Red
}

if (-not $mongoRunning) {
    Write-Host ""
    Write-Host "MongoDB is not running. Please start MongoDB first:" -ForegroundColor Red
    Write-Host "  Option 1: Start MongoDB service (if installed as service)" -ForegroundColor Yellow
    Write-Host "    net start MongoDB" -ForegroundColor Gray
    Write-Host "  Option 2: Run mongod manually in another terminal" -ForegroundColor Yellow
    Write-Host "    mongod --dbpath C:\data\db" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit 1
}

Write-Host ""
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    exit 1
}

Write-Host "Dependencies installed" -ForegroundColor Green
Write-Host ""
Write-Host "Starting FastAPI server..." -ForegroundColor Yellow
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "API endpoints at: http://localhost:8000/api" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

uvicorn server:app --host 0.0.0.0 --port 8000 --reload
