@echo off
REM Corporate Learning Assistant - Windows Startup Script
REM This script helps you start the Corporate Learning Assistant system

echo 🚀 Corporate Learning Assistant - Startup Script
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Function to install backend dependencies
:install_backend
echo 📦 Installing Backend dependencies...
cd BACKEND
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully
cd ..
goto :eof

REM Function to install frontend dependencies
:install_frontend
echo 📦 Installing Frontend dependencies...
cd FRONTEND
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully
cd ..
goto :eof

REM Function to setup database
:setup_database
echo 🗄️ Setting up database...
cd BACKEND

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Please create it from env.example
    echo 📝 Copy env.example to .env and configure your settings:
    echo    copy env.example .env
    echo    # Edit .env with your database and API keys
    cd ..
    goto :eof
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate

REM Run migrations
echo 📊 Running database migrations...
call npx prisma migrate dev --name init

REM Seed database
echo 🌱 Seeding database...
call npm run db:seed

cd ..
echo ✅ Database setup completed
goto :eof

REM Function to start backend
:start_backend
echo 🚀 Starting Backend server...
cd BACKEND
start "Backend Server" cmd /k "npm run dev"
cd ..
echo ✅ Backend started
goto :eof

REM Function to start frontend
:start_frontend
echo 🚀 Starting Frontend server...
cd FRONTEND
start "Frontend Server" cmd /k "npm start"
cd ..
echo ✅ Frontend started
goto :eof

REM Function to check if services are running
:check_services
echo 🔍 Checking if services are running...
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check backend
curl -f http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running at http://localhost:3001
) else (
    echo ❌ Backend is not responding
)

REM Check frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running at http://localhost:3000
) else (
    echo ❌ Frontend is not responding
)
goto :eof

REM Main script logic
if "%1"=="install" (
    call :install_backend
    call :install_frontend
    echo 🎉 All dependencies installed successfully!
    goto :end
)

if "%1"=="setup" (
    call :setup_database
    goto :end
)

if "%1"=="start" (
    call :start_backend
    call :start_frontend
    call :check_services
    echo 🎉 Corporate Learning Assistant is running!
    echo 🌐 Frontend: http://localhost:3000
    echo 🔌 Backend API: http://localhost:3001
    echo 🏥 Health Check: http://localhost:3001/health
    goto :end
)

if "%1"=="backend" (
    call :start_backend
    echo 🔌 Backend API: http://localhost:3001
    goto :end
)

if "%1"=="frontend" (
    call :start_frontend
    echo 🌐 Frontend: http://localhost:3000
    goto :end
)

if "%1"=="check" (
    call :check_services
    goto :end
)

if "%1"=="help" (
    echo Usage: %0 [OPTIONS]
    echo.
    echo Options:
    echo   install     Install all dependencies
    echo   setup       Setup database
    echo   start       Start all services
    echo   backend     Start only backend
    echo   frontend    Start only frontend
    echo   check       Check if services are running
    echo   help        Show this help message
    echo.
    echo Examples:
    echo   %0 install    # Install dependencies
    echo   %0 setup      # Setup database
    echo   %0 start      # Start all services
    goto :end
)

echo ❌ Unknown option: %1
echo Usage: %0 [install^|setup^|start^|backend^|frontend^|check^|help]
goto :end

:end
echo.
echo 📚 For more information, see:
echo    - BACKEND/README.md
echo    - FRONTEND/README.md
echo    - IMPLEMENTATION_COMPLETE.md
pause


