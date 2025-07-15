#!/bin/bash

# Deployment script for Succinct Tesseract

echo "🚀 Building Succinct Tesseract for production..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p deploy
cp -r dist/* deploy/

# Copy backend files
echo "🔧 Copying backend files..."
mkdir -p deploy/backend
cp backend/scraper.js deploy/backend/
cp backend/package.json deploy/backend/

# Create deployment info
echo "📝 Creating deployment info..."
cat > deploy/DEPLOY_INFO.txt << EOF
Succinct Tesseract Deployment
=============================
Built on: $(date)
Node version: $(node -v)
NPM version: $(npm -v)

Frontend files: deploy/
Backend files: deploy/backend/

To deploy:
1. Upload the contents of deploy/ to your server
2. Set up nginx to serve frontend files
3. Run backend with PM2: pm2 start backend/scraper.js
4. Configure nginx to proxy /api/explorer to backend port
EOF

echo "✅ Build complete! Files ready in deploy/ directory"
echo ""
echo "Next steps:"
echo "1. Review deploy/DEPLOY_INFO.txt"
echo "2. Upload deploy/ contents to your server"
echo "3. Configure nginx as per README.md"
echo "4. Start backend service with PM2"