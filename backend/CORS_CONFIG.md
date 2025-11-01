# CORS Configuration Guide

## Overview

The backend is now configured to handle CORS (Cross-Origin Resource Sharing) for multiple environments:
- **Development**: Multiple localhost ports (3000, 3001, 3002)
- **Staging**: Configurable via environment variable
- **Production**: Configurable via environment variable

## Default Configuration

By default, the backend allows requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:3002`

## Configuration via Environment Variables

### Option 1: Using .env file (Recommended)

Create a `.env` file in the `backend/` directory:

```env
# Development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3002

# For staging:
# CORS_ORIGINS=https://staging.yourdomain.com

# For production:
# CORS_ORIGINS=https://yourdomain.com
```

### Option 2: Using System Environment Variables

**Windows (PowerShell):**
```powershell
$env:CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

**Windows (CMD):**
```cmd
set CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

**Linux/Mac:**
```bash
export CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

## Deployment Configuration

### Staging Environment

Set the `CORS_ORIGINS` environment variable in your hosting platform:

```env
CORS_ORIGINS=https://staging.yourdomain.com
```

### Production Environment

Set the `CORS_ORIGINS` environment variable:

```env
CORS_ORIGINS=https://yourdomain.com
```

### Multiple Origins (Staging + Production)

You can specify multiple origins separated by commas:

```env
CORS_ORIGINS=https://staging.yourdomain.com,https://yourdomain.com
```

## Platform-Specific Setup

### Vercel (Frontend) + Railway/Render (Backend)

**Backend (.env):**
```env
CORS_ORIGINS=https://your-frontend.vercel.app,https://staging-frontend.vercel.app
```

### Docker

**docker-compose.yml:**
```yaml
services:
  backend:
    environment:
      - CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

### Kubernetes

**deployment.yaml:**
```yaml
env:
  - name: CORS_ORIGINS
    value: "https://yourdomain.com"
```

## Testing CORS Configuration

After restarting the backend, check the logs. You should see:
```
INFO - CORS configured for origins: ['http://localhost:3000', 'http://localhost:3001', ...]
```

## Troubleshooting

### Still Getting CORS Errors?

1. **Restart the backend** after changing CORS settings
2. **Check backend logs** for the CORS configuration message
3. **Verify the origin** matches exactly (including `http://` vs `https://`)
4. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
5. **Check browser console** for the exact origin being blocked

### Common Issues

- **Port mismatch**: Ensure the frontend port matches what's in CORS origins
- **Protocol mismatch**: Use `http://` for localhost, `https://` for production
- **Trailing slash**: Don't include trailing slashes in origins
- **Wildcard**: Don't use `*` for `allow_origins` when `allow_credentials=True`

## Security Notes

- **Never use `allow_origins=["*"]`** with `allow_credentials=True` (security risk)
- Always specify exact origins in production
- Use environment variables for sensitive configuration
- Don't commit `.env` files with production URLs to version control

