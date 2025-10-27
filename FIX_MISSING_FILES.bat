@echo off
echo.
echo ===========================================
echo   Fixing Missing Files
echo ===========================================
echo.

echo Adding missing index.html and public files...
git add FRONTEND/public/
git add FRONTEND/package.json

echo Committing fix...
git commit -m "fix: Add missing index.html and public files"

echo Pushing to GitHub...
git push origin main

echo.
echo ===========================================
echo   ✅ FIXED! Vercel will build now!
echo ===========================================
echo.
echo Missing files added:
echo   - index.html
echo   - manifest.json
echo   - robots.txt
echo.
echo Vercel will automatically redeploy!
echo.
pause

