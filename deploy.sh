#!/bin/bash

# Deployment script for Linux/Unix systems
# For Windows Server 2022, use deploy.bat instead
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build application
echo "🔨 Building application..."
pnpm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart PM2 application
echo "🔄 Restarting application..."
pm2 restart crescentials-record || pm2 start ecosystem.config.js --name crescentials-record --env production

# Show status
echo "✅ Deployment complete!"
pm2 status
pm2 logs crescentials-record --lines 10

echo ""
echo "🎉 Crescentials Record deployed successfully!"
echo "🌐 Application should be running on http://localhost:3000"