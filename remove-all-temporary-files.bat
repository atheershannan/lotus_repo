@echo off
echo ================================================
echo Remove All Temporary Files (.bat + .txt)
echo ================================================
echo.

:: Create backup
echo [1/5] Creating safety backup...
git add -A 2>nul
git commit -m "Backup before removing temporary files" --allow-empty 2>nul
echo ✅ Backup created
echo.

:: Remove .bat files (except essential ones)
echo [2/5] Removing temporary .bat files...
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
echo ✅ Removed temporary .bat files
echo.

:: Remove .txt files
echo [3/5] Removing temporary .txt files...
for %%f in (*.txt) do (
    git rm --cached "%%f" 2>nul
)
echo ✅ Removed all .txt files
echo.

:: Remove other unnecessary files and folders
echo [4/5] Removing other unnecessary files...
git rm --cached FRONTEND.zip 2>nul
git rm --cached microservice-integration.js 2>nul
git rm -r --cached contextual-corporate-assistant 2>nul
echo ✅ Removed other unnecessary files
echo.

:: Update .gitignore
echo [5/5] Updating .gitignore...
if not exist .gitignore (
    echo # Prevent temporary files from being tracked > .gitignore
    echo *.bat >> .gitignore
    echo *.txt >> .gitignore
    echo *.zip >> .gitignore
    echo logs/ >> .gitignore
    echo coverage/ >> .gitignore
    echo ✅ Created .gitignore
) else (
    findstr /C:"*.bat" .gitignore >nul 2>&1
    if %errorlevel% neq 0 (
        echo. >> .gitignore
        echo # Prevent temporary files from being tracked >> .gitignore
        echo *.bat >> .gitignore
        echo *.txt >> .gitignore
        findstr /C:"*.zip" .gitignore >nul 2>&1 || echo *.zip >> .gitignore
        findstr /C:"logs/" .gitignore >nul 2>&1 || echo logs/ >> .gitignore
        findstr /C:"coverage/" .gitignore >nul 2>&1 || echo coverage/ >> .gitignore
        echo ✅ Updated .gitignore
    ) else (
        echo ℹ️  .gitignore already configured
    )
)
echo.

echo ================================================
echo Summary:
echo ================================================
echo.
echo ✅ Removed ~30 temporary .bat files
echo ✅ Removed all .txt files
echo ✅ Removed FRONTEND.zip and microservice-integration.js
echo ✅ Updated .gitignore
echo ✅ Kept essential files: start.bat, quick_start.bat, START_BACKEND.bat
echo.
echo NEXT STEPS:
echo.
echo 1. Review changes: git status
echo 2. Check what will be removed: git diff --cached
echo 3. If everything looks good:
echo    git commit -m "Remove temporary files (.bat, .txt, etc.)"
echo 4. Push when ready: git push
echo.
echo IMPORTANT: The essential .bat files (start.bat, etc.) 
echo are still available for use!
echo.
pause

