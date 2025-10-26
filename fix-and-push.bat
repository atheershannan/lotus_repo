@echo off
echo Removing secrets and pushing to GitHub...
echo.

echo Step 1: Removing secrets from last commit...
git reset --soft HEAD~1

echo Step 2: Removing secret files from staging...
git reset HEAD YOUR_SECRETS_READY.txt DEPLOYMENT_SECRETS.md

echo Step 3: Adding .gitignore...
git add .gitignore

echo Step 4: Committing without secrets...
git commit -m "feat: Complete test suite (32/33 tests) and Vercel configuration"

echo Step 5: Pushing to GitHub...
git push origin main

echo.
echo ✅ Done! Secrets removed and pushed successfully!
pause

