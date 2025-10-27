@echo off
echo Adding vercel.json...
git add vercel.json

echo Committing...
git commit -m "fix: Update vercel.json configuration"

echo Pushing to GitHub...
git push origin main

echo.
echo ✅ Done! Vercel will deploy automatically!
pause

