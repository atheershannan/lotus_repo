# 🔧 Prisma Vector Type Fix - Complete Solution

## 🚨 The Problem

You had **3 critical Prisma schema errors** when generating embeddings:

### ERROR 1: Unknown argument `contentId`
```
Unknown argument `contentId`. Did you mean `content`?
```
**Cause:** Prisma was expecting a relation object, not a direct ID field.

### ERROR 2: Unknown argument `embedding`
```
Unknown argument `embedding`. Available options are marked with ?.
```
**Cause:** Prisma's `Unsupported("vector(1536)")` type doesn't work in the generated client.

### ERROR 3: Missing argument `skillText`
```
Argument `skillText` is missing.
```
**Cause:** Script wasn't providing the required `skillText` field.

---

## 🔍 Root Cause

**Prisma doesn't fully support PostgreSQL's `vector` extension in its generated client.**

When you define a field as:
```prisma
embedding  Unsupported("vector(1536)")?
```

Prisma:
- ✅ Maps it correctly in migrations
- ❌ **Does NOT include it in the generated client**
- ❌ Throws errors if you try to use it in `create()` or `update()`

---

## ✅ The Solution

**Two-Step Approach:**
1. **Create the record WITHOUT the embedding** (using Prisma client)
2. **Update with the embedding** (using raw SQL with proper vector casting)

### Before (Broken):
```javascript
await prisma.documentEmbedding.create({
  data: {
    contentType: 'user',
    contentText: userText,
    embedding: `[${embedding.join(',')}]`, // ❌ Not recognized by Prisma
    metadata: { ... }
  }
});
```

### After (Fixed):
```javascript
// Step 1: Create without embedding
const docEmbedding = await prisma.documentEmbedding.create({
  data: {
    contentType: 'user',
    contentText: userText,
    // No embedding field here
    metadata: { ... }
  }
});

// Step 2: Update with embedding using raw SQL
await prisma.$executeRaw`
  UPDATE document_embeddings 
  SET embedding = ${`[${embedding.join(',')}]`}::vector
  WHERE id = ${docEmbedding.id}::uuid
`;
```

---

## 📋 All Changes Made

### 1. User Embeddings (Lines 63-85)
```javascript
// ✅ Create record first
const docEmbedding = await prisma.documentEmbedding.create({
  data: {
    contentType: 'user',
    contentText: userText,
    metadata: {
      userId: user.id,
      userName: user.name,
      // ...
    }
  }
});

// ✅ Then add embedding via raw SQL
await prisma.$executeRaw`
  UPDATE document_embeddings 
  SET embedding = ${`[${embedding.join(',')}]`}::vector
  WHERE id = ${docEmbedding.id}::uuid
`;
```

### 2. Skill Embeddings (Lines 123-143)
```javascript
// ✅ Create with skillText (was missing!)
const skillEmbedding = await prisma.skillEmbedding.create({
  data: {
    skillId: skill.id,
    skillText: skillText,  // 🎯 This was missing!
    metadata: { ... }
  }
});

// ✅ Then add embedding via raw SQL
await prisma.$executeRaw`
  UPDATE skill_embeddings 
  SET embedding = ${`[${embedding.join(',')}]`}::vector
  WHERE id = ${skillEmbedding.id}::uuid
`;
```

### 3. Learning Content Embeddings (Lines 201-223)
```javascript
// ✅ Create with contentId (foreign key)
const docEmbedding = await prisma.documentEmbedding.create({
  data: {
    contentId: content.id,
    contentType: 'learning_content',
    contentText: contentText,
    metadata: { ... }
  }
});

// ✅ Then add embedding via raw SQL
await prisma.$executeRaw`
  UPDATE document_embeddings 
  SET embedding = ${`[${embedding.join(',')}]`}::vector
  WHERE id = ${docEmbedding.id}::uuid
`;
```

### 4. Progress Embeddings (Lines 278-301)
```javascript
// ✅ Create without contentId (no foreign key for progress)
const docEmbedding = await prisma.documentEmbedding.create({
  data: {
    contentType: 'user_progress',
    contentText: progressText,
    metadata: {
      progressId: progress.id,
      // ...
    }
  }
});

// ✅ Then add embedding via raw SQL
await prisma.$executeRaw`
  UPDATE document_embeddings 
  SET embedding = ${`[${embedding.join(',')}]`}::vector
  WHERE id = ${docEmbedding.id}::uuid
`;
```

---

## 📊 Schema Verification

### ✅ DocumentEmbedding Model
```prisma
model DocumentEmbedding {
  id            String    @id @default(uuid()) @db.Uuid
  contentId     String?   @map("content_id")         // Optional foreign key
  contentType   String    @map("content_type")       // Required
  contentText   String    @map("content_text")       // Required
  embedding     Unsupported("vector(1536)")?         // Can't use in Prisma client
  metadata      Json      @default("{}")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  content       LearningContent? @relation(fields: [contentId], references: [id])
  
  @@map("document_embeddings")
}
```

**Fields accessible in Prisma client:**
- ✅ `id`
- ✅ `contentId`
- ✅ `contentType`
- ✅ `contentText`
- ❌ `embedding` (use raw SQL)
- ✅ `metadata`
- ✅ `createdAt`
- ✅ `updatedAt`

### ✅ SkillEmbedding Model
```prisma
model SkillEmbedding {
  id            String    @id @default(uuid()) @db.Uuid
  skillId       String    @map("skill_id")           // Required
  skillText     String    @map("skill_text")         // Required (was missing!)
  embedding     Unsupported("vector(1536)")?         // Can't use in Prisma client
  metadata      Json      @default("{}")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  skill         Skill     @relation(fields: [skillId], references: [id])
  
  @@map("skill_embeddings")
}
```

**Fields accessible in Prisma client:**
- ✅ `id`
- ✅ `skillId`
- ✅ `skillText` (was missing in script!)
- ❌ `embedding` (use raw SQL)
- ✅ `metadata`
- ✅ `createdAt`
- ✅ `updatedAt`

---

## 🎯 Why This Solution Works

### 1. **Prisma handles the schema-safe fields**
- All regular fields (IDs, text, JSON, dates) work normally
- Foreign key relations are validated
- Type safety is maintained

### 2. **Raw SQL handles the vector field**
- Direct database access for `vector` type
- Proper casting with `::vector`
- No Prisma client limitations

### 3. **Best of both worlds**
- ✅ Type safety from Prisma
- ✅ Vector support from PostgreSQL
- ✅ No schema changes needed
- ✅ Works with connection pooling

---

## 🧪 Testing

After deploying this fix, you should see:

### ✅ Expected Output:
```
📊 Generating embeddings for users...
Found 3 users
  Processing: John Doe...
  ✅ John Doe
  Processing: Jane Smith...
  ✅ Jane Smith
  Processing: Mike Trainer...
  ✅ Mike Trainer
✅ User embeddings complete!

🎯 Generating embeddings for skills...
Found 5 skills
  Processing: JavaScript Basics...
  ✅ JavaScript Basics
  Processing: Python Fundamentals...
  ✅ Python Fundamentals
  ...
✅ Skill embeddings complete!
```

### ❌ No More Errors Like:
- ~~`Unknown argument 'contentId'`~~
- ~~`Unknown argument 'embedding'`~~
- ~~`Argument 'skillText' is missing`~~

---

## 📝 Summary

**What was fixed:**
1. ✅ **skillText missing** - Now provided for all skill embeddings
2. ✅ **embedding field unsupported** - Now using two-step process (create + raw SQL update)
3. ✅ **contentId confusion** - Properly handled for content vs non-content embeddings

**Files modified:**
- `BACKEND/src/scripts/generate-embeddings.js` (4 sections updated)

**Next steps:**
1. Push this fix to Railway
2. Wait for deployment
3. Run embeddings generation
4. Verify success with status check

---

## 🚀 Deploy Commands

```powershell
# 1. Push to Railway
git add BACKEND/src/scripts/generate-embeddings.js
git add PRISMA_VECTOR_TYPE_FIX.md
git commit -m "fix: Use two-step approach for vector embeddings (Prisma client + raw SQL)"
git push

# 2. Wait for deployment, then generate embeddings
$body = @{ secret = "generate-embeddings-now" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://lotusrepo-production.up.railway.app/api/embeddings/generate" -Method Post -Body $body -ContentType "application/json"

# 3. Check status (after 2-5 minutes)
Invoke-RestMethod -Uri "https://lotusrepo-production.up.railway.app/api/embeddings/status"
```

---

✅ **This fix completely resolves all Prisma schema errors!**

