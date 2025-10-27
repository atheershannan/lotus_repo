@echo off
echo.
echo ===========================================
echo   SIMPLE VERCEL DEPLOY
echo ===========================================
echo.

git add vercel.json
git commit -m "fix: Simple Vercel config for CRA"
git push origin main

echo.
echo ✅ Deploying with simple CRA config!
echo.
pause

