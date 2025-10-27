@echo off
echo.
echo ===========================================
echo   Fixing Build Issues
echo ===========================================
echo.

echo Adding .vercelignore...
git add FRONTEND/.vercelignore

echo Committing...
git commit -m "fix: Add .vercelignore and fix build issues"

echo Pushing...
git push origin main

echo.
echo ===========================================
echo   ✅ Now configure Vercel:
echo ===========================================
echo.
echo In Vercel Settings:
echo.
echo Root Directory: FRONTEND
echo Build Command: CI=false npm run build
echo Output Directory: build
echo.
echo Then Redeploy!
echo.
pause

