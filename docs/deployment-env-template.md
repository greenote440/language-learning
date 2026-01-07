# Production Environment Variables Template

Copy these variables and configure values in Vercel (frontend) and Railway (backend) dashboards.
**NEVER commit actual production values to the repository.**

## Frontend Environment Variables (Vercel)

**Note:** Frontend variables must use `VITE_*` prefix for Vite to expose them.

- `VITE_API_URL` - Backend API URL (e.g., `https://api.adaptive-italian-audio.railway.app`)
- `VITE_APP_NAME` - Application name (e.g., `Adaptive Italian Audio`)

## Backend Environment Variables (Render)

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (Render provides this automatically if using Render PostgreSQL, or configure manually)

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

### Redis Configuration (if using Render Redis or external Redis)
- `REDIS_URL` - Redis connection URL

## GitHub Actions Secrets Required

These secrets must be configured in GitHub repository settings (Settings → Secrets and variables → Actions):

**Vercel Secrets:**
- `VERCEL_TOKEN` - Vercel authentication token (get from Vercel dashboard → Settings → Tokens)
- `VERCEL_ORG_ID` - Vercel organization ID (found in Vercel project settings)
- `VERCEL_PROJECT_ID` - Vercel project ID (found in Vercel project settings)
- `VERCEL_DEPLOYMENT_URL` - Production deployment URL (optional, for health checks)

**Render Secrets:**
- `RENDER_API_KEY` - Render API key (generate in Render dashboard → Account Settings → API Keys)
- `RENDER_SERVICE_ID` - Render service ID (found in Render service URL, starts with `srv-`)
- `RENDER_API_URL` - Render API endpoint URL (for health checks, e.g., `https://adaptive-italian-audio-api.onrender.com`)
