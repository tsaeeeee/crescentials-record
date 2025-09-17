# PowerShell Deployment Script for Windows Server 2022
# Usage: .\deploy.ps1

param(
    [switch]$SkipBuild = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Crescentials Record deployment..." -ForegroundColor Green

try {
    # Check if we're in the right directory
    if (!(Test-Path "package.json")) {
        throw "package.json not found. Please run this script from the project root directory."
    }

    # Pull latest changes
    Write-Host "📥 Pulling latest changes from GitHub..." -ForegroundColor Yellow
    git pull origin main
    if ($LASTEXITCODE -ne 0) { throw "Git pull failed" }

    # Install dependencies
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) { throw "pnpm install failed" }

    # Build application (skip if requested)
    if (!$SkipBuild) {
        Write-Host "🔨 Building application..." -ForegroundColor Yellow
        pnpm run build
        if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    }

    # Create logs directory if it doesn't exist
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" | Out-Null
        Write-Host "📁 Created logs directory" -ForegroundColor Blue
    }

    # Restart PM2 application
    Write-Host "🔄 Restarting application..." -ForegroundColor Yellow
    $pm2Status = pm2 restart crescentials-record 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ PM2 restart failed, trying to start fresh..." -ForegroundColor Yellow
        pm2 start ecosystem.config.js --name crescentials-record --env production
        if ($LASTEXITCODE -ne 0) { throw "PM2 start failed" }
    }

    # Show status
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host ""
    pm2 status
    Write-Host ""
    pm2 logs crescentials-record --lines 10

    Write-Host ""
    Write-Host "🎉 Crescentials Record deployed successfully!" -ForegroundColor Green
    Write-Host "🌐 Application should be running on http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📊 Monitor with: pm2 monit" -ForegroundColor Blue

} catch {
    Write-Host "❌ Deployment failed: $_" -ForegroundColor Red
    exit 1
}