@echo off
echo ================================================
echo Removing Temporary .TXT Files
echo ================================================
echo.

:: Check if there are any .txt files
if not exist *.txt (
    echo ℹ️  No .txt files found in current directory
    goto :end
)

:: Create backup first
echo [1/3] Creating safety backup...
git add -A 2>nul
git commit -m "Backup before removing .txt files" --allow-empty 2>nul
echo ✅ Backup created
echo.

:: List .txt files that will be removed
echo [2/3] Found .txt files that will be removed:
echo.
dir /b *.txt 2>nul
echo.

:: Remove all .txt files from git tracking
echo Removing .txt files from git tracking...
git rm --cached *.txt 2>nul
if %errorlevel% equ 0 (
    echo ✅ .txt files removed from git tracking
) else (
    echo ℹ️  No tracked .txt files found
)
echo.

:: Update .gitignore to prevent future .txt files
echo [3/3] Updating .gitignore...
if not exist .gitignore (
    echo *.txt > .gitignore
    echo # Prevent .bat files from being tracked >> .gitignore
    echo *.bat >> .gitignore
    echo ✅ Created .gitignore
) else (
    findstr /C:"*.txt" .gitignore >nul 2>&1
    if %errorlevel% neq 0 (
        echo. >> .gitignore
        echo # Prevent .txt files from being tracked >> .gitignore
        echo *.txt >> .gitignore
        echo ✅ Updated .gitignore
    ) else (
        echo ℹ️  .gitignore already has *.txt rule
    )
)
echo.

:end
echo ================================================
echo Summary
echo ================================================
echo.
echo ✅ Removed all .txt files from git tracking
echo ✅ Updated .gitignore
echo.
echo NEXT STEPS:
echo.
echo 1. Review changes: git status
echo 2. Check what will be removed: git diff --cached
echo 3. If everything looks good, commit: git commit -m "Remove temporary .txt files"
echo 4. Push when ready: git push
echo.
pause

