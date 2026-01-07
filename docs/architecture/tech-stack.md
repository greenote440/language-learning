# Tech Stack


This is the **DEFINITIVE** technology selection for the entire project. All development must use these exact versions and technologies.

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.x | Type-safe frontend development | Ensures type safety across frontend codebase, aligns with PRD requirement |
| Frontend Framework | React | 18.x | UI component framework | Industry standard, excellent ecosystem, aligns with PRD requirement |
| UI Component Library | None (Custom) | - | Custom components with Tailwind | PRD specifies minimal UI, custom components provide full control |
| State Management | React Context API | Built-in | Client-side state management | Lightweight for MVP, no external dependencies, aligns with PRD requirement |
| Backend Language | TypeScript | 5.x | Type-safe backend development | Ensures type safety across backend, shared types with frontend |
| Backend Framework | Express | 4.x | RESTful API server | Industry standard, simple, aligns with PRD requirement |
| API Style | REST | - | HTTP-based API communication | Simple, well-understood, aligns with PRD technical assumptions |
| Database | PostgreSQL | 15+ | Structured data storage | Relational data for content metadata, user preferences, behavioral tracking |
| Cache | Redis | 7.x | Session caching and temporary data | Fast session storage, supports real-time adaptation logic |
| File Storage | AWS S3 | - | Audio file storage | Scalable, cost-effective, CDN integration |
| Authentication | None (MVP) | - | Deferred to post-MVP | PRD specifies authentication deferred, localStorage for MVP |
| Frontend Testing | Vitest + React Testing Library | Latest | Unit and component testing | Fast, modern, excellent React support |
| Backend Testing | Vitest + Supertest | Latest | API and service testing | Consistent testing framework across stack |
| E2E Testing | Playwright | Latest | End-to-end testing | Reliable, cross-browser, supports PWA testing |
| Build Tool | Turborepo | Latest | Monorepo build orchestration | Fast builds with intelligent caching, aligns with architecture decision |
| Bundler | Vite | Latest | Frontend bundling | Fast dev server, optimized production builds |
| IaC Tool | None (MVP) | - | Infrastructure as Code | Deferred - using managed services (Vercel, Railway) |
| CI/CD | GitHub Actions | - | Continuous integration/deployment | Integrated with GitHub, free for public repos |
| Monitoring | Vercel Analytics + Custom | - | Performance and error tracking | Vercel provides built-in analytics, custom for behavioral tracking |
| Logging | Winston + Pino | Latest | Structured logging | Backend logging, supports model validation tracking |
| CSS Framework | Tailwind CSS | 3.x | Utility-first CSS framework | Rapid UI development, aligns with PRD requirement |

## Additional Technology Decisions

**Text-to-Speech:**
- **Primary:** Google Cloud TTS API
- **Fallback:** Azure Cognitive Services TTS
- **Rationale:** PRD specifies Google Cloud TTS as primary with Azure fallback for reliability

**Text Generation:**
- **Primary:** OpenAI GPT-4 or GPT-3.5-turbo
- **Rationale:** PRD specifies OpenAI for Italian content generation, GPT-3.5-turbo for cost efficiency, GPT-4 for quality when needed

**Audio Processing:**
- **Format:** MP3 (128kbps recommended)
- **Rationale:** Good balance of quality and file size for language learning content

**PWA Support:**
- **Service Worker:** Workbox or custom
- **Manifest:** Web App Manifest
- **Rationale:** PRD requires PWA capabilities for offline playback and app-like experience

**Package Manager:**
- **Tool:** pnpm
- **Rationale:** Better monorepo performance, reduced disk usage, faster installs. Required for consistency across development workflows.

---

