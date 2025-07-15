# Quick Deployment Guide

## For succylongtimegames.space

### Option 1: As a Separate Page (/succinct-viz/)

1. **Build the project locally:**
   ```bash
   cd C:\Users\vladi\source\repos\succinct_tesseract
   npm install
   npm run build
   ```

2. **Upload to your server:**
   - Upload the `dist/` folder contents to `/var/www/succylongtimegames.space/succinct-viz/`

3. **Update your nginx config:**
   ```nginx
   location /succinct-viz/ {
       alias /var/www/succylongtimegames.space/succinct-viz/;
       try_files $uri $uri/ /succinct-viz/index.html;
   }
   ```

4. **For the backend scraper:**
   - Upload `backend/` folder to your server
   - Install dependencies: `cd backend && npm install`
   - Run with PM2: `pm2 start scraper.js --name succinct-scraper`
   - Add nginx proxy:
     ```nginx
     location /api/explorer/ {
         proxy_pass http://localhost:3002/api/explorer/;
     }
     ```

### Option 2: Integrate with Existing SP1 API

Since you mentioned you already have an API server for Succinct SP1 proofs, you could:

1. Add the scraper functionality to your existing API
2. Update `src/config.js` to point to your existing API endpoint
3. Deploy only the frontend files

### Git Repository

1. **Initialize git:**
   ```bash
   cd C:\Users\vladi\source\repos\succinct_tesseract
   git init
   git add .
   git commit -m "Initial commit: Succinct Tesseract visualization"
   ```

2. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/NoCritics/succinct-tesseract.git
   git branch -M main
   git push -u origin main
   ```

### Live Demo URL

Once deployed, your visualization will be available at:
- `https://succylongtimegames.space/succinct-viz/`

### Testing Locally First

Before deploying, test the production build locally:
```bash
npm run build
npm run preview
```

This will serve the production build on http://localhost:8080