@echo off
echo Fixing Vercel deployment...
echo.

echo Adding package.json to root...
git add package.json

echo Committing...
git commit -m "fix: Add root package.json for Vercel deployment"

echo Removing old vercel.json...
git rm vercel.json 2>nul

echo Committing removal...
git commit -m "fix: Let Vercel auto-detect React app"

echo Pushing to GitHub...
git push origin main --force

echo.
echo ✅ Done! Vercel will auto-detect your React app!
pause

