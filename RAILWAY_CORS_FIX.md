# 🚂 Railway CORS Fix - Quick Guide

## 🔴 Current Problem

Your deployed site at `lotus-repo.vercel.app` cannot connect to your backend API at `lotusrepo-production-0265.up.railway.app` due to CORS blocking.

## ✅ Quick Fix (2 Steps)

### Step 1: Update Railway Environment Variables

**In Railway Dashboard:**

1. Go to your Railway project: `lotus-repo`
2. Click on your backend service (probably named "backend" or similar)
3. Go to **Variables** tab
4. Add these variables:

```bash
NODE_ENV=production
FRONTEND_URL=https://lotus-repo.vercel.app

# Add allowed origins (comma-separated, NO spaces)
ALLOWED_ORIGINS=https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000
```

### Step 2: Push Updated Code

The code has been updated with better CORS handling. Push it:

```bash
git add BACKEND/src/server.js FIX_CORS_ERRORS.md RAILWAY_CORS_FIX.md
git commit -m "fix: Improve CORS configuration for Railway deployment"
git push origin main
```

Railway will **auto-redeploy** (2-3 minutes).

## 🧪 Test After Deployment

### 1. Check if Backend is Running
Visit: https://lotusrepo-production-0265.up.railway.app/health

Should return:
```json
{"status":"healthy","timestamp":"...","uptime":123,"environment":"production"}
```

### 2. Check CORS Headers
Run in terminal:
```bash
curl -I -X OPTIONS https://lotusrepo-production-0265.up.railway.app/api/chat/sessions -H "Origin: https://lotus-repo.vercel.app"
```

You should see:
```
Access-Control-Allow-Origin: https://lotus-repo.vercel.app
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
```

### 3. Test Frontend
Refresh your Vercel site and check the console - errors should be gone!

## 🔍 If Still Not Working

### Check Railway Logs
1. Railway Dashboard → Your Backend Service
2. Click **Logs** tab
3. Look for errors or CORS logs

### Verify Service Settings
Railway Dashboard → Backend Service → **Settings**:

- **Root Directory**: `BACKEND` (if applicable)
- **Start Command**: Should be `npm start` or `node src/server.js`
- **Healthcheck Path**: `/health`

### Force Redeploy
In Railway Dashboard:
1. Click the 3 dots (...) next to your service
2. Select **Restart**
3. Wait 1-2 minutes

## 📊 Railway Configuration

If you need to configure Railway settings, check:

**File: `railway.json`** (in project root):
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

## 🎯 Quick Checklist

Before checking if it works:
- [ ] Environment variables added to Railway
- [ ] Code pushed to GitHub
- [ ] Railway auto-deployed (check deployment status)
- [ ] Backend service is "Running" (green status)
- [ ] No errors in Railway logs
- [ ] Health endpoint responds (test above)

After waiting 2-3 minutes:
- [ ] Test the frontend at https://lotus-repo.vercel.app
- [ ] Open browser console (F12)
- [ ] Check if CORS errors are gone
- [ ] Try using the chat widget

## 🆘 Still Having Issues?

### Option 1: Temporarily Disable CORS (NOT recommended for production)
In `BACKEND/src/server.js`, change to:
```javascript
app.use(cors({
  origin: '*', // Allow everything temporarily
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));
```

### Option 2: Use a Proxy
Add a proxy in Vercel to forward requests to Railway.

**Create `vercel.json`:**
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://lotusrepo-production-0265.up.railway.app/api/:path*"
    }
  ]
}
```

Then update your frontend API URL to just `/api` instead of the full Railway URL.

---

**Expected Time to Fix**: 3-5 minutes  
**Success Indicator**: No CORS errors in browser console
