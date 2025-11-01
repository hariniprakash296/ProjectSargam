# Run Backend Server
# Quick start script for Windows

Write-Host "Starting Sargam Backend Server..." -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Python not found. Please install Python 3.9+ and add it to PATH." -ForegroundColor Red
    exit 1
}

# Run the server
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Yellow
Write-Host "API Docs will be available at http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

python main.py

