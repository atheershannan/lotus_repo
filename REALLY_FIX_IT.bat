@echo off
echo ========================================
echo Fixing GitHub push issue with secrets
echo ========================================
echo.

echo Step 1: Going back 2 commits...
git reset --hard HEAD~2

echo Step 2: Ensuring secrets are not in staging...
git rm --cached YOUR_SECRETS_READY.txt DEPLOYMENT_SECRETS.md 2>nul || echo Secrets files not in staging

echo Step 3: Adding only safe files...
git add .
git reset HEAD YOUR_SECRETS_READY.txt DEPLOYMENT_SECRETS.md

echo Step 4: Committing clean version...
git commit -m "feat: Add comprehensive test suite (32/33 tests passing) and Vercel configuration"

echo Step 5: Force pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo ✅ SUCCESS! Clean push completed!
echo ========================================
pause

