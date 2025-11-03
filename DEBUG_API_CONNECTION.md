# 🐛 Debug: Failed to Send Message

## Problem
Frontend shows "Failed to send message" error when trying to chat.

## ✅ What's Working
- Frontend deployed successfully
- UI displays correctly
- No login required ✅
- Chatbot interface visible

## ❌ What's Not Working
- API connection to backend
- Message sending fails

## 🔍 Possible Causes

### 1. Environment Variable Not Set

**Check in Vercel:**
- Go to Project Settings → Environment Variables
- Verify `REACT_APP_API_URL` exists
- Value should be: `https://lotusrepo-production-0265.up.railway.app/api`

**If NOT set:**
1. Add environment variable
2. Redeploy

### 2. Backend Not Running

**Check Railway:**
- Go to Railway dashboard
- Verify service is "Active" (green)
- Check logs for errors

**Test backend:**
Open in browser:
```
https://lotusrepo-production-0265.up.railway.app/api/health
```

Should return JSON response.

### 3. Wrong API Endpoint

The frontend is trying to call:
```
POST /api/chat/message
```

Backend should have this route configured.

### 4. CORS Error

Check browser console (F12 → Console):
- Look for CORS errors
- If found, backend needs to allow Vercel origin

## ✅ Quick Fixes

### Fix 1: Check Environment Variable

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://lotusrepo-production-0265.up.railway.app/api`
3. Redeploy

### Fix 2: Test Backend

Open browser and go to:
```
https://lotusrepo-production-0265.up.railway.app/health
```

Or:
```
https://lotusrepo-production-0265.up.railway.app/api/health
```

### Fix 3: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try sending a message
4. Look for error messages
5. Share the error with me!

## 🎯 Next Steps

1. Check environment variable in Vercel
2. Test Railway backend is running
3. Check browser console for errors
4. Share error messages from console

---

**Most likely**: Environment variable not set or backend not running

