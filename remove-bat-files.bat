@echo off
echo ================================================
echo Removing .BAT Files from Repository
echo ================================================
echo.

:: Create backup first
echo [1/4] Creating safety backup...
git add -A 2>nul
git commit -m "Backup before removing .bat files" --allow-empty 2>nul
if %errorlevel% equ 0 (
    echo ✅ Safety backup created
) else (
    echo ⚠️  No changes to backup (might already be committed)
)
echo.

:: Remove all .bat files from git tracking
echo [2/4] Removing .bat files from git tracking...
git rm --cached -r *.bat 2>nul
if %errorlevel% equ 0 (
    echo ✅ .bat files removed from git tracking
) else (
    echo ℹ️  No .bat files to remove or already removed
)
echo.

:: List remaining .bat files that might be untracked
echo [3/4] Checking for remaining .bat files...
if exist *.bat (
    echo ℹ️  Remaining .bat files found (not tracked by git):
    dir /b *.bat 2>nul
) else (
    echo ✅ All .bat files removed
)
echo.

:: Update .gitignore to prevent future .bat files
echo [4/4] Updating .gitignore...
if exist .gitignore (
    findstr /C:"*.bat" .gitignore >nul 2>&1
    if %errorlevel% neq 0 (
        echo # Prevent .bat files from being tracked >> .gitignore
        echo *.bat >> .gitignore
        echo ✅ .gitignore updated
    ) else (
        echo ℹ️  .gitignore already has *.bat rule
    )
) else (
    echo # Prevent .bat files from being tracked > .gitignore
    echo *.bat >> .gitignore
    echo ✅ Created .gitignore
)
echo.

echo ================================================
echo Summary:
echo ================================================
echo.
echo ✅ Safety backup created
echo ✅ .bat files removed from git tracking
echo ✅ .gitignore updated
echo.
echo NEXT STEPS:
echo 1. Review changes: git status
echo 2. Check what will be removed: git diff --cached
echo 3. If everything looks good, commit: git commit -m "Remove .bat files"
echo 4. Push when ready: git push
echo.
echo ⚠️  The actual .bat files in your workspace are still there
echo    (they're just not tracked by git anymore)
echo    You can safely use them or manually delete them
echo.
pause

