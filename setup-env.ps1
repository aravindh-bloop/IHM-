# IHM Project - Quick Setup Script
# This script helps you set up the environment variables quickly

Write-Host "=== IHM Project Environment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
$envPath = ".env"
$envExamplePath = ".env.example"

if (Test-Path $envPath) {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to regenerate it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Keeping existing .env file" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Setting up backend environment..." -ForegroundColor Cyan

# Generate secret key
Write-Host "Generating secure secret key..." -ForegroundColor Yellow
$secret = python -c "import secrets; print(secrets.token_urlsafe(32))"

if (-not $secret) {
    Write-Host "✗ Failed to generate secret key. Make sure Python is installed." -ForegroundColor Red
    $secret = "CHANGE-THIS-SECRET-KEY-" + (Get-Random -Minimum 10000 -Maximum 99999)
    Write-Host "Using fallback secret (INSECURE): $secret" -ForegroundColor Yellow
}

# Get super user credentials
Write-Host ""
Write-Host "Configure Super User (Admin Account):" -ForegroundColor Cyan
$superUser = Read-Host "Super user email (default: admin)"
if ([string]::IsNullOrWhiteSpace($superUser)) {
    $superUser = "admin"
}

$superPass = Read-Host "Super user password (default: admin123)"
if ([string]::IsNullOrWhiteSpace($superPass)) {
    $superPass = "admin123"
}

# Database settings
Write-Host ""
Write-Host "Database Configuration:" -ForegroundColor Cyan
$dbHost = Read-Host "Database host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
    $dbHost = "localhost"
}

$dbName = Read-Host "Database name (default: ihm_backend)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "ihm_backend"
}

# Create .env file
Write-Host ""
Write-Host "Creating .env file..." -ForegroundColor Yellow

$envContent = @"
# ==================== AUTHENTICATION ====================
# Secret key for JWT token generation
USERS_SECRET=$secret

# ==================== SUPER USER (Admin Account) ====================
# Default super user credentials created at startup
SUPER_USER=$superUser
SUPER_USER_PASS=$superPass

# ==================== DATABASE CONFIGURATION ====================
# PostgreSQL database settings
IHM_BACKEND_DB_HOST=$dbHost
IHM_BACKEND_DB_PORT=5432
IHM_BACKEND_DB_USER=ihm_backend
IHM_BACKEND_DB_PASS=ihm_backend
IHM_BACKEND_DB_BASE=$dbName

# ==================== REDIS CONFIGURATION ====================
# Redis settings for caching and sessions
IHM_BACKEND_REDIS_HOST=localhost
IHM_BACKEND_REDIS_PORT=6379

# ==================== SERVER CONFIGURATION ====================
# Backend server settings
IHM_BACKEND_HOST=0.0.0.0
IHM_BACKEND_PORT=8000
IHM_BACKEND_RELOAD=True
IHM_BACKEND_LOG_LEVEL=INFO
IHM_BACKEND_WORKERS_COUNT=1
IHM_BACKEND_ENVIRONMENT=dev
"@

Set-Content -Path $envPath -Value $envContent

Write-Host "✓ Backend .env file created successfully!" -ForegroundColor Green

# Setup frontend .env
Write-Host ""
Write-Host "Setting up frontend environment..." -ForegroundColor Cyan

$frontendEnvPath = "ihm_frontend\.env"
$frontendEnvExamplePath = "ihm_frontend\.env.example"

if (Test-Path $frontendEnvPath) {
    Write-Host "✓ Frontend .env file already exists" -ForegroundColor Green
} else {
    if (Test-Path $frontendEnvExamplePath) {
        Copy-Item $frontendEnvExamplePath $frontendEnvPath
        Write-Host "✓ Frontend .env file created from example" -ForegroundColor Green
    } else {
        $frontendEnvContent = @"
# ==================== API CONFIGURATION ====================
# API endpoint for frontend to call backend
VITE_API_URL=/api

# Backend service URL (used by Vite proxy in development)
VITE_BACKEND_URL=http://localhost:8001
"@
        Set-Content -Path $frontendEnvPath -Value $frontendEnvContent
        Write-Host "✓ Frontend .env file created" -ForegroundColor Green
    }
}

# Summary
Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure PostgreSQL and Redis are running"
Write-Host "2. Run migrations: poetry run alembic upgrade head"
Write-Host "3. Start backend: poetry run python -m ihm_backend"
Write-Host "4. Start frontend: cd ihm_frontend && npm run dev"
Write-Host ""
Write-Host "Super user credentials:" -ForegroundColor Yellow
Write-Host "  Email: $superUser"
Write-Host "  Password: $superPass"
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend API: http://localhost:8000"
Write-Host "  API Docs: http://localhost:8000/api/docs"
Write-Host ""
