# Crescentials Record - Deployment Guide

Complete guide for deploying Crescentials Record to Windows Server 2022 with GitHub CI/CD.

## 📋 Prerequisites

- Windows Server 2022 VPS (4 cores, 6GB RAM, 120GB storage)
- GitHub repository access
- Administrator access to Windows Server
- Domain name (optional but recommended)

## 🚀 Part 1: GitHub Repository Setup

### 1.1 Push Your Code to GitHub

```bash
# In your local project directory
git add .
git commit -m "Add deployment configuration and CI/CD pipeline"
git push origin main
```

### 1.2 Configure GitHub Secrets

1. Go to your GitHub repository: `https://github.com/tsaeeeee/crescentials-record`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VPS_HOST` | `YOUR_SERVER_IP` | Your Windows Server IP address |
| `VPS_USERNAME` | `Administrator` | Windows username (or your custom user) |
| `VPS_PASSWORD` | `YOUR_PASSWORD` | Windows user password |
| `VPS_PORT` | `22` | SSH port (22 for OpenSSH, 3389 for RDP) |

### 1.3 Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Enable workflows if prompted
3. The CI/CD pipeline will trigger on every push to `main` branch

## 🖥️ Part 2: Windows Server 2022 Setup

### 2.1 Initial Server Preparation

Open **PowerShell as Administrator** and run:

```powershell
# Enable Windows features
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform

# Install Chocolatey (Package Manager)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Refresh environment
refreshenv
```

### 2.2 Install Required Software

```powershell
# Install Node.js 18 LTS
choco install nodejs-lts -y

# Install Git
choco install git -y

# Install OpenSSH Server (for GitHub Actions)
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'

# Install process manager
npm install -g pnpm pm2 pm2-windows-service

# Refresh environment
refreshenv
```

### 2.3 Configure SSH Access

```powershell
# Configure SSH for GitHub Actions
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22

# Set PowerShell as default SSH shell
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force
```

### 2.4 Setup PM2 as Windows Service

```powershell
# Install PM2 as Windows service
pm2-service-install -n "Crescentials Record PM2"

# Start the service
Start-Service "Crescentials Record PM2"
Set-Service -Name "Crescentials Record PM2" -StartupType Automatic
```

### 2.5 Create Application Directory

```powershell
# Create application directory
$appPath = "C:\inetpub\wwwroot\crescentials-record"
New-Item -ItemType Directory -Path $appPath -Force

# Set permissions
icacls $appPath /grant "IIS_IUSRS:(OI)(CI)F" /T
icacls $appPath /grant "IUSR:(OI)(CI)F" /T

# Navigate to app directory
cd $appPath
```

### 2.6 Clone Repository

```powershell
# Clone your repository
git clone https://github.com/tsaeeeee/crescentials-record.git .

# Verify files are present
dir

# Make scripts executable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2.7 Initial Deployment

```powershell
# Run initial deployment
.\deploy.ps1

# Save PM2 configuration
pm2 save
```

### 2.8 Configure Firewall

```powershell
# Open application port
New-NetFirewallRule -DisplayName "Crescentials Record App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

# Optional: Open HTTP/HTTPS for reverse proxy
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

## 🌐 Part 3: Domain and SSL Setup (Optional)

### 3.1 Install IIS for Reverse Proxy

```powershell
# Install IIS
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpErrors, IIS-HttpLogging, IIS-RequestFiltering, IIS-StaticContent, IIS-DefaultDocument

# Install URL Rewrite module
choco install urlrewrite -y

# Install Application Request Routing
choco install iis-arr -y
```

### 3.2 Configure IIS Reverse Proxy

1. Open **IIS Manager**
2. Create new website:
   - **Site name**: `crescentials-record`
   - **Physical path**: `C:\inetpub\wwwroot\crescentials-record`
   - **Binding**: HTTP, Port 80, Host name: `your-domain.com`

3. Add URL Rewrite rules:
   - Go to your site → **URL Rewrite** → **Add Rules** → **Reverse Proxy**
   - **Inbound rule**: `(.*)`
   - **Rewrite URL**: `http://localhost:3000/{R:1}`

### 3.3 SSL Certificate Setup

```powershell
# Install Certbot for Let's Encrypt
choco install certbot -y

# Get SSL certificate (replace with your domain)
certbot certonly --webroot -w C:\inetpub\wwwroot\crescentials-record -d your-domain.com -d www.your-domain.com

# Add HTTPS binding in IIS Manager manually
```

## 🔄 Part 4: CI/CD Pipeline Usage

### 4.1 Automatic Deployment

Every time you push to the `main` branch:

1. GitHub Actions will automatically:
   - Build the application
   - Connect to your Windows Server
   - Pull latest changes
   - Install dependencies
   - Build the project
   - Restart the application

### 4.2 Manual Deployment

On your Windows Server:

```powershell
# Navigate to app directory
cd C:\inetpub\wwwroot\crescentials-record

# Run deployment script
.\deploy.ps1

# Or use the batch file
.\deploy.bat
```

### 4.3 Monitoring Commands

```powershell
# Check application status
pm2 status

# View logs
pm2 logs crescentials-record

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart crescentials-record

# Stop application
pm2 stop crescentials-record
```

## 🔧 Part 5: Troubleshooting

### 5.1 Common Issues

**GitHub Actions SSH Connection Failed:**
```powershell
# Check SSH service
Get-Service sshd
Start-Service sshd

# Check firewall
Get-NetFirewallRule -DisplayName "*SSH*"
```

**PM2 Service Not Starting:**
```powershell
# Reinstall PM2 service
pm2-service-uninstall
pm2-service-install -n "Crescentials Record PM2"
```

**Build Failures:**
```powershell
# Clear npm/pnpm cache
pnpm store prune
npm cache clean --force

# Reinstall dependencies
Remove-Item node_modules -Recurse -Force
pnpm install
```

### 5.2 Log Locations

- **Application logs**: `C:\inetpub\wwwroot\crescentials-record\logs\`
- **PM2 logs**: `%USERPROFILE%\.pm2\logs\`
- **IIS logs**: `C:\inetpub\logs\LogFiles\`
- **Windows Event Logs**: Event Viewer → Windows Logs → Application

### 5.3 Performance Monitoring

```powershell
# Check system resources
Get-Process node
Get-Counter "\Processor(_Total)\% Processor Time"
Get-Counter "\Memory\Available MBytes"

# PM2 monitoring
pm2 monit
```

## 🔒 Part 6: Security Best Practices

### 6.1 Windows Server Security

```powershell
# Update Windows
Install-Module PSWindowsUpdate
Get-WUInstall -AcceptAll -AutoReboot

# Configure Windows Defender
Set-MpPreference -DisableRealtimeMonitoring $false
Update-MpSignature
```

### 6.2 Application Security

- Keep Node.js and dependencies updated
- Use HTTPS in production
- Configure proper firewall rules
- Regular security updates via Windows Update
- Monitor logs for suspicious activity

## 📊 Part 7: Performance Optimization

### 7.1 PM2 Configuration

The `ecosystem.config.js` is optimized for your 4-core/6GB setup:
- 3 instances (leaving 1 core for system)
- 512MB memory limit per instance
- Auto-restart on crashes

### 7.2 Windows Server Optimization

```powershell
# Optimize for applications
bcdedit /set useplatformclock true
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

# Disable unnecessary services
Stop-Service -Name "Themes" -Force
Set-Service -Name "Themes" -StartupType Disabled
```

## 🎉 Part 8: Verification

### 8.1 Test Your Deployment

1. **Local access**: http://localhost:3000
2. **External access**: http://YOUR_SERVER_IP:3000
3. **Domain access**: http://your-domain.com (if configured)

### 8.2 Health Checks

```powershell
# Test application response
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing

# Check PM2 status
pm2 status

# View recent logs
pm2 logs crescentials-record --lines 20
```

## 📞 Support

If you encounter issues:

1. Check the logs first
2. Verify all services are running
3. Test network connectivity
4. Review GitHub Actions workflow logs
5. Check Windows Event Viewer

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

```powershell
# Weekly: Update dependencies
pnpm update

# Monthly: Update Node.js
choco upgrade nodejs-lts

# Quarterly: Update Windows
Get-WUInstall -AcceptAll -AutoReboot
```

---

**🎊 Congratulations!** Your Crescentials Record application is now deployed with full CI/CD automation on Windows Server 2022!