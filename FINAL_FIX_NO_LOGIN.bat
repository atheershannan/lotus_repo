@echo off
echo =========================================
echo  FINAL FIX - NO LOGIN PAGE!
echo =========================================

echo.
echo Adding public folder with CHATBOT...
git add public/chatbot.html

echo.
echo Updating vercel.json...
git add vercel.json

echo.
echo Committing changes...
git commit -m "Serve chatbot from public folder - NO LOGIN"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo =========================================
echo  DONE! Vercel will auto-deploy
echo =========================================
echo.
pause

