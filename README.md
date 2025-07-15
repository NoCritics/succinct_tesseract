# Succinct Tesseract Visualization

An interactive 3D visualization featuring a morphing 4D hypercube (tesseract) that transforms into "SUCCINCT" 3D text, displaying real-time zero-knowledge proof data from the Succinct Network.

![Succinct Tesseract](https://img.shields.io/badge/Three.js-r128-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **4D Hypercube (Tesseract)**: Mathematical 4D rotation projected into 3D space
- **3D Text Morphing**: Smooth transition between tesseract and "SUCCINCT" text
- **Live Proof Display**: Real-time ZK proof data from Succinct Explorer
- **Interactive Controls**: 
  - Drag to rotate
  - Scroll to zoom
  - Space/Button to morph
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
succinct_tesseract/
├── index.html          # Main HTML file
├── package.json        # Frontend dependencies
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.js         # Main application logic
│   ├── hypercube.js    # Tesseract implementation
│   ├── succinct3DText.js # 3D text creation
│   ├── proofDisplay.js # Proof data display
│   └── config.js       # Configuration
└── backend/
    ├── scraper.js      # Proof data scraper
    └── package.json    # Backend dependencies
```

## Installation

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Setup (Optional for live data)

```bash
cd backend
npm install
npm start
```

## Configuration

### API Endpoints

Update `src/config.js` for your production environment:

```javascript
proxyURL: process.env.NODE_ENV === 'production' 
    ? '/api/explorer/latest-proof'  // Your production endpoint
    : 'http://localhost:3002/api/explorer/latest-proof'
```

### CORS Settings

Update `backend/scraper.js` allowed origins:

```javascript
const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];
```

## Deployment

### Frontend Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your web server

3. Configure your web server to serve the static files

### Backend Deployment

1. Deploy the backend folder to your server
2. Install dependencies: `npm install`
3. Run with a process manager like PM2:
   ```bash
   pm2 start scraper.js --name succinct-scraper
   ```

### Nginx Configuration Example

```nginx
# Frontend
location /succinct-viz/ {
    alias /var/www/succinct_tesseract/dist/;
    try_files $uri $uri/ /succinct-viz/index.html;
}

# Backend API proxy
location /api/explorer/ {
    proxy_pass http://localhost:3002/api/explorer/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Technologies Used

- **Three.js**: 3D graphics library
- **Vite**: Build tool and dev server
- **Express**: Backend API server
- **Puppeteer**: Web scraping for proof data

## Performance Optimization

- Efficient buffer geometry updates for tesseract animation
- Optimized material usage with proper transparency
- Lazy loading and code splitting via Vite
- 30-second cache for proof data to reduce API calls

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebGL support

## License

MIT License - feel free to use this in your projects!

## Acknowledgments

- Succinct Labs for the inspiration and proof data
- Three.js community for excellent documentation
- The mathematics of 4D rotation and projection