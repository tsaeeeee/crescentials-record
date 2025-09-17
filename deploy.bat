@echo off
REM Deployment script for Windows Server 2022
REM Usage: deploy.bat

echo 🚀 Starting deployment...

REM Pull latest changes
echo 📥 Pulling latest changes from GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo ❌ Git pull failed
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ pnpm install failed
    exit /b 1
)

REM Build application
echo 🔨 Building application...
call pnpm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Restart PM2 application
echo 🔄 Restarting application...
pm2 restart crescentials-record
if %errorlevel% neq 0 (
    echo ⚠️ PM2 restart failed, trying to start...
    pm2 start ecosystem.config.js --name crescentials-record --env production
)

REM Show status
echo ✅ Deployment complete!
pm2 status
pm2 logs crescentials-record --lines 10

echo.
echo 🎉 Crescentials Record deployed successfully!
echo 🌐 Application should be running on http://localhost:3000