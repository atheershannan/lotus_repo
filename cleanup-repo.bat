@echo off
echo ========================================
echo Cleaning Repository - Removing Unnecessary Files
echo ========================================
echo.

:: Step 1: Create backup branch
echo [1/5] Creating backup branch...
git checkout -b backup-before-cleanup 2>nul
if %errorlevel% equ 0 (
    echo Backup branch created successfully.
    git checkout main
) else (
    echo Backup branch already exists or already on it.
)

echo.
echo [2/5] Removing .bat files...
git rm --cached -r *.bat
if %errorlevel% equ 0 (
    echo Batch files removed from git tracking.
) else (
    echo No .bat files to remove or already removed.
)

echo.
echo [3/5] Removing .sh files...
git rm --cached -r *.sh
if %errorlevel% equ 0 (
    echo Shell files removed from git tracking.
) else (
    echo No .sh files to remove or already removed.
)

echo.
echo [4/5] Removing .txt instruction files...
git rm --cached DEPLOY_COMMANDS.txt DEPLOY_NOW.txt GIT_FIX_COMMANDS.txt 2>nul
git rm --cached NO_LOGIN_JUST_CHATBOT.txt PUSH_AND_DEPLOY.txt PUSH_COMMANDS.txt 2>nul
git rm --cached PUSH_DOCKERFIX.txt PUSH_FINAL.txt PUSH_OPENSSL_FIX.txt 2>nul
git rm --cached PUSH_TO_GITHUB.txt RAILWAY_FIX.txt RAILWAY_URL.txt 2>nul
git rm --cached SIMPLE_FIX.txt VERCEL_ENV_SETUP.txt VERCEL_SETTINGS.txt 2>nul
git rm --cached WHERE_TO_UPDATE.txt 2>nul
echo Text files removed from git tracking.

echo.
echo [5/5] Removing temporary folders and files...
git rm --cached -r FULLSTACK_TEMPLATES/ contextual-corporate-assistant/ 2>nul
git rm --cached FRONTEND.zip microservice-integration.js 2>nul

:: Remove logs folders (not tracked by git)
if exist logs\ (
    echo Removing logs folder...
    rmdir /s /q logs\
)

if exist FRONTEND\coverage\ (
    echo Removing frontend coverage...
    rmdir /s /q FRONTEND\coverage\
)

if exist BACKEND\logs\ (
    echo Removing backend logs...
    rmdir /s /q BACKEND\logs\
)

echo.
echo ========================================
echo Cleanup Summary:
echo ========================================
echo.
echo Files removed from git tracking.
echo Local files in logs and coverage folders deleted.
echo.
echo NEXT STEPS:
echo 1. Review the changes: git status
echo 2. Check staged changes: git diff --cached
echo 3. Remove .md files manually using: git rm FILENAME.md
echo 4. Commit changes: git commit -m "Clean: Remove temporary files"
echo.
echo For detailed list of files to remove, see FILES_TO_CLEAN.md
echo.
pause

