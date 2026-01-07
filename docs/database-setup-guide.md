# Database Setup Guide

This guide covers PostgreSQL database provisioning for both local development and production (Railway) environments.

## Local Development Setup

### Prerequisites
- PostgreSQL 15+ installed locally
- PostgreSQL service running

### Setup Steps

1. **Install PostgreSQL** (if not already installed):
   - **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql@15`
   - **Linux**: `sudo apt-get install postgresql-15` (Ubuntu/Debian)

2. **Start PostgreSQL Service**:
   - **Windows**: Start PostgreSQL service from Services
   - **macOS**: `brew services start postgresql@15`
   - **Linux**: `sudo systemctl start postgresql`

3. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE adaptive_italian_audio;

   # Create user (optional, can use postgres user for development)
   CREATE USER adaptive_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE adaptive_italian_audio TO adaptive_user;
   ```

4. **Verify Database Access**:
   ```bash
   psql -U postgres -d adaptive_italian_audio
   # Or with custom user
   psql -U adaptive_user -d adaptive_italian_audio
   ```

### Local Connection Parameters

For local development, use these connection parameters:

- **Host**: `localhost`
- **Port**: `5432` (default PostgreSQL port)
- **Database**: `adaptive_italian_audio`
- **Username**: `postgres` (or your custom user)
- **Password**: Your PostgreSQL password

**Connection String Format:**
```
postgresql://postgres:password@localhost:5432/adaptive_italian_audio
```

## Railway Production Setup

### Provisioning Database on Railway

1. **Create Railway Account**:
   - Sign up at [railway.app](https://railway.app)
   - Create a new project

2. **Add PostgreSQL Service**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provision a PostgreSQL 15+ instance

3. **Get Connection Details**:
   - Railway provides connection details in the service dashboard
   - Connection string is available in the "Connect" tab
   - Note: Railway uses SSL by default

### Railway Connection Parameters

Railway provides connection details in the service dashboard:
- **Host**: Provided by Railway (e.g., `containers-us-west-xxx.railway.app`)
- **Port**: Usually `5432`
- **Database**: Provided by Railway
- **Username**: Provided by Railway
- **Password**: Provided by Railway
- **SSL**: Required (set `DB_SSL=true`)

**Connection String Format:**
```
postgresql://username:password@host:port/database?sslmode=require
```

## Environment Variables

Configure these environment variables in your `.env` file:

### Option 1: Full Connection String (Recommended)
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

### Option 2: Individual Parameters
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adaptive_italian_audio
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false  # true for Railway/production
```

## Verification

After provisioning, verify database is accessible:

1. **Test Connection**:
   ```bash
   psql $DATABASE_URL
   # Or with individual parameters
   psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
   ```

2. **Check PostgreSQL Version**:
   ```sql
   SELECT version();
   -- Should show PostgreSQL 15.x or higher
   ```

## Next Steps

After database provisioning:
1. Configure database connection in backend (Task 3)
2. Set up migration system (Task 6)
3. Deploy initial schema (Task 7)

## Troubleshooting

### Connection Refused
- Verify PostgreSQL service is running
- Check firewall settings
- Verify host and port are correct

### Authentication Failed
- Verify username and password
- Check pg_hba.conf for authentication settings
- Ensure user has proper permissions

### SSL Connection Required (Railway)
- Set `DB_SSL=true` in environment variables
- Use `?sslmode=require` in connection string
