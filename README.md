# Adaptive Italian Audio for Accelerated Acquisition

An adaptive Italian language learning platform that delivers personalized, model-driven audio content to accelerate natural language acquisition through comprehensible input.

## Project Overview

This project operationalizes a foundation language acquisition model to generate personalized Italian audio content (narratives, podcasts, educational content) that automatically adapts to each learner's comprehension level. Users consume compelling Italian stories through a lean-back audio experience designed to sustain 30+ minute listening sessions.

**Key Goals:**
- Deliver 50+ hours of comprehensible input within 6 months
- Achieve 40%+ 30-day user retention
- Operate within free-tier API limits for MVP scale
- Validate foundation model operationalization in software

## Project Structure

This project uses a **Turborepo monorepo** structure for efficient code sharing and unified dependency management.

```
adaptive-italian-audio/
├── .github/
│   └── workflows/
│       └── ci.yaml                 # CI pipeline
├── apps/
│   ├── web/                        # React frontend application
│   └── api/                        # Express backend application
├── packages/
│   ├── shared/                     # Shared TypeScript types and utilities
│   ├── model-service/              # Foundation language acquisition model
│   └── config/                     # Shared configuration (ESLint, TypeScript)
├── docs/                           # Documentation (PRD, architecture, stories)
├── package.json                    # Root package.json
├── pnpm-workspace.yaml             # pnpm workspace configuration
├── turbo.json                      # Turborepo configuration
└── README.md                       # This file
```

For detailed project structure, see [docs/architecture/unified-project-structure.md](docs/architecture/unified-project-structure.md).

## Technology Stack

### Frontend
- **TypeScript 5.x** - Type-safe frontend development
- **React 18.x** - UI component framework
- **Vite** - Frontend bundling
- **Tailwind CSS 3.x** - Utility-first CSS framework

### Backend
- **TypeScript 5.x** - Type-safe backend development
- **Express 4.x** - RESTful API server

### Infrastructure
- **Turborepo** - Monorepo build orchestration
- **pnpm** - Package manager (required)
- **GitHub Actions** - CI/CD pipeline

For complete technology stack details, see [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md).

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 ([Installation Guide](https://pnpm.io/installation))
- **PostgreSQL** >= 15.0 (for database operations)

### Database Setup

For local development, you'll need a PostgreSQL database. See [Database Setup Guide](docs/database-setup-guide.md) for detailed instructions.

**Quick Setup:**
1. Install PostgreSQL 15+ locally
2. Create database: `CREATE DATABASE adaptive_italian_audio;`
3. Configure connection in `.env` file (see [Environment Variables](#environment-variables))

### External Service Prerequisites (for future stories)

The following services will be required in Epic 2:
- **OpenAI API** - For Italian content generation
- **Google Cloud TTS** - Primary text-to-speech service
- **Azure Cognitive Services TTS** - Fallback text-to-speech service
- **AWS S3** - Audio file storage

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd adaptive-italian-audio
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables) section).

## Development Workflow

### Running Development Servers

**Start all services:**
```bash
pnpm dev
```

**Start individual services:**
```bash
# Frontend only
pnpm --filter @adaptive-italian-audio/web dev

# Backend only
pnpm --filter @adaptive-italian-audio/api dev
```

### Building

**Build all packages:**
```bash
pnpm build
```

**Build specific package:**
```bash
pnpm --filter @adaptive-italian-audio/web build
```

### Code Quality

**Lint all packages:**
```bash
pnpm lint
```

**Type check all packages:**
```bash
pnpm type-check
```

**Format code:**
```bash
pnpm format
```

### Database Operations

**Run migrations:**
```bash
# Apply all pending migrations
pnpm --filter @adaptive-italian-audio/api migrate

# Check migration status
pnpm --filter @adaptive-italian-audio/api migrate
```

**Test database connection and schema:**
```bash
# Run database connection and schema tests
pnpm --filter @adaptive-italian-audio/api test:db
```

**Database health check:**
```bash
# Check database health via API
curl http://localhost:3001/health/db
```

### Testing

Testing frameworks will be configured in future stories. Once configured:
```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @adaptive-italian-audio/web test
```

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`. Key environment variables:

### Frontend (Vite)
- `VITE_API_URL` - Backend API endpoint URL

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### External Services (Epic 2+)
- `OPENAI_API_KEY` - OpenAI API key for content generation
- `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud project ID
- `GOOGLE_CLOUD_TTS_CREDENTIALS_PATH` - Path to service account key
- `AWS_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name for audio files

### Database
- `DATABASE_URL` - PostgreSQL connection string (preferred)
  - Format: `postgresql://username:password@host:port/database`
- OR individual parameters:
  - `DB_HOST` - Database host (default: localhost)
  - `DB_PORT` - Database port (default: 5432)
  - `DB_NAME` - Database name (default: adaptive_italian_audio)
  - `DB_USER` - Database username (default: postgres)
  - `DB_PASSWORD` - Database password
  - `DB_SSL` - SSL mode (true/false, required for Railway/production)
- Connection pool configuration:
  - `DB_POOL_MAX` - Maximum pool size (default: 20)
  - `DB_POOL_IDLE_TIMEOUT` - Idle timeout in ms (default: 30000)
  - `DB_CONNECTION_TIMEOUT` - Connection timeout in ms (default: 10000)
- Retry configuration:
  - `DB_RETRY_MAX_ATTEMPTS` - Maximum retry attempts (default: 5)
  - `DB_RETRY_INITIAL_DELAY` - Initial retry delay in ms (default: 1000)
  - `DB_RETRY_MAX_DELAY` - Maximum retry delay in ms (default: 30000)

### Redis (Future Stories)
- `REDIS_URL` - Redis connection string

**Note:** Never commit `.env` files to git. Use `.env.example` as a template.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

### CI Pipeline

The CI pipeline:

- Runs on pull requests and pushes to `main`/`develop` branches
- Executes linting (ESLint) for all packages
- Performs type checking (TypeScript) for all packages
- Builds all packages to verify compilation

See [.github/workflows/ci.yaml](.github/workflows/ci.yaml) for details.

### Deployment Pipeline

The deployment pipeline automatically deploys the application to production environments:

- **Frontend**: Deployed to Vercel on pushes to `main` branch
- **Backend**: Deployed to Railway on pushes to `main` branch

#### Deployment Workflows

- **Frontend Deployment**: [.github/workflows/deploy-frontend.yaml](.github/workflows/deploy-frontend.yaml)
- **Backend Deployment**: [.github/workflows/deploy-backend.yaml](.github/workflows/deploy-backend.yaml)

#### Deployment Process

1. **Automatic Deployment**: Deployments trigger automatically on pushes to `main` branch
2. **Manual Deployment**: Use the "Run workflow" button in GitHub Actions to trigger manual deployments
3. **Build Steps**: Each deployment includes:
   - Dependency installation (`pnpm install`)
   - Type checking
   - Build verification
   - Deployment to respective platform
   - Health check verification

#### Environment Setup

**Vercel (Frontend):**
1. Create a Vercel account and project
2. Connect GitHub repository to Vercel
3. Configure project settings:
   - Framework: Vite
   - Root Directory: `apps/lovable_web`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
4. Configure environment variables in Vercel dashboard (see [Environment Variables](#environment-variables))

**Railway (Backend):**
1. Create a Railway account and project
2. Create a new service for the backend API
3. Connect GitHub repository to Railway
4. Configure service settings:
   - Root Directory: `apps/api`
   - Build Command: `pnpm install && pnpm --filter @adaptive-italian-audio/api build`
   - Start Command: `node dist/server.js`
5. Configure environment variables in Railway dashboard (see [Environment Variables](#environment-variables))

#### GitHub Secrets Configuration

Configure the following secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

**Vercel Secrets:**
- `VERCEL_TOKEN` - Vercel authentication token (get from Vercel dashboard → Settings → Tokens)
- `VERCEL_ORG_ID` - Vercel organization ID (found in Vercel project settings)
- `VERCEL_PROJECT_ID` - Vercel project ID (found in Vercel project settings)
- `VERCEL_DEPLOYMENT_URL` - Production deployment URL (optional, for health checks)

**Railway Secrets:**
- `RAILWAY_TOKEN` - Railway authentication token (get from Railway dashboard → Account → Tokens)
- `RAILWAY_SERVICE_ID` - Railway service ID (found in Railway service settings)
- `RAILWAY_API_URL` - Railway API endpoint URL (e.g., `https://api.adaptive-italian-audio.railway.app`)

See [docs/deployment-env-template.md](docs/deployment-env-template.md) for complete environment variable documentation.

#### Deployment Verification

After deployment, the workflows automatically verify:
- **Frontend**: Checks that the deployment URL is accessible (HTTP 200/301/302)
- **Backend**: Verifies the `/health` endpoint returns HTTP 200

#### Rollback Process

If a deployment fails or needs to be rolled back:

1. **Vercel**: Use the Vercel dashboard to rollback to a previous deployment
   - Go to project → Deployments → Select previous deployment → "Promote to Production"
2. **Railway**: Use the Railway dashboard to rollback to a previous deployment
   - Go to service → Deployments → Select previous deployment → "Redeploy"

#### Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs for error details
- Verify all required secrets are configured
- Ensure environment variables are set in Vercel/Railway dashboards
- Verify build commands work locally

**Health check fails:**
- Deployment may still be starting (wait 1-2 minutes)
- Check platform logs for startup errors
- Verify environment variables are correctly configured
- Ensure database/Redis connections are working (if applicable)

**Build errors:**
- Run `pnpm install` and `pnpm build` locally to reproduce
- Check for TypeScript errors: `pnpm type-check`
- Verify all dependencies are installed correctly

For more details, see [docs/deployment-env-template.md](docs/deployment-env-template.md).

## Documentation

- **[Product Requirements Document (PRD)](docs/prd/prd.md)** - Complete product requirements and epics
- **[Architecture Documentation](docs/architecture/)** - System architecture and design decisions
- **[Stories](docs/stories/)** - Development stories and implementation tracking
- **[Tech Stack](docs/architecture/tech-stack.md)** - Technology choices and versions
- **[Project Structure](docs/architecture/unified-project-structure.md)** - Detailed directory structure

## Package Organization

### Apps
- **`apps/lovable_web`** - React frontend application with Vite
- **`apps/api`** - Express backend API server

### Packages
- **`packages/shared`** - Shared TypeScript types and utilities used by both frontend and backend
- **`packages/model-service`** - Foundation language acquisition model implementation (Epic 2)
- **`packages/config`** - Shared configuration files (ESLint, TypeScript)

## Contributing

1. Follow the project structure and coding standards
2. Write tests for new features (testing frameworks configured in future stories)
3. Update documentation as needed
4. Ensure all linting and type checks pass before submitting PRs

## Development Standards

- **TypeScript**: Strict mode enabled, all code must be type-safe
- **ESLint**: Follow shared ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Git**: Follow conventional commit messages
- **Code Review**: All changes require code review before merging

## License

[Add license information here]

## Support

For questions or issues, please [create an issue](link-to-issues) in the repository.
