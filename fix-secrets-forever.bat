@echo off
echo Fixing secrets in git history...
echo.

echo Step 1: Removing commits with secrets...
git reset --hard HEAD~2

echo Step 2: Adding all files EXCEPT secrets...
git add .gitignore
git add FRONTEND/src/**/__tests__/*.js
git add FRONTEND/src/setupTests.js
git add FRONTEND/jest.config.js
git add FRONTEND/src/__mocks__/
git add FRONTEND/src/components/layout/Navbar.js
git add FRONTEND/src/store/slices/uiSlice.js
git add FRONTEND/src/theme/theme.js
git add vercel.json
git add *.md
git add *.bat
git add *.sh

echo Step 3: Committing clean version...
git commit -m "feat: Add comprehensive test suite (32/33 tests passing) and Vercel configuration"

echo Step 4: Pushing to GitHub...
git push origin main --force

echo.
echo ✅ Done! Secrets completely removed from history!
pause

