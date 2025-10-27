@echo off
echo.
echo ==========================================
echo  Deploying Chatbot to Vercel
echo ==========================================
echo.

echo Step 1: Adding files to git...
git add CHATBOT.html vercel.json BACKEND/src/routes/chat.js BACKEND/src/routes/auth.js BACKEND/src/server.js FRONTEND/src/App.js FRONTEND/src/index.css

echo.
echo Step 2: Committing...
git commit -m "Add chatbot interface with mock authentication and emerald theme styling"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ==========================================
echo  Done!
echo ==========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Click "Import Project"
echo 3. Select this repository
echo 4. Click "Deploy"
echo.
echo Your chatbot will be live at: https://your-project.vercel.app
echo.
pause

