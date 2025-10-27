@echo off
echo Removing FRONTEND.zip from git...

git rm --cached FRONTEND.zip
git add .gitignore
git commit -m "Remove large FRONTEND.zip file"
git push origin main

echo Done!
pause

