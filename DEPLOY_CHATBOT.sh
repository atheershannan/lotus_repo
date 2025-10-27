#!/bin/bash

echo "🚀 Deploying Chatbot to Vercel..."

# Step 1: Commit changes
git add CHATBOT.html BACKEND/src/routes/chat.js BACKEND/src/routes/auth.js BACKEND/src/server.js vercel.json
git commit -m "Add chatbot interface and mock authentication" || true

# Step 2: Push to GitHub
git push origin main || echo "Already up to date"

echo "✅ Changes pushed to GitHub"
echo "📝 Now go to Vercel and deploy:"
echo "   1. Import project from GitHub"
echo "   2. Select this repository"
echo "   3. Deploy!"
echo ""
echo "Or run: vercel --prod"

