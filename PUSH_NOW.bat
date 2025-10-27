@echo off
echo.
echo ========================================
echo  Deploying to Vercel NOW!
echo ========================================
echo.

echo Adding package.json...
git add package.json

echo Committing changes...
git commit -m "fix: Add root package.json and remove vercel.json"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  ✅ SUCCESS! Pushed to GitHub!
echo ========================================
echo.
echo Vercel will now:
echo  1. Detect your React app automatically
echo  2. Build the frontend
echo  3. Deploy to production
echo.
echo Check status at: https://vercel.com
echo.
pause

