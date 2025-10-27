# 🚂 Railway Deployment Guide - Backend API

## 📋 Prerequisites

- GitHub repository connected to Railway
- OpenAI API key
- Railway account (free tier works)

---

## 🔧 Step 1: Railway Project Setup

### 1.1 Create New Project in Railway

1. Go to [Railway Dashboard](https://railway.app/)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `lotus_repo`
5. Railway will auto-detect the Node.js app

### 1.2 Configure Service Settings

In the Railway project dashboard:

1. Click on your service (backend)
2. Go to **Settings** tab
3. Configure:
   - **Root Directory**: `BACKEND`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Watch Paths**: `["BACKEND/src/**"]`

---

## 🔐 Step 2: Environment Variables

### 2.1 Required Variables

Go to your Railway service → **Variables** tab and add:

```bash
# Server Configuration
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://lotus-repo.vercel.app

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS Configuration
ALLOWED_ORIGINS=https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.2 Optional Variables (for enhanced features)

```bash
# Database (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis (if using)
REDIS_URL=redis://localhost:6379

# JWT (if using authentication)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

---

## 🚀 Step 3: Deploy

### 3.1 Automatic Deployment

Railway automatically deploys when you push to GitHub:

1. Push your code:
   ```bash
   git add .
   git commit -m "Configure Railway deployment"
   git push origin main
   ```

2. Railway will:
   - Install dependencies (`npm install`)
   - Generate Prisma client (`npx prisma generate`)
   - Start the server (`npm start`)

### 3.2 Monitor Deployment

1. Go to Railway Dashboard
2. Click on your service
3. Open **Deployments** tab
4. Watch the build logs in real-time

---

## ✅ Step 4: Verification

### 4.1 Check Health Endpoint

Once deployed, test the health endpoint:

```bash
curl https://your-app-name.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### 4.2 Test Chat Endpoint

```bash
curl -X POST https://your-app-name.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

Expected response:
```json
{
  "reply": "Hello! How can I help you today?",
  "history": [...]
}
```

### 4.3 Check Logs

1. In Railway Dashboard → Your Service
2. Click **Logs** tab
3. You should see:
   ```
   🚀 Corporate Learning Assistant Backend running on port 8080
   📊 Environment: production
   🔗 Frontend URL: https://lotus-repo.vercel.app
   ```

---

## 🔧 Step 5: Troubleshooting

### Issue: Application Crashes

**Symptoms**: Service shows "Crashed" status

**Solutions**:
1. Check logs for error messages
2. Verify all environment variables are set
3. Ensure `OPENAI_API_KEY` is valid
4. Check that `PORT` variable is set (Railway provides it dynamically)

### Issue: Build Fails

**Symptoms**: Deployment fails during build phase

**Solutions**:
1. Verify `package.json` has correct `main` and `scripts`
2. Check that all dependencies are in `package.json`
3. Ensure Prisma schema is valid

### Issue: Health Check Fails

**Symptoms**: Health endpoint returns 404 or error

**Solutions**:
1. Verify the server started successfully (check logs)
2. Ensure `/health` route exists in `server.js`
3. Check that the correct port is being used

### Issue: CORS Errors

**Symptoms**: Frontend can't connect to backend

**Solutions**:
1. Add your Vercel URL to `ALLOWED_ORIGINS`
2. Check Railway logs for CORS errors
3. Verify `FRONTEND_URL` environment variable

---

## 📊 Monitoring

### View Logs

```bash
# In Railway Dashboard
Service → Logs
```

### Metrics

Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🔄 Update Deployment

When you make changes:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. Railway auto-deploys (usually takes 2-3 minutes)

3. Verify deployment in Railway Dashboard

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Set to `production` |
| `PORT` | Yes | Railway provides this automatically |
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `FRONTEND_URL` | Yes | Your Vercel frontend URL |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed origins |
| `LOG_LEVEL` | No | Logging level (default: `info`) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window (default: 900000) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window (default: 100) |

---

## 🎯 Best Practices

1. **Never commit API keys** - Use Railway environment variables
2. **Test locally first** - Use `npm run dev` before deploying
3. **Monitor logs** - Check Railway logs regularly
4. **Health checks** - Implement and monitor `/health` endpoint
5. **Error handling** - Ensure all errors are caught and logged

---

## 🆘 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review Railway logs
3. Test endpoints with `curl` or Postman
4. Verify environment variables are set correctly

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Status**: ✅ Ready for deployment  
**Last Updated**: 2024-01-20  
**Version**: 1.0.0
