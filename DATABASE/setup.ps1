# Corporate Learning Assistant - Database Setup Script
# PowerShell Script for Windows

Write-Host "🚀 Corporate Learning Assistant - Database Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Get DATABASE_URL
$DATABASE_URL = Read-Host "Enter DATABASE_URL (e.g., postgresql://postgres:password@localhost:5432/corporate_learning)"

# Check if psql is installed
try {
    $psqlVersion = psql --version 2>$null
    Write-Host "✅ PostgreSQL client found: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL client (psql) not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or add psql to PATH" -ForegroundColor Yellow
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Check if schema files exist
if (-not (Test-Path ".\schema\01_core_tables.sql")) {
    Write-Host "❌ Schema file not found: .\schema\01_core_tables.sql" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".\schema\02_vector_tables.sql")) {
    Write-Host "❌ Schema file not found: .\schema\02_vector_tables.sql" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Step 1: Creating core tables..." -ForegroundColor Yellow
psql $DATABASE_URL -f ".\schema\01_core_tables.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create core tables!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Core tables created successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Step 2: Creating vector tables..." -ForegroundColor Yellow
psql $DATABASE_URL -f ".\schema\02_vector_tables.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create vector tables!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Vector tables created successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Step 3: Verifying installation..." -ForegroundColor Yellow
$query = @"
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
"@

$tables = psql $DATABASE_URL -t -c $query

Write-Host ""
Write-Host "📊 Tables created:" -ForegroundColor Cyan
Write-Host $tables

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add DATABASE_URL to your .env file in BACKEND folder"
Write-Host "2. Run: npm run db:seed (to add sample data)"
Write-Host "3. Run: npm run dev (to start the backend)"
Write-Host ""

