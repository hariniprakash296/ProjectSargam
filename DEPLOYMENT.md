# Deployment Guide

## Overview

This guide covers deployment procedures for the Sargam application to various environments (development, staging, production).

## Prerequisites

- Node.js 18+ installed
- Python 3.12+ installed
- Git installed
- Access to deployment platform (Vercel, Railway, Render, etc.)

## Environment Setup

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Development
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # Production
```

**Backend (.env):**
```env
# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002

# Server Configuration
HOST=0.0.0.0
PORT=8000

# File Upload Settings
MAX_UPLOAD_SIZE=52428800  # 50MB
UPLOAD_DIR=uploads

# Audio Processing
TARGET_SAMPLE_RATE=44100
MAX_DURATION=300  # 5 minutes

# Default Sruti
DEFAULT_SRUTI=131.0
```

**Production (.env):**
```env
CORS_ORIGINS=https://yourdomain.com,https://staging.yourdomain.com
PORT=8000
```

## Local Development Deployment

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000` (or next available port)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create uploads directory
mkdir uploads

# Start server
python main.py
```

Backend runs on `http://localhost:8000`

## Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

#### Backend Deployment (Railway)

1. **Create Railway Account:**
   - Go to railway.app
   - Connect GitHub repository

2. **Create New Project:**
   - Select repository
   - Railway detects Python project

3. **Configure Environment Variables:**
   - Add `CORS_ORIGINS=https://yourdomain.com`
   - Add other required variables

4. **Set Start Command:**
   ```bash
   cd backend && python main.py
   ```

5. **Deploy:**
   - Railway auto-deploys on git push
   - Get backend URL from Railway dashboard

### Option 2: Docker Deployment

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Backend Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Run application
CMD ["python", "main.py"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - CORS_ORIGINS=http://localhost:3000
      - PORT=8000
    volumes:
      - ./backend/uploads:/app/uploads
```

**Deploy:**
```bash
docker-compose up -d
```

### Option 3: Render Deployment

#### Frontend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variable: `NEXT_PUBLIC_API_URL`

#### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python main.py`
6. Add environment variables

## CI/CD Pipeline (GitHub Actions)

### Frontend CI/CD

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Backend CI/CD

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      - run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest
          pytest tests/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@master
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

## Pre-Deployment Checklist

### Frontend
- [ ] All environment variables set
- [ ] Build succeeds (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] No console errors
- [ ] CORS configured correctly
- [ ] API URL points to correct backend

### Backend
- [ ] All environment variables set
- [ ] CORS origins configured
- [ ] Dependencies installed
- [ ] Health check endpoint works
- [ ] File upload directory exists
- [ ] Logging configured
- [ ] Error handling tested

## Post-Deployment Verification

1. **Health Check:**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

2. **Frontend Loads:**
   - Visit frontend URL
   - Check browser console for errors

3. **API Connection:**
   - Upload test file
   - Verify transcription works

4. **Error Monitoring:**
   - Check logs for errors
   - Monitor error rates

## Rollback Procedure

### Vercel Rollback
```bash
vercel rollback [deployment-url]
```

### Railway Rollback
- Go to Railway dashboard
- Select deployment
- Click "Redeploy" previous version

### Docker Rollback
```bash
docker-compose down
docker-compose up -d --scale backend=1
```

## Monitoring

### Recommended Tools

**Application Monitoring:**
- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (metrics)

**Infrastructure Monitoring:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Server monitoring (New Relic, Datadog)

### Key Metrics

- API response time
- Error rate
- Request rate
- File processing time
- Memory usage
- CPU usage

## Scaling

### Horizontal Scaling

**Frontend:**
- Vercel automatically scales
- CDN handles traffic

**Backend:**
- Use load balancer (Nginx, Traefik)
- Multiple backend instances
- Shared file storage (S3)

### Vertical Scaling

- Increase server resources
- Optimize code performance
- Use caching (Redis)

## Troubleshooting Deployment

### Common Issues

**Build Failures:**
- Check Node.js/Python versions
- Verify all dependencies in package.json/requirements.txt
- Check build logs

**Environment Variables:**
- Verify all variables set
- Check variable names (case-sensitive)
- Ensure no typos

**CORS Errors:**
- Verify CORS_ORIGINS includes frontend URL
- Check protocol (http vs https)
- Restart backend after changes

**Port Issues:**
- Check port availability
- Verify PORT environment variable
- Check firewall settings

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS origins restricted
- [ ] File size limits enforced
- [ ] Error messages sanitized
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] Secrets not in code

## Backup & Recovery

### Backup Strategy

**Code:**
- Git repository (GitHub/GitLab)

**Data:**
- User uploads: Temporary (no backup needed)
- Database: Regular backups (when implemented)

**Configuration:**
- Environment variables stored securely
- Infrastructure as code (Terraform, etc.)

### Recovery Procedure

1. Identify issue
2. Rollback to previous version
3. Investigate root cause
4. Fix issue
5. Deploy fix
6. Monitor for stability

---

**Last Updated:** 2025-11-01  
**Version:** 1.0.0

