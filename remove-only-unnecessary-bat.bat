@echo off
echo ================================================
echo Removing Only Unnecessary .BAT Files
echo ================================================
echo.
echo This will remove ~30 temporary .bat files
echo BUT will KEEP the essential ones:
echo   - start.bat
echo   - quick_start.bat
echo   - START_BACKEND.bat
echo   - remove-bat-files.bat
echo   - cleanup-repo.bat
echo.
pause
echo.

:: Create backup first
echo [1/3] Creating safety backup...
git add -A 2>nul
git commit -m "Backup before removing unnecessary .bat files" --allow-empty 2>nul
echo ✅ Backup created
echo.

:: Remove specific .bat files from git tracking
echo [2/3] Removing unnecessary .bat files...

git rm --cached CLEAN_GIT.bat 2>nul
git rm --cached COMPLETE_FIX.bat 2>nul
git rm --cached DEPLOY_CORRECT.bat 2>nul
git rm --cached DEPLOY_FINAL.bat 2>nul
git rm --cached DEPLOY_FIX.bat 2>nul
git rm --cached DEPLOY_IT.bat 2>nul
git rm --cached DEPLOY_SIMPLE.bat 2>nul
git rm --cached DEPLOY_WORKING.bat 2>nul
git rm --cached deploy-frontend.bat 2>nul
git rm --cached deploy-cloud.bat 2>nul
git rm --cached FINAL_FIX_NO_LOGIN.bat 2>nul
git rm --cached FINAL_FIX.bat 2>nul
git rm --cached FINAL_PUSH.bat 2>nul
git rm --cached FINAL_SOLUTION.bat 2>nul
git rm --cached final-push.bat 2>nul
git rm --cached FIX_BOTH_ISSUES.bat 2>nul
git rm --cached FIX_BUILD.bat 2>nul
git rm --cached FIX_CSS.bat 2>nul
git rm --cached FIX_MISSING_FILES.bat 2>nul
git rm --cached FIX_VERCEL_404.bat 2>nul
git rm --cached fix-and-push.bat 2>nul
git rm --cached fix-secrets-forever.bat 2>nul
git rm --cached PUSH_FIX.bat 2>nul
git rm --cached PUSH_NO_LOGIN.bat 2>nul
git rm --cached PUSH_NOW.bat 2>nul
git rm --cached PUSH_TO_VERCEL.bat 2>nul
git rm --cached push-fix.bat 2>nul
git rm --cached quick-push.bat 2>nul
git rm --cached REALLY_FIX_IT.bat 2>nul
git rm --cached REMOVE_ZIP.bat 2>nul
git rm --cached SIMPLE_DEPLOY.bat 2>nul

echo ✅ Removed unnecessary .bat files
echo.

:: Update .gitignore
echo [3/3] Updating .gitignore...
if not exist .gitignore (
    echo *.bat > .gitignore
    echo ✅ Created .gitignore
) else (
    findstr /C:"*.bat" .gitignore >nul 2>&1
    if %errorlevel% neq 0 (
        echo # Prevent .bat files from being tracked >> .gitignore
        echo *.bat >> .gitignore
        echo ✅ Updated .gitignore
    ) else (
        echo ℹ️  .gitignore already configured
    )
)
echo.

echo ================================================
echo Summary
echo ================================================
echo.
echo ✅ Removed ~30 temporary .bat files
echo ✅ Kept essential .bat files (start.bat, quick_start.bat, etc.)
echo ✅ Updated .gitignore
echo.
echo NEXT STEPS:
echo.
echo 1. Review: git status
echo 2. Commit: git commit -m "Remove temporary .bat files"
echo 3. Push: git push
echo.
echo The essential .bat files are still available for use!
echo.
pause

