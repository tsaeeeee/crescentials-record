# Windows Service Setup for Crescentials Record
# Run as Administrator

Write-Host "🔧 Setting up Crescentials Record as Windows Service..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator" -ForegroundColor Red
    exit 1
}

# Install required tools
Write-Host "📦 Installing required tools..." -ForegroundColor Yellow

# Install Chocolatey if not installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install Node.js, pnpm, and PM2
choco install nodejs -y
npm install -g pnpm pm2 pm2-windows-service

# Setup PM2 as Windows service
pm2-service-install -n "Crescentials Record PM2"

Write-Host "✅ PM2 Windows service installed!" -ForegroundColor Green

# Create application directory
$appPath = "C:\inetpub\wwwroot\crescentials-record"
if (!(Test-Path $appPath)) {
    New-Item -ItemType Directory -Path $appPath -Force
    Write-Host "📁 Created application directory: $appPath" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Clone your repository to: $appPath" -ForegroundColor White
Write-Host "2. Run: cd $appPath" -ForegroundColor White
Write-Host "3. Run: git clone https://github.com/tsaeeeee/crescentials-record.git ." -ForegroundColor White
Write-Host "4. Run: .\deploy.ps1" -ForegroundColor White
Write-Host "5. Run: pm2 save" -ForegroundColor White