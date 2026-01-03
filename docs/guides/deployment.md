# Deployment Guide

[← Back to Documentation Home](../README.md)

How to ship the app to production.

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

The build creates optimized static files in `dist/` with minified and tree-shaken code, along with source maps for debugging production issues.

### Build Configuration

Build settings are configured in [vite.config.ts](../vite.config.ts):

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

## How to Deploy

You've got three main options: Docker (recommended), static hosting services like Netlify or Vercel, or traditional web servers.

### Option 1: Docker (Recommended)

The application includes Docker configuration for containerized deployment.

**Files you'll work with**:
- [Dockerfile](../../Dockerfile) defines the container image
- [docker-compose.yml](../../docker-compose.yml) orchestrates multiple services
- [nginx.conf](../../nginx.conf) configures the web server

See [Docker Deployment](../../DOCKER_DEPLOYMENT.md) for the full walkthrough.

#### Build Docker Image

```bash
# Build image
docker build -t techconnect-web:latest .

# Run container
docker run -p 8080:80 techconnect-web:latest
```

#### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

### Option 2: Static Hosting

Deploy the `dist/` folder to any static hosting service.

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### AWS S3 + CloudFront

```bash
# Build application
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

**Note**: Update `base` in `vite.config.ts` for GitHub Pages:
```typescript
export default defineConfig({
  base: '/repository-name/',
});
```

### Option 3: Traditional Web Server

Deploy to Apache, Nginx, or any web server:

1. Build the application: `npm run build`
2. Copy `dist/` contents to web server directory
3. Configure server for SPA routing

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/techconnect/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache Configuration** (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Environment Variables

Configure environment-specific variables for different deployments.

See [Environment Configuration](./environment.md) for details.

### Production Environment

```env
VITE_API_GATEWAY_URL=https://api.techconnect.com
VITE_APP_ENV=production
```

### Staging Environment

```env
VITE_API_GATEWAY_URL=https://staging-api.techconnect.com
VITE_APP_ENV=staging
```

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables configured
- [ ] API endpoints point to production
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (e.g., Google Analytics)
- [ ] Security headers configured
- [ ] SSL certificate configured
- [ ] Performance tested
- [ ] Accessibility tested
- [ ] Browser compatibility tested

## Performance Optimization

### Code Splitting

Vite automatically code-splits for optimal loading:

```typescript
// Lazy load routes
const Admin = lazy(() => import('./pages/Admin'));
const OpportunityDetail = lazy(() => import('./pages/OpportunityDetail'));
```

### Asset Optimization

- **Images**: Use WebP format with fallbacks
- **Fonts**: Preload critical fonts
- **JavaScript**: Tree-shaking removes unused code
- **CSS**: Purges unused Tailwind classes

### Caching Strategy

Configure cache headers:

```nginx
# Static assets - long cache
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML - no cache
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Monitoring and Logging

### Error Tracking

Integrate error tracking (e.g., Sentry):

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.VITE_APP_ENV,
});
```

### Analytics

Add analytics tracking:

```typescript
// Google Analytics
import ReactGA from 'react-ga4';

ReactGA.initialize('GA_MEASUREMENT_ID');
ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
```

### Performance Monitoring

Monitor Web Vitals:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Security

### Security Headers

Configure security headers in web server:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### HTTPS

Always use HTTPS in production:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # ... rest of configuration
}
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_API_GATEWAY_URL: ${{ secrets.API_GATEWAY_URL }}
      
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://your-bucket
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Rollback Strategy

### Version Tagging

Tag releases for easy rollback:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Docker Rollback

```bash
# List previous images
docker images techconnect-web

# Run previous version
docker run -p 8080:80 techconnect-web:v1.0.0
```

## Health Checks

Implement health check endpoint:

```typescript
// Add to public/health.json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

Monitor:
```bash
curl https://yourdomain.com/health.json
```

## Related Docs

[Docker Deployment Details](../../DOCKER_DEPLOYMENT.md) • [Environment Config](../reference/environment.md) • [Architecture](../reference/architecture.md) • [Troubleshooting](./troubleshooting.md)
