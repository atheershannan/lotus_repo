@echo off
echo Cleaning git history...

git filter-branch --force --index-filter "git rm --cached --ignore-unmatch FRONTEND.zip" --prune-empty --tag-name-filter cat -- --all

git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

git add .
git commit -m "Clean git history - remove FRONTEND.zip"
git push origin main --force

echo Done! Try pushing again.
pause

