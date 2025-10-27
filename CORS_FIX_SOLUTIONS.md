# CORS Error Fix - 3 Solutions

## Problem Analysis

Your error shows:
```
Access to fetch at 'https://lotusrepo-production.up.railway.app/api/api/chat' 
from origin 'https://lotus-repo.vercel.app' has been blocked by CORS policy
```

**Issues identified:**
1. Double `/api/api/chat` in URL (should be `/api/chat`)
2. CORS preflight requests not properly handled
3. Environment variables not configured on Railway

---

## Solution 1: Fix Double `/api` Issue (IMPLEMENTED ✅)

### Problem
The API URL is being constructed with a double `/api` path because:
- `REACT_APP_API_URL` might include `/api` at the end
- Frontend code then appends `/api/chat`

### Fix Applied
Updated `FRONTEND/src/components/chat/CollapsibleChatWidget.jsx` to automatically remove `/api` suffix:

```javascript
// Remove /api suffix if present to avoid double /api/api
if (baseUrl.endsWith('/api')) {
  baseUrl = baseUrl.slice(0, -4);
}
```

### How to Apply
1. Set your Vercel environment variable:
   - `REACT_APP_API_URL=https://lotusrepo-production.up.railway.app` (without `/api` at the end)
2. Redeploy your frontend on Vercel

---

## Solution 2: Enhanced CORS Configuration (IMPLEMENTED ✅)

### Problem
The backend wasn't properly handling OPTIONS preflight requests that browsers send before making CORS requests.

### Fix Applied
Updated `BACKEND/src/server.js` with enhanced CORS configuration:

```javascript
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('⚠️ Blocked CORS request from:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-api-key', 'X-Custom-Header'],
  exposedHeaders: ['Content-Length', 'Content-Type', 'X-Total-Count'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Explicitly handle OPTIONS requests for all routes
app.options('*', cors());
```

### How to Apply
1. Deploy the updated backend to Railway
2. Add environment variables to Railway:
   - Navigate to your Railway project
   - Go to Variables tab
   - Add: `ALLOWED_ORIGINS=https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000`

---

## Solution 3: Railway-Specific CORS Fix

### Problem
Railway might be stripping CORS headers in front of your app. You need to ensure Railway passes through the headers.

### Fix Options

#### Option A: Use Railway's Headers Configuration (Recommended)
1. Go to your Railway project
2. Navigate to **Settings** → **Networking**
3. Under **HTTP Headers**, add:
   ```
   Access-Control-Allow-Origin: https://lotus-repo.vercel.app
   Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD
   Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With
   ```

#### Option B: Add Railway.json Configuration
Create or update `railway.json` in your BACKEND directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Option C: Use a Reverse Proxy
If Railway continues to strip headers, you can add a simple proxy configuration:

```javascript
// Add to BACKEND/src/server.js before CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Or specific origins
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
```

---

## Complete Setup Checklist

### Backend (Railway)
- [ ] Set `ALLOWED_ORIGINS` environment variable
- [ ] Set `NODE_ENV=production`
- [ ] Deploy updated backend code
- [ ] Verify `/health` endpoint works

### Frontend (Vercel)
- [ ] Set `REACT_APP_API_URL=https://lotusrepo-production.up.railway.app` (no `/api`)
- [ ] Redeploy frontend
- [ ] Test from browser console

### Testing
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try sending a message in the chat
4. Check if the request succeeds
5. Verify no CORS errors in console

---

## Alternative: Use Proxy Pattern

If CORS still doesn't work, you can proxy API requests through Vercel:

### 1. Create Vercel Proxy (vercel.json)
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://lotusrepo-production.up.railway.app/api/:path*"
    }
  ]
}
```

### 2. Update Frontend to Use Same Domain
Change `REACT_APP_API_URL` to just use relative paths:
```
REACT_APP_API_URL=/api
```

This way, all requests go through Vercel's domain and bypass CORS entirely.

---

## Quick Test Commands

Test if CORS is working:

```bash
# Test from curl
curl -X OPTIONS https://lotusrepo-production.up.railway.app/api/chat \
  -H "Origin: https://lotus-repo.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Should return headers like:
# Access-Control-Allow-Origin: https://lotus-repo.vercel.app
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD
```

---

## Summary

**Most Likely Fix:** Solution 1 + Solution 2 together should resolve your issue.

1. Remove `/api` from `REACT_APP_API_URL` on Vercel
2. Add `ALLOWED_ORIGINS` environment variable on Railway  
3. Redeploy both frontend and backend

If issues persist, use Solution 3 (Railway headers or Vercel proxy pattern).

