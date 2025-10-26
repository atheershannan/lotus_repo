# Corporate Learning Assistant - Deployment Configuration

## 🚀 Production Deployment Guide

This guide covers deploying the Corporate Learning Assistant to production environments.

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ with pgvector extension
- Supabase account
- OpenAI API key
- Domain name and SSL certificate
- Server with Docker support (optional)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   Load Balancer │    │   Redis Cache   │
│   (Vercel)      │    │   (Nginx)       │    │   (Optional)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Environment Setup

### 1. Backend Environment Variables

Create `.env` file in the BACKEND directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/corporate_learning_assistant?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Server
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"

# Security
JWT_SECRET="your-jwt-secret-key"
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"
```

### 2. Frontend Environment Variables

Create `.env` file in the FRONTEND directory:

```bash
# API Configuration
REACT_APP_API_URL="https://api.yourdomain.com"
REACT_APP_SUPABASE_URL="https://your-project.supabase.co"
REACT_APP_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Environment
REACT_APP_ENVIRONMENT="production"
REACT_APP_VERSION="1.0.0"

# Analytics (Optional)
REACT_APP_GA_TRACKING_ID="your-ga-tracking-id"
REACT_APP_SENTRY_DSN="your-sentry-dsn"
```

## 🐳 Docker Deployment

### 1. Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 2. Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: corporate_learning_assistant
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./DATABASE/schema:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis (Optional)
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend API
  backend:
    build: ./BACKEND
    environment:
      DATABASE_URL: postgresql://postgres:your-password@postgres:5432/corporate_learning_assistant?schema=public
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build: ./FRONTEND
    ports:
      - "80:80"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_data:
```

## ☁️ Cloud Deployment

### 1. AWS Deployment

#### Using AWS ECS with Fargate

```yaml
# aws-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: corporate-learning-assistant
spec:
  replicas: 3
  selector:
    matchLabels:
      app: corporate-learning-assistant
  template:
    metadata:
      labels:
        app: corporate-learning-assistant
    spec:
      containers:
      - name: backend
        image: your-registry/corporate-learning-assistant-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secret
              key: openai
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Using AWS RDS for PostgreSQL

```bash
# Create RDS instance with pgvector
aws rds create-db-instance \
  --db-instance-identifier corporate-learning-assistant \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345678 \
  --db-subnet-group-name your-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted
```

### 2. Google Cloud Platform

#### Using Cloud Run

```yaml
# cloud-run.yml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: corporate-learning-assistant
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 100
      containers:
      - image: gcr.io/your-project/corporate-learning-assistant-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          limits:
            cpu: "1000m"
            memory: "1Gi"
          requests:
            cpu: "500m"
            memory: "512Mi"
```

### 3. Azure Deployment

#### Using Azure Container Instances

```yaml
# azure-deployment.yml
apiVersion: 2021-07-01
kind: ContainerGroup
properties:
  containers:
  - name: corporate-learning-assistant-backend
    properties:
      image: your-registry/corporate-learning-assistant-backend:latest
      ports:
      - port: 3001
        protocol: TCP
      environmentVariables:
      - name: DATABASE_URL
        secureValue: "postgresql://..."
      - name: OPENAI_API_KEY
        secureValue: "sk-..."
      resources:
        requests:
          cpu: 1
          memoryInGb: 1
  osType: Linux
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
    - protocol: TCP
      port: 3001
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # API proxy
    location /api/ {
        proxy_pass http://backend:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 2. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3001/tcp
sudo ufw enable

# iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 3001 -j DROP
```

## 📊 Monitoring and Logging

### 1. Application Monitoring

```javascript
// monitoring.js
const prometheus = require('prom-client');
const winston = require('winston');

// Prometheus metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Winston logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});

module.exports = {
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
  logger
};
```

### 2. Health Checks

```javascript
// health.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

async function healthCheck() {
  const checks = {
    database: false,
    openai: false,
    supabase: false,
    redis: false
  };

  try {
    // Database check
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // OpenAI check
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      timeout: 5000
    });
    checks.openai = response.status === 200;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
  }

  try {
    // Supabase check
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: { 'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY },
      timeout: 5000
    });
    checks.supabase = response.status === 200;
  } catch (error) {
    console.error('Supabase health check failed:', error);
  }

  return {
    status: Object.values(checks).every(check => check) ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}

module.exports = { healthCheck };
```

## 🚀 Deployment Scripts

### 1. Production Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Deploying Corporate Learning Assistant to Production"

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required but not installed"
    exit 1
fi

# Build images
echo "📦 Building Docker images..."
docker-compose build

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose run --rm backend npx prisma migrate deploy

# Seed database
echo "🌱 Seeding database..."
docker-compose run --rm backend npm run db:seed

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Run health checks
echo "🏥 Running health checks..."
docker-compose exec backend curl -f http://localhost:3001/health || exit 1
docker-compose exec frontend curl -f http://localhost:80 || exit 1

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: http://localhost:80"
echo "🔌 Backend API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
```

### 2. Rollback Script

```bash
#!/bin/bash
# rollback.sh

set -e

echo "🔄 Rolling back Corporate Learning Assistant"

# Stop current services
echo "🛑 Stopping current services..."
docker-compose down

# Restore previous version
echo "📦 Restoring previous version..."
docker-compose -f docker-compose.previous.yml up -d

# Verify rollback
echo "✅ Verifying rollback..."
sleep 10
docker-compose exec backend curl -f http://localhost:3001/health || exit 1

echo "✅ Rollback completed successfully!"
```

## 📈 Performance Optimization

### 1. Database Optimization

```sql
-- Enable connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '64MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';

-- Optimize for vector operations
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Reload configuration
SELECT pg_reload_conf();
```

### 2. Application Optimization

```javascript
// app.js
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(compression());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

app.use(async (req, res, next) => {
  if (req.method === 'GET') {
    const cached = await client.get(req.originalUrl);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  }
  next();
});
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   docker-compose exec backend npx prisma db push
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   docker stats
   ```

3. **SSL Certificate Issues**
   ```bash
   # Test SSL configuration
   openssl s_client -connect yourdomain.com:443
   ```

4. **API Rate Limiting**
   ```bash
   # Check rate limit headers
   curl -I http://localhost:3001/api/health
   ```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Built with ❤️ for corporate learning excellence**


