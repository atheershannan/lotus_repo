@echo off
echo Pushing fixes to GitHub...

git add index.html vercel.json
git commit -m "Fix Vercel deployment - serve CHATBOT.html"
git push origin main

echo.
echo Done! Vercel will auto-deploy in ~30 seconds
echo Check: https://lotus-repo.vercel.app
pause

