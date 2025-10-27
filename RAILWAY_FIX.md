# 🔧 Railway Deployment Crash Fix

## ❌ Problem
```
node: command not found
```

Railway can't find Node.js because:
1. Railway is looking in root directory
2. Backend is in `BACKEND/` folder
3. Railway doesn't know to install dependencies in BACKEND folder

## ✅ Solution

### Option 1: Set Root Directory in Railway (Easiest)

In Railway Dashboard:
1. Select your service
2. Settings → Source
3. **Root Directory**: Change to `BACKEND`
4. Save
5. Redeploy

### Option 2: Update railway.json

Updated `railway.json` to:
- Use `cd BACKEND && npm start` for start command
- This ensures Railway runs commands from BACKEND directory

### Option 3: Create nixpacks.toml in BACKEND

Created `BACKEND/nixpacks.toml` with proper Node.js setup.

## 🚀 After Fix

1. **Push changes:**
   ```bash
   git add .
   git commit -m "Fix Railway deployment configuration"
   git push origin main
   ```

2. **Or in Railway Dashboard:**
   - Settings → Source → Root Directory: `BACKEND`
   - Redeploy

## 📝 What Changed

- **railway.json**: Updated startCommand to `cd BACKEND && npm start`
- **BACKEND/nixpacks.toml**: Created with Node.js 20 config

---

**Recommended**: Set Root Directory to `BACKEND` in Railway Dashboard
