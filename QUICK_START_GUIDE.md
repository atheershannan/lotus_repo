# 🚀 Corporate Learning Assistant - Quick Start Guide

## 📋 Prerequisites

Before running the system, make sure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **PostgreSQL** database (or Supabase account)
- **OpenAI API key**

## 🛠️ Setup Instructions

### 1. Environment Configuration

#### Backend Environment (.env)
```bash
# Copy the example file
cp BACKEND/env.example BACKEND/.env

# Edit BACKEND/.env with your settings:
DATABASE_URL="postgresql://username:password@localhost:5432/corporate_learning_assistant"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
OPENAI_API_KEY="sk-your-openai-api-key"
```

#### Frontend Environment (.env)
```bash
# Copy the example file
cp FRONTEND/env.example FRONTEND/.env

# Edit FRONTEND/.env with your settings:
REACT_APP_API_URL="http://localhost:3001/api"
REACT_APP_SUPABASE_URL="https://your-project.supabase.co"
REACT_APP_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL
# Create database
createdb corporate_learning_assistant

# Run migrations
cd BACKEND
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

#### Option B: Supabase (Recommended)
1. Create a new Supabase project
2. Get your project URL and API keys
3. Update your .env files with Supabase credentials
4. Run migrations in Supabase SQL editor

### 3. Install Dependencies

#### Using the startup script (Recommended)
```bash
# Windows
start.bat install

# Linux/Mac
chmod +x start.sh
./start.sh install
```

#### Manual installation
```bash
# Backend
cd BACKEND
npm install

# Frontend
cd FRONTEND
npm install
```

## 🚀 Running the System

### Quick Start
```bash
# Windows
start.bat start

# Linux/Mac
./start.sh start
```

### Manual Start

#### Terminal 1 - Backend
```bash
cd BACKEND
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd FRONTEND
npm start
```

## 🌐 Access Points

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api/docs

## 🔧 Development Commands

### Backend Commands
```bash
cd BACKEND

# Development
npm run dev          # Start development server
npm run start        # Start production server

# Database
npm run db:migrate   # Run migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Frontend Commands
```bash
cd FRONTEND

# Development
npm start            # Start development server
npm run build        # Build for production

# Testing
npm test             # Run tests
npm run test:e2e     # Run E2E tests

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 3000
npx kill-port 3000

# Kill process using port 3001
npx kill-port 3001
```

#### 2. Database Connection Issues
- Check your DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify database credentials

#### 3. OpenAI API Issues
- Verify your OpenAI API key
- Check API key permissions
- Ensure you have sufficient credits

#### 4. Supabase Issues
- Verify Supabase project URL
- Check service role key permissions
- Ensure RLS policies are configured

### Logs and Debugging

#### Backend Logs
```bash
cd BACKEND
# Logs are saved to logs/ directory
tail -f logs/combined.log
tail -f logs/error.log
```

#### Frontend Debugging
- Open browser DevTools
- Check Network tab for API calls
- Check Console for errors

## 📊 Monitoring

### Health Checks
```bash
# Check backend health
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000
```

### Performance Monitoring
- Backend: Winston logs
- Frontend: React DevTools
- Database: Prisma Studio

## 🔒 Security

### Environment Variables
- Never commit .env files
- Use different keys for development/production
- Rotate API keys regularly

### Database Security
- Enable RLS in Supabase
- Use strong passwords
- Limit database access

## 📚 Additional Resources

- [Backend README](BACKEND/README.md)
- [Frontend README](FRONTEND/README.md)
- [Database Documentation](DATABASE/README.md)
- [Implementation Guide](IMPLEMENTATION_COMPLETE.md)

## 🆘 Support

If you encounter issues:

1. Check the logs
2. Verify environment variables
3. Check database connection
4. Review API documentation
5. Check GitHub issues

---

**Happy coding! 🎉**


