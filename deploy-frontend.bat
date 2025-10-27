@echo off
echo.
echo ===========================================
echo   Deploying FRONTEND to Vercel
echo ===========================================
echo.

echo Staging all changes...
git add .

echo Committing...
git commit -m "feat: Deploy frontend only - 32/33 tests passing"

echo Pushing to GitHub...
git push origin main

echo.
echo ===========================================
echo   ✅ PUSHED TO GITHUB!
echo ===========================================
echo.
echo Now go to Vercel and configure:
echo.
echo 1. Settings -> General
echo 2. Root Directory: FRONTEND
echo 3. Build Command: npm run build
echo 4. Output Directory: build
echo 5. Redeploy!
echo.
echo OR just deploy with auto-detection!
echo.
pause

