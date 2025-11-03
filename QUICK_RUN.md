# 🚀 Quick Run Instructions - Corporate Learning Assistant

## ⚡ Fastest Way to Run

### Option 1: Using WSL Bash (Recommended)
```bash
# Open WSL Bash terminal
cd /mnt/c/Users/athee/Desktop/lotus/curser_repo/lotus_repo/BACKEND
npx prisma generate
npm run dev
```

### Option 2: Fix PowerShell First
```powershell
# Run as Administrator in PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run
cd C:\Users\athee\Desktop\lotus\curser_repo\lotus_repo\BACKEND
npx prisma generate
npm run dev
```

### Option 3: Use Regular cmd.exe
```cmd
cd C:\Users\athee\Desktop\lotus\curser_repo\lotus_repo\BACKEND
npx prisma generate
npm run dev
```

## 📝 Make Sure .env File Exists

Create `BACKEND/.env` with:
```
USE_MOCK_DATA=true
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

## 🎯 After Backend Starts

Open a NEW terminal and run Frontend:
```bash
cd FRONTEND
npm install
npm start
```

## 🌐 Access the App
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Health Check: http://localhost:3001/health

