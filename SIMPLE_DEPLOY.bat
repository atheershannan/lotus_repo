@echo off
echo ===========================================
echo   Simple Frontend Deploy
echo ===========================================
echo.

echo Pushing to GitHub...
git add .
git commit -m "feat: Frontend deployment"
git push origin main

echo.
echo ✅ Done! Check Vercel now!
echo.
pause

