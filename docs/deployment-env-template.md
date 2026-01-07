# Production Environment Variables Template

Copy these variables and configure values in Vercel (frontend) and Railway (backend) dashboards.
**NEVER commit actual production values to the repository.**

## Frontend Environment Variables (Vercel)

**Note:** Frontend variables must use `VITE_*` prefix for Vite to expose them.

- `VITE_API_URL` - Backend API URL (e.g., `https://api.adaptive-italian-audio.railway.app`)
- `VITE_APP_NAME` - Application name (e.g., `Adaptive Italian Audio`)

## Backend Environment Variables (Railway)

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (Railway provides this automatically if using Railway PostgreSQL)

### Server Configuration
- `NODE_ENV` - Environment (set to `production`)
- `PORT` - Server port (Railway may set this automatically, default: 3001)

### External Service API Keys (Epic 2+)
- `OPENAI_API_KEY` - OpenAI API key for Italian content generation
- `GOOGLE_CLOUD_TTS_CREDENTIALS` - Google Cloud TTS service account JSON (string or path)
- `AWS_ACCESS_KEY_ID` - AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name
- `AWS_REGION` - AWS region (e.g., `us-east-1`)

### Redis Configuration (if using Railway Redis)
- `REDIS_URL` - Redis connection URL

## GitHub Actions Secrets Required

These secrets must be configured in GitHub repository settings (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `RAILWAY_TOKEN` - Railway authentication token
- `RAILWAY_SERVICE_ID` - Railway service ID (optional, if using Railway CLI)
- `RAILWAY_API_URL` - Railway API endpoint URL (for health checks, e.g., `https://api.adaptive-italian-audio.railway.app`)
