# 🚀 Vercel Deployment Setup - Cloud Configuration

## ✅ Frontend Changes for Cloud Deployment

The FRONTEND has been configured to work in the cloud without requiring user login.

### Environment Variables Required

**Set these in Vercel Dashboard → Project Settings → Environment Variables:**

```bash
REACT_APP_API_URL=https://lotusrepo-production.up.railway.app/api
REACT_APP_SUPABASE_URL=your_supabase_url (if using)
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key (if using)
```

### Current Configuration

✅ **vercel.json** - Updated to serve React app instead of static HTML
✅ **FRONTEND/src/services/api.js** - Uses `REACT_APP_API_URL` environment variable
✅ **No login required** - Chatbot displays directly
✅ **API Backend**: Railway at `https://lotusrepo-production.up.railway.app`

## 📋 Deployment Steps

### 1. Set Environment Variables in Vercel

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Required:**
- `REACT_APP_API_URL` = `https://lotusrepo-production.up.railway.app/api`

**Optional (if using Supabase):**
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

### 2. Deploy to Vercel

**Option A: Using GitHub Actions (Recommended)**
```bash
git add .
git commit -m "Configure frontend for cloud deployment without login"
git push origin main
```

Then manually trigger the workflow in GitHub Actions:
- Go to: https://github.com/your-repo/actions
- Run workflow: "Deploy to Vercel"

**Option B: Using Vercel CLI**
```bash
cd FRONTEND
vercel --prod
```

**Option C: Using Vercel Dashboard**
1. Connect GitHub repo to Vercel
2. Vercel will auto-deploy on push
3. Ensure root directory is set to: `FRONTEND`

### 3. Verify Deployment

After deployment:
1. Visit your Vercel URL
2. Should see: **Chatbot interface immediately** (no login)
3. Try sending a message
4. Check browser console for API calls to Railway backend

## 🔗 Current URLs

- **Frontend (Vercel)**: Your Vercel deployment URL
- **Backend API (Railway)**: `https://lotusrepo-production.up.railway.app/api`
- **Chat Endpoint**: `https://lotusrepo-production.up.railway.app/api/chat`

## 🔐 Authentication Flow (Cloud)

```
┌─────────────────────────────────────────────────────────┐
│              User opens Vercel URL                     │
│  → Chatbot displays immediately (no login required)    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              User sends message                        │
│  → FRONTEND makes API call to Railway backend         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              API Call to Railway                       │
│  URL: https://lotusrepo-production.up.railway.app/api │
│  Endpoint: /api/chat/message                          │
│  Headers: {                                            │
│    'Content-Type': 'application/json',                 │
│    'Authorization': 'Bearer <token>' (optional)        │
│  }                                                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Railway Backend                           │
│  - Validates request (with or without token)           │
│  - Processes message via RAG Microservice              │
│  - Returns response                                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Response to User                          │
│  → Chatbot displays response                           │
└─────────────────────────────────────────────────────────┘
```

## ✅ Verification Checklist

- [ ] Environment variables set in Vercel
- [ ] Railway backend is running
- [ ] Vercel deployment successful
- [ ] Chatbot displays without login page
- [ ] Messages can be sent
- [ ] Responses received from Railway backend
- [ ] No CORS errors in browser console

## 🐛 Troubleshooting

### Chatbot doesn't load
- Check that `vercel.json` has correct configuration
- Verify `FRONTEND/build` exists after build
- Check Vercel deployment logs

### "Cannot connect to API"
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check Railway backend is running: https://lotusrepo-production.up.railway.app/health
- Check CORS settings in Railway backend

### "401 Unauthorized"
- This is expected if no token is sent
- Backend should handle unauthenticated requests based on your policy
- If blocking, check backend auth middleware

### "404 on all routes"
- Check `vercel.json` rewrites configuration
- Ensure SPA mode is enabled
- Verify `outputDirectory` points to `FRONTEND/build`

## 📝 Git Configuration

**Root Directory in Vercel:**
- Set to: `FRONTEND`

**Build Command:**
- Auto-detected: `npm run build`

**Output Directory:**
- Set to: `build`

## 🎯 Quick Deploy Command

```bash
# 1. Commit changes
git add .
git commit -m "Deploy frontend without login requirement"

# 2. Push to GitHub
git push origin main

# 3. Vercel will auto-deploy (if activation is enabled)
# Or manually deploy via Vercel Dashboard
```

---

**Status**: ✅ Ready for Cloud Deployment
**Last Updated**: Frontend configured for production

