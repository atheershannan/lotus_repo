@echo off
echo ========================================
echo  Fixing Vercel 404 Error
echo ========================================
echo.

echo Pushing changes to GitHub...
git add vercel.json index.html
git commit -m "Fix Vercel 404 - serve CHATBOT.html from root"
git push origin main

echo.
echo ========================================
echo  Done!
echo ========================================
echo.
echo Vercel will auto-redeploy in 30 seconds
echo.
echo Open: https://lotus-repo.vercel.app
echo.
pause

