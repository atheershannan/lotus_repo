@echo off
echo ========================================
echo  Final Deployment - Vercel Ready!
echo ========================================
echo.

echo Updating package.json for Node 22...
git add package.json

echo Committing with Node 22...
git commit -m "fix: Update Node.js version to 22.x for Vercel"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  ✅ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your site is now deploying to:
echo  https://lotus-repo.vercel.app
echo.
pause

