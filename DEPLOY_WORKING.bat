@echo off
echo ========================================
echo  Deploying with Working Vercel Config
echo ========================================
echo.

echo Adding vercel.json...
git add vercel.json package.json

echo Committing...
git commit -m "fix: Configure Vercel with proper build settings"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  ✅ DEPLOYED! Check Vercel now!
echo ========================================
echo.
echo Your site: https://lotus-repo.vercel.app
echo.
pause

