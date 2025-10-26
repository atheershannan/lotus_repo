#!/bin/bash

# Corporate Learning Assistant - Startup Script
# This script helps you start the Corporate Learning Assistant system

echo "🚀 Corporate Learning Assistant - Startup Script"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Function to install backend dependencies
install_backend() {
    echo "📦 Installing Backend dependencies..."
    cd BACKEND
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully"
    else
        echo "❌ Failed to install Backend dependencies"
        exit 1
    fi
    cd ..
}

# Function to install frontend dependencies
install_frontend() {
    echo "📦 Installing Frontend dependencies..."
    cd FRONTEND
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed successfully"
    else
        echo "❌ Failed to install Frontend dependencies"
        exit 1
    fi
    cd ..
}

# Function to setup database
setup_database() {
    echo "🗄️ Setting up database..."
    cd BACKEND
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        echo "⚠️  .env file not found. Please create it from env.example"
        echo "📝 Copy env.example to .env and configure your settings:"
        echo "   cp env.example .env"
        echo "   # Edit .env with your database and API keys"
        return 1
    fi
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    echo "📊 Running database migrations..."
    npx prisma migrate dev --name init
    
    # Seed database
    echo "🌱 Seeding database..."
    npm run db:seed
    
    cd ..
    echo "✅ Database setup completed"
}

# Function to start backend
start_backend() {
    echo "🚀 Starting Backend server..."
    cd BACKEND
    npm run dev &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🚀 Starting Frontend server..."
    cd FRONTEND
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
    cd ..
}

# Function to check if services are running
check_services() {
    echo "🔍 Checking if services are running..."
    
    # Wait a bit for services to start
    sleep 5
    
    # Check backend
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend is running at http://localhost:3001"
    else
        echo "❌ Backend is not responding"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is running at http://localhost:3000"
    else
        echo "❌ Frontend is not responding"
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  install     Install all dependencies"
    echo "  setup       Setup database"
    echo "  start       Start all services"
    echo "  backend     Start only backend"
    echo "  frontend    Start only frontend"
    echo "  check       Check if services are running"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 setup      # Setup database"
    echo "  $0 start      # Start all services"
}

# Main script logic
case "$1" in
    "install")
        install_backend
        install_frontend
        echo "🎉 All dependencies installed successfully!"
        ;;
    "setup")
        setup_database
        ;;
    "start")
        start_backend
        start_frontend
        check_services
        echo "🎉 Corporate Learning Assistant is running!"
        echo "🌐 Frontend: http://localhost:3000"
        echo "🔌 Backend API: http://localhost:3001"
        echo "🏥 Health Check: http://localhost:3001/health"
        ;;
    "backend")
        start_backend
        echo "🔌 Backend API: http://localhost:3001"
        ;;
    "frontend")
        start_frontend
        echo "🌐 Frontend: http://localhost:3000"
        ;;
    "check")
        check_services
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_help
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, see:"
echo "   - BACKEND/README.md"
echo "   - FRONTEND/README.md"
echo "   - IMPLEMENTATION_COMPLETE.md"


