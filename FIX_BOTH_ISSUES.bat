@echo off
echo =========================================
echo  Fixing Vercel White Page + Railway
echo =========================================

echo.
echo 1. Adding CHATBOT.html and index.html...
git add CHATBOT.html index.html vercel.json

echo.
echo 2. Committing...
git commit -m "Fix: Serve CHATBOT.html directly - no white page"

echo.
echo 3. Pushing to GitHub...
git push origin main

echo.
echo =========================================
echo  DONE!
echo =========================================
echo.
echo For Railway:
echo - Go to Settings
echo - Root Directory: BACKEND
echo - Start Command: node src/server.js
echo.
pause

