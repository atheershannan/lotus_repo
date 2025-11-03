# ✅ Railway Configuration Checklist

## Before Running Embeddings Generation

Please verify these settings in Railway before generating embeddings:

### 1️⃣ Database Connection String (CRITICAL)

Your `DATABASE_URL` **must** include `?pgbouncer=true` to work with connection pooling.

**Correct format:**
```
postgresql://postgres.lfdmoayogvejuvtgrrge:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Key points:**
- ✅ Port should be `6543` (NOT 5432)
- ✅ Host should include `.pooler.`
- ✅ Must end with `?pgbouncer=true`

**How to verify in Railway:**
1. Go to your Railway project
2. Click on Variables
3. Find `DATABASE_URL`
4. Click Edit
5. Make sure it ends with `?pgbouncer=true`

---

### 2️⃣ All Required Environment Variables

Make sure these are all set in Railway:

| Variable | Status | Example |
|----------|--------|---------|
| `OPENAI_API_KEY` | ✅ Required | sk-... |
| `DATABASE_URL` | ✅ Required | postgresql://...?pgbouncer=true |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Required | https://...supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Required | eyJ... |
| `PORT` | ⚪ Optional | 8080 (auto-set) |

---

### 3️⃣ Latest Code Deployed

After fixing the embeddings script, you need to:

1. **Commit and push the changes:**
   ```bash
   git add BACKEND/src/scripts/generate-embeddings.js
   git commit -m "fix: Remove contentId for user and progress embeddings"
   git push
   ```

2. **Railway should auto-deploy** the new code
   - Watch the deployment logs in Railway
   - Wait for "✅ Deployment successful"

---

### 4️⃣ What Was Fixed

The embedding generation script had a critical bug:

❌ **Before:**
```javascript
await prisma.documentEmbedding.create({
  data: {
    contentId: user.id,  // Wrong! This expects a learning_content ID
    contentType: 'user',
    // ...
  }
});
```

✅ **After:**
```javascript
await prisma.documentEmbedding.create({
  data: {
    // No contentId - it's only for learning_content relation
    contentType: 'user',
    metadata: {
      userId: user.id,  // Store user ID in metadata instead
      // ...
    }
  }
});
```

**Why this matters:**
- `contentId` in `document_embeddings` is a foreign key to `learning_content` table
- User IDs and Progress IDs don't exist in `learning_content`
- This caused the "Unknown argument `contentId`" error

---

### 5️⃣ Run Embeddings Generation

Once everything above is verified and deployed:

**PowerShell command:**
```powershell
$body = @{ secret = "generate-embeddings-now" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://lotusrepo-production.up.railway.app/api/embeddings/generate" -Method Post -Body $body -ContentType "application/json"
```

**Check status (after 2-5 minutes):**
```powershell
Invoke-RestMethod -Uri "https://lotusrepo-production.up.railway.app/api/embeddings/status"
```

**Expected result:**
```json
{
  "success": true,
  "hasEmbeddings": true,
  "counts": {
    "documentEmbeddings": 10,  // Should be > 0
    "skillEmbeddings": 5,       // Should be > 0
    "total": 15
  }
}
```

---

### 6️⃣ Verify RAG is Working

Once embeddings are generated, test the chatbot:

1. Open: https://lotus-repo.vercel.app
2. Ask: **"What is Jane Smith's department?"**
3. Expected: Should answer from database (Marketing)
4. Check Railway logs for: `✅ Generated RAG reply with X sources` where X > 0

---

## 🆘 Troubleshooting

### If embeddings generation fails:

1. **Check Railway logs** - look for the actual error message
2. **Verify DATABASE_URL** has `?pgbouncer=true`
3. **Verify latest code is deployed** - check git commit hash in Railway logs
4. **Check if database has data** - run the seed script if needed

### If still getting "prepared statement" errors:

This means `?pgbouncer=true` is NOT in your `DATABASE_URL`:
1. Go to Railway → Variables
2. Edit `DATABASE_URL`
3. Add `?pgbouncer=true` at the end
4. Redeploy

---

## 📝 Summary

**Before pushing:**
- ✅ Fixed contentId bug in embeddings script

**Before running embeddings:**
- ✅ Verify DATABASE_URL has `?pgbouncer=true`
- ✅ Push changes to trigger Railway deployment
- ✅ Wait for successful deployment
- ✅ Run embeddings generation command
- ✅ Verify embeddings were created

---

Good luck! 🚀

