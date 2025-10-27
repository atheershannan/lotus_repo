@echo off
echo.
echo ===========================================
echo   Fixing Missing index.css
echo ===========================================
echo.

echo Adding index.css...
git add FRONTEND/src/index.css

echo Committing fix...
git commit -m "fix: Add missing index.css file"

echo Pushing to GitHub...
git push origin main

echo.
echo ===========================================
echo   ✅ FIXED! Vercel will build now!
echo ===========================================
echo.
echo Missing file added: index.css
echo.
echo Vercel will automatically redeploy!
echo.
pause

