@echo off
echo =======================================
echo  FINAL PUSH - NO LOGIN PAGE!
echo =======================================
echo.

echo 1. Adding only Chatbot files...
git add CHATBOT.html index.html vercel.json .vercelignore

echo.
echo 2. Adding Backend with JWT auth...
git add BACKEND/src/routes/chat.js BACKEND/src/server.js

echo.
echo 3. Adding security doc...
git add SECURITY_IMPLEMENTATION.md

echo.
echo 4. Committing...
git commit -m "Deploy chatbot only - NO LOGIN PAGE - JWT auth ready"

echo.
echo 5. Pushing to GitHub...
git push origin main

echo.
echo =======================================
echo  ✅ DONE! Vercel will auto-redeploy
echo =======================================
echo.
echo No Login page ✅
echo Only Chatbot ✅  
echo JWT Auth ready ✅
echo.
pause

