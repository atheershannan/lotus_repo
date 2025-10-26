#!/bin/bash

# Quick Start Script with Mock Data
# This script helps you quickly start the system with all mock data loaded

echo "🚀 Corporate Learning Assistant - Quick Start"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites met${NC}"
}

# Setup environment
setup_environment() {
    echo "⚙️  Setting up environment..."
    
    # Check if .env files exist
    if [ ! -f BACKEND/.env ]; then
        echo -e "${YELLOW}⚠️  BACKEND/.env not found, using defaults${NC}"
        echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/corporate_learning_assistant\"" > BACKEND/.env
        echo "OPENAI_API_KEY=\"sk-mock-key\"" >> BACKEND/.env
        echo "PORT=3001" >> BACKEND/.env
        echo "NODE_ENV=development" >> BACKEND/.env
    fi
    
    if [ ! -f FRONTEND/.env ]; then
        echo -e "${YELLOW}⚠️  FRONTEND/.env not found, using defaults${NC}"
        echo "REACT_APP_API_URL=http://localhost:3001/api" > FRONTEND/.env
    fi
    
    echo -e "${GREEN}✅ Environment configured${NC}"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    cd BACKEND
    npm install &> /dev/null
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    cd ..
    
    cd FRONTEND
    npm install &> /dev/null
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    cd ..
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    cd BACKEND
    
    # Generate Prisma client
    npx prisma generate &> /dev/null
    echo -e "${GREEN}✅ Prisma client generated${NC}"
    
    # Run migrations
    npx prisma migrate dev --name init &> /dev/null
    echo -e "${GREEN}✅ Database migrated${NC}"
    
    # Seed database
    npm run db:seed &> /dev/null
    echo -e "${GREEN}✅ Mock data seeded${NC}"
    
    cd ..
}

# Start services
start_services() {
    echo "🚀 Starting services..."
    
    cd BACKEND
    npm run dev > /dev/null 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    cd ..
    
    sleep 3
    
    cd FRONTEND
    npm start > /dev/null 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    cd ..
    
    echo ""
    echo "=============================================="
    echo -e "${GREEN}🎉 Corporate Learning Assistant is running!${NC}"
    echo "=============================================="
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔌 Backend API: http://localhost:3001"
    echo "🏥 Health Check: http://localhost:3001/health"
    echo ""
    echo "📊 Mock Data Loaded:"
    echo "   - 4 Users (learner, hr_manager, trainer, admin)"
    echo "   - 6 Skills (JavaScript, React, Node.js, etc.)"
    echo "   - 6 Content Items (courses, lessons, workshops)"
    echo "   - Sample progress, chat messages, and analytics"
    echo ""
    echo "Press Ctrl+C to stop all services"
    echo ""
    
    # Wait for interrupt
    trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
}

# Main execution
main() {
    check_prerequisites
    setup_environment
    install_dependencies
    setup_database
    start_services
}

main


