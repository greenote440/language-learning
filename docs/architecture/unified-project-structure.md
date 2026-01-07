# Unified Project Structure


Monorepo structure using Turborepo for frontend, backend, and shared packages. Clear separation of concerns with shared code.

## Project Structure

```
adaptive-italian-audio/
├── .github/
│   └── workflows/
│       ├── ci.yaml                 # CI pipeline
│       └── deploy.yaml              # Deployment workflow
├── apps/
│   ├── web/                         # React frontend application
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   │   ├── AudioPlayer/
│   │   │   │   ├── ScrollingFeed/
│   │   │   │   ├── ContentCard/
│   │   │   │   ├── LikeButton/
│   │   │   │   ├── OnboardingFlow/
│   │   │   │   └── SettingsPanel/
│   │   │   ├── contexts/           # React Context providers
│   │   │   │   ├── SessionContext.tsx
│   │   │   │   ├── AudioPlayerContext.tsx
│   │   │   │   └── ContentContext.tsx
│   │   │   ├── services/           # API client services
│   │   │   │   ├── apiClient.ts
│   │   │   │   ├── contentService.ts
│   │   │   │   ├── sessionService.ts
│   │   │   │   ├── eventService.ts
│   │   │   │   └── likeService.ts
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   │   ├── useAudioPlayer.ts
│   │   │   │   ├── useContentGeneration.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── utils/              # Frontend utilities
│   │   │   │   ├── localStorage.ts
│   │   │   │   └── sessionStorage.ts
│   │   │   ├── styles/             # Global styles
│   │   │   │   └── globals.css
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/
│   │   │   ├── manifest.json        # PWA manifest
│   │   │   └── icons/              # PWA icons
│   │   ├── tests/                  # Frontend tests
│   │   │   ├── components/
│   │   │   └── services/
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── api/                        # Express backend application
│       ├── src/
│       │   ├── routes/              # API route handlers
│       │   │   ├── content.routes.ts
│       │   │   ├── session.routes.ts
│       │   │   ├── events.routes.ts
│       │   │   ├── like.routes.ts
│       │   │   └── model.routes.ts
│       │   ├── services/           # Business logic services
│       │   │   ├── contentGeneration.service.ts
│       │   │   ├── tts.service.ts
│       │   │   ├── audioProcessing.service.ts
│       │   │   ├── pipeline.service.ts
│       │   │   ├── user.service.ts
│       │   │   ├── learnerModel.service.ts
│       │   │   └── analytics.service.ts
│       │   ├── repositories/       # Data access layer
│       │   │   ├── content.repository.ts
│       │   │   ├── session.repository.ts
│       │   │   ├── event.repository.ts
│       │   │   ├── like.repository.ts
│       │   │   └── learnerModel.repository.ts
│       │   ├── middleware/         # Express middleware
│       │   │   ├── errorHandler.ts
│       │   │   ├── requestValidator.ts
│       │   │   └── cors.ts
│       │   ├── utils/              # Backend utilities
│       │   │   ├── logger.ts
│       │   │   └── webhook.ts
│       │   └── server.ts           # Express app entry point
│       ├── tests/                  # Backend tests
│       │   ├── routes/
│       │   ├── services/
│       │   └── repositories/
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── shared/                     # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/              # TypeScript interfaces
│   │   │   │   ├── content.types.ts
│   │   │   │   ├── session.types.ts
│   │   │   │   ├── event.types.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   └── api.types.ts
│   │   │   ├── constants/         # Shared constants
│   │   │   │   ├── eventTypes.ts
│   │   │   │   ├── contentFormats.ts
│   │   │   │   └── difficulties.ts
│   │   │   └── utils/             # Shared utilities
│   │   │       ├── dateUtils.ts
│   │   │       └── validation.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── model-service/              # Foundation language acquisition model
│   │   ├── src/
│   │   │   ├── model/              # Model implementation
│   │   │   │   ├── generationParameters.ts
│   │   │   │   ├── adaptationEngine.ts
│   │   │   │   ├── signalInterpreter.ts
│   │   │   │   └── learnerState.ts
│   │   │   ├── interfaces/        # Model service interfaces
│   │   │   └── utils/
│   │   ├── tests/
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── config/                     # Shared configuration
│       ├── eslint/
│       │   └── .eslintrc.js
│       ├── typescript/
│       │   └── tsconfig.base.json
│       └── jest/
│           └── jest.config.js
├── infrastructure/                 # Infrastructure as Code (post-MVP)
│   └── (Terraform/CloudFormation definitions)
├── scripts/                        # Build/deploy scripts
│   ├── setup.sh
│   └── deploy.sh
├── docs/                           # Documentation
│   ├── prd-v2.md
│   ├── prd-v2-epic1.md
│   ├── prd-v2-epic2.md
│   ├── prd-v2-epic3.md
│   ├── prd-v2-epic4.md
│   ├── front-end-spec.md
│   ├── architecture.md              # This document
│   └── stories/
├── .env.example                    # Environment template
├── .gitignore
├── turbo.json                      # Turborepo configuration
├── package.json                    # Root package.json
├── pnpm-workspace.yaml             # pnpm workspace config
└── README.md
```

## Structure Rationale

**Monorepo Benefits:**
- **Shared types:** packages/shared ensures type safety across frontend and backend
- **Model service:** Independent package enables testing and reuse
- **Unified tooling:** Single ESLint, TypeScript, and testing configuration
- **Turborepo caching:** Fast builds with intelligent caching

**Package Organization:**
- **apps/:** Application code (web frontend, api backend)
- **packages/:** Shared libraries (types, model service, config)
- **Clear boundaries:** Each package has single responsibility

**Technology Alignment:**
- **Turborepo:** Monorepo orchestration
- **pnpm:** Package manager (faster, disk-efficient)
- **TypeScript:** Type safety throughout
- **Vite:** Frontend bundling
- **Express:** Backend framework

---

