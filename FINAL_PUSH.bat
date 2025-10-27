@echo off
echo ========================================
echo  Final Deployment Push
echo ========================================
echo.

echo Removing package.json (prevents React build)...
echo Adding only CHATBOT files...

git add CHATBOT.html index.html vercel.json .vercelignore
git rm --cached package.json
git commit -m "Deploy chatbot only - no React app"
git push origin main

echo.
echo ========================================
echo  Done!
echo ========================================
echo.
echo Vercel will deploy ONLY the CHATBOT
echo No more Login page!
echo.
pause

