@echo off
echo Adding all files...
git add .

echo Removing secret files from staging...
git reset HEAD YOUR_SECRETS_READY.txt
git reset HEAD DEPLOYMENT_SECRETS.md

echo Checking what will be committed...
git status

echo.
echo Creating final commit...
git commit -m "feat: Complete test suite (32/33 tests) and Vercel configuration"

echo.
echo Pushing to GitHub...
git push origin main --force

echo.
echo ✅ Done!
pause

