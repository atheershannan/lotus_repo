# 🚀 Quick Deploy Guide

## ⚠️ Importante: Root Directory Configuration

The issue is that Vercel needs to know the `FRONTEND` folder is the root.

## ✅ Solution 1: Create New Project in Vercel Dashboard

### Step 1: Go to Vercel
```
https://vercel.com/new
```

### Step 2: Import Repository
- Connect your GitHub repository

### Step 3: Configure Project
- **Root Directory**: Type `FRONTEND`
- **Framework Preset**: Create React App (or select it)
- **Build Command**: Will auto-detect (or use `npm run build`)
- **Output Directory**: Will auto-detect (or use `build`)

### Step 4: Add Environment Variable
- Click "Environment Variables"
- Add:
  - **Name**: `REACT_APP_API_URL`
  - **Value**: `https://lotusrepo-production-0265.up.railway.app/api`
  - **Environments**: Select all (Production, Preview, Development)

### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete

## ✅ Solution 2: Use Existing Project - Update Settings

If you already have a Vercel project:

1. **Go to Project Settings**
   - Settings → General
   
2. **Update Root Directory**
   - Scroll to "Root Directory"
   - Change from `.` to `FRONTEND`
   - Save

3. **Redeploy**
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

## 🔧 Alternative: Update vercel.json for Root Deployment

If you want to deploy from root:

Move `FRONTEND` files to root and update config.

**Not recommended** - Better to use Root Directory setting.

## ✅ Recommended Approach

**Use Vercel Dashboard with Root Directory = FRONTEND**

This is the cleanest solution.

## 📋 Checklist

- [ ] Create new project in Vercel OR update Root Directory
- [ ] Set Root Directory to `FRONTEND`
- [ ] Add environment variable `REACT_APP_API_URL`
- [ ] Deploy
- [ ] Verify chatbot works

---

**Status**: Need to configure Root Directory in Vercel
