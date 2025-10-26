@echo off
REM Quick Start Script with Mock Data for Windows

echo 🚀 Corporate Learning Assistant - Quick Start
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

echo ✅ Prerequisites met

REM Setup environment
echo ⚙️  Setting up environment...

if not exist BACKEND\.env (
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/corporate_learning_assistant> BACKEND\.env
    echo OPENAI_API_KEY=sk-mock-key>> BACKEND\.env
    echo PORT=3001>> BACKEND\.env
    echo NODE_ENV=development>> BACKEND\.env
)

if not exist FRONTEND\.env (
    echo REACT_APP_API_URL=http://localhost:3001/api> FRONTEND\.env
)

echo ✅ Environment configured

REM Install dependencies
echo 📦 Installing dependencies...

cd BACKEND
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..

cd FRONTEND
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..

REM Setup database
echo 🗄️  Setting up database...
cd BACKEND

REM Generate Prisma client
call npx prisma generate
echo ✅ Prisma client generated

REM Run migrations
call npx prisma migrate dev --name init
echo ✅ Database migrated

REM Seed database
call npm run db:seed
echo ✅ Mock data seeded
cd ..

REM Start services
echo 🚀 Starting services...

cd BACKEND
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo ✅ Backend started
cd ..

cd FRONTEND
start "Frontend Server" cmd /k "npm start"
echo ✅ Frontend started
cd ..

echo.
echo ==============================================
echo 🎉 Corporate Learning Assistant is running!
echo ==============================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend API: http://localhost:3001
echo 🏥 Health Check: http://localhost:3001/health
echo.
echo 📊 Mock Data Loaded:
echo    - 4 Users (learner, hr_manager, trainer, admin)
echo    - 6 Skills (JavaScript, React, Node.js, etc.)
echo    - 6 Content Items (courses, lessons, workshops)
echo    - Sample progress, chat messages, and analytics
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000
pause


