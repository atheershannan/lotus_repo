# 🔧 Fix CORS Errors - Backend API

## 🔴 Problem
The frontend (Vercel) cannot communicate with the backend API (Railway) due to CORS policy blocking.

**Error in console:**
```
Access to XMLHttpRequest at 'https://lotusrepo-production-0265.up.railway.app/api/...' 
from origin 'https://lotus-repo.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solution

### Step 1: Update Railway Environment Variables

Go to your **Railway project** → **Variables** and add/update:

```bash
# Add these environment variables
FRONTEND_URL=https://lotus-repo.vercel.app
NODE_ENV=production
PORT=3001

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000
```

### Step 2: Update BACKEND/src/server.js

The CORS is already configured to allow all origins (`origin: '*'`), but let's make it more explicit:

**Current code (lines 61-67):**
```javascript
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

**This should already work!** The issue is that Railway might not be running the latest code.

### Step 3: Verify Railway Deployment

1. Go to Railway Dashboard
2. Check if the backend service is running
3. Look at the logs to see if there are any errors
4. Check if the service is listening on the correct port (should be `3001` or Railway's assigned port)

### Step 4: Test CORS Manually

Run this command to test if CORS headers are present:

```bash
curl -I -X OPTIONS https://lotusrepo-production-0265.up.railway.app/api/chat/sessions \
  -H "Origin: https://lotus-repo.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

You should see:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### Step 5: Check Railway Config

Make sure Railway is using the correct startup command:

**railway.json** (should exist in project root):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "BACKEND/Dockerfile"
  },
  "deploy": {
    "startCommand": "cd BACKEND && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Or if you're using Railway's auto-detection, make sure:**
- Root Directory: `BACKEND`
- Start Command: `npm start`
- Build Command: `npm install`

## 🐛 Alternative Solution: Hardcode CORS Origins

If the above doesn't work, try explicitly listing origins:

**Update BACKEND/src/server.js:**

```javascript
// CORS configuration - HARDCODED ORIGINS
app.use(cors({
  origin: [
    'https://lotus-repo.vercel.app',
    'https://lotus-repo-git-main-atheershannan.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-api-key'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
```

## 🚀 Redeploy to Railway

After making changes:

1. Push to GitHub:
```bash
git add BACKEND/src/server.js
git commit -m "fix: Update CORS configuration"
git push origin main
```

2. Railway will auto-deploy (if connected to GitHub)

3. Wait 2-3 minutes for deployment to complete

4. Check logs in Railway dashboard

5. Test the frontend again

## 📝 Additional Checks

### Check if Backend is Running
```bash
curl https://lotusrepo-production-0265.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 123,
  "environment": "production"
}
```

### Test Chat Sessions Endpoint
```bash
curl https://lotusrepo-production-0265.up.railway.app/api/chat/sessions
```

### Check Backend Logs
In Railway Dashboard → Your Backend Service → Logs

Look for:
- ✅ "Backend running on port..."
- ✅ "CORS configured"
- ❌ Any errors

## 🎯 Quick Fix Checklist

- [ ] Backend service is running in Railway
- [ ] CORS middleware is configured in server.js
- [ ] No errors in Railway logs
- [ ] Health endpoint responds
- [ ] OPTIONS request returns CORS headers
- [ ] Frontend is using correct API URL

## 🔗 Resources

- [Railway CORS Documentation](https://docs.railway.app/troubleshooting/cors)
- [Express CORS Package](https://www.npmjs.com/package/cors)

---

**Status**: Ready to deploy  
**Priority**: High  
**Impact**: Blocks all frontend-backend communication
