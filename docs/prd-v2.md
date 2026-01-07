# Adaptive Italian Audio for Accelerated Acquisition - Product Requirements Document v2 (PRD)

**Document Version:** 2.0  
**Date:** 2026-01-07  
**Status:** Draft  
**Structure:** Multi-file format to manage scope and token limits

---

## Document Structure

This PRD v2 is organized across multiple files for clarity and manageability:

- **prd-v2.md** (this file) - Goals, Background Context, Requirements Summary, Epic List, UI Goals, Technical Assumptions
- **prd-v2-epic1.md** - Epic 1: Foundation & Core Audio Experience (detailed stories)
- **prd-v2-epic2.md** - Epic 2: Model-Driven Content Generation & Delivery Pipeline (detailed stories)
- **prd-v2-epic3.md** - Epic 3: User Preferences & Model-Informed Adaptation (detailed stories)
- **prd-v2-epic4.md** - Epic 4: Behavioral Tracking & Model-Driven Learner System (detailed stories)

---

## Goals and Background Context

### Goals

- Transform language learning from work into entertainment through model-driven adaptive Italian audio content that users consume passively
- Operationalize the foundation language acquisition model in content generation, adaptation, and measurement systems
- Deliver sufficient comprehensible input volume (50+ hours within 6 months) to drive natural language acquisition according to model principles
- Sustain 30+ minute listening sessions through model-driven serial narratives, podcasts, and educational content formats
- Provide model-informed adaptive difficulty that automatically matches individual comprehension levels, maintaining optimal "i+1" exposure zone as predicted by the foundation model
- Achieve 40%+ 30-day user retention by delivering ongoing value that fits into user lifestyles through model-driven personalization
- Validate that the foundation language acquisition model can be successfully operationalized in software and that model predictions align with user behavior and outcomes
- Prove economic viability by operating within free-tier API limits for MVP scale (1,000+ users) with model-driven generation
- Enable plateaued intermediate learners to break through their learning plateaus through model-optimized input exposure
- Create a lean-back experience that feels like consuming personalized Italian media, where acquisition occurs implicitly according to model predictions

### Background Context

Language learners struggle to access sufficient volumes of comprehensible, engaging input—the critical requirement for natural language acquisition according to Second Language Acquisition (SLA) research. Existing solutions either require explicit study (breaking immersion) or provide static content that doesn't adapt to individual comprehension levels, leading to inefficient acquisition rates and limited engagement.

This adaptive Italian audio application solves both problems by operationalizing a foundational language acquisition model that drives all content generation and adaptation decisions. The foundation model (described in detail in brief-v2-mvp.md) posits that language acquisition emerges from four coupled mechanisms: prediction under uncertainty, meaning anchoring through situational context, statistical abstraction across exemplars, and active re-expression with reformulation feedback.

Unlike apps that apply generic SLA principles or heuristic-based adaptation, this app is built to operationalize a specific, coherent model of language acquisition. The model drives:
- Content generation parameters and structure (meaning-first approach, controlled variation, comprehensibility before correctness)
- Adaptation decision-making (model predictions about optimal input characteristics and timing)
- Comprehension inference approaches (model framework for interpreting behavioral signals)
- Learner state representation (probabilistic competence tracking according to model principles)

The app generates personalized, serial narrative content that automatically adapts to each learner's evolving comprehension level, optimizing for both sustained engagement and natural language acquisition. The app functions as a language-driven media system where users consume compelling Italian stories, dialogues, and narratives that maintain engagement while accelerating acquisition through model-optimized input exposure.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-07 | 1.0 | Initial PRD draft based on Project Brief v1 | PM Agent |
| 2026-01-07 | 2.0 | PRD v2 updated to integrate foundation language acquisition model throughout | PM Agent |

---

## Requirements Summary

### Functional Requirements (Key Highlights)

**Content Generation (Model-Driven):**
- FR1-FR2: Model-driven Italian audio content generation in multiple formats
- FR3-FR4: Model-informed adaptive difficulty (lexical-heavy vs. discourse-heavy) based on model principles
- FR5-FR6: Lean-back audio experience aligned with model predictions about engagement
- FR7-FR8: Model-driven behavioral tracking (signals interpreted according to model framework)
- FR9-FR11: Serial narrative content with model-specified repetition and variation patterns
- FR12-FR14: Continuous scrolling feed with on-demand model-driven content generation

**User Experience:**
- FR15-FR17: Onboarding and preference management (model-informed baseline establishment)
- FR18-FR19: Content engagement tracking (like system) for model-driven adaptation
- FR20-FR21: Settings and preference UI (model-driven preference integration)

**See prd-v2-epic2.md, prd-v2-epic3.md for complete functional requirements**

### Non-Functional Requirements (Key Highlights)

**Model Operationalization:**
- NFR1-NFR3: System operates within free-tier API limits with model-driven generation
- NFR4-NFR6: Performance targets support model-driven real-time adaptation
- NFR7-NFR9: Content quality meets model-specified criteria
- NFR10-NFR12: System architecture supports model service evolution
- NFR13-NFR17: Scalability ensures model service can grow without refactoring

**Technical Foundation:**
- NFR18-NFR22: Model service integration with all system components
- NFR23-NFR25: Model state storage and retrieval efficiency
- NFR26-NFR28: Model validation infrastructure and analytics

**See prd-v2-epic2.md for complete non-functional requirements**

---

## Epic List

**Epic 1: Foundation & Core Audio Experience**

Establish foundational project infrastructure, build responsive web application framework with continuous scrolling feed, implement audio playback system with lean-back interface, and deliver initial working product. Sets up technical foundation that will support model-driven content generation in later epics.

**Epic 2: Model-Driven Content Generation & Delivery Pipeline**

Build the core model-driven content generation infrastructure that operationalizes the foundation language acquisition model. Integrate AI text generation APIs with model service to produce engaging Italian narratives, podcasts, and educational content following model principles. Implement text-to-speech conversion and establish storage/delivery system. The epic delivers unlimited, diverse Italian content generated according to model specifications, replacing sample content with real-time model-driven generation.

**Epic 3: User Preferences & Model-Informed Adaptation**

Build onboarding flow that establishes baseline difficulty preferences, and create model-informed adaptation logic that selects content based on lexical-heavy vs. discourse-heavy difficulty levels according to model principles. Implement preference storage using browser localStorage and integrate preferences with model-driven content generation to deliver personalized content that matches individual comprehension levels as predicted by the foundation model.

**Epic 4: Behavioral Tracking & Model-Driven Learner System**

Implement passive behavioral signal collection that tracks user listening patterns. Build analytics service that processes behavioral events according to model measurement framework. Create model-driven learner model service that infers comprehension patterns from behavioral signals and like data using model principles. Develop session-based adaptation logic that adjusts content selection based on model predictions. Integrate adaptation system with content generation to deliver fully personalized, model-driven experience.

---

## User Interface Design Goals

### Overall UX Vision

The application functions as a personalized Italian media consumption platform that feels indistinguishable from a premium podcast or audiobook service. The experience prioritizes effortless, lean-back consumption—users open the app and immediately enter a seamless Italian audio world. The interface is minimalist and unobtrusive, with audio playback as the primary interaction. Visual elements support rather than distract from listening, creating a "forget you're learning" experience where users engage with compelling content without feeling the cognitive load of explicit instruction. Every interaction is optimized for speed and simplicity, removing friction that might break immersion or remind users they're in a "learning app." The foundation model's emphasis on meaning-focused processing and naturalistic acquisition is reflected in the interface design.

### Key Interaction Paradigms

**Auto-Play on Launch:** The app opens directly into playback mode, immediately starting the next episode or continuing from where the user left off. No homepage or content selection required—audio begins within 2 seconds of app launch, supporting the model's emphasis on continuous exposure.

**Continuous Scrolling Feed:** Users scroll forward to generate fresh model-driven content on-demand, or scroll backward to access previously generated content from session storage. Scrolling feels natural and responsive, with content generated according to model principles as users navigate.

**Minimal Control Interface:** Playback controls (play, pause, skip forward 15 seconds, skip backward 15 seconds) are always accessible but unobtrusive. Like button (Instagram-style) allows quick engagement feedback that informs model-driven adaptation.

**Passive Content Discovery:** Content selection happens automatically based on model-driven adaptation logic. Users don't actively browse—the system presents the next appropriate episode seamlessly based on model predictions.

**Invisible Adaptation:** Difficulty adjustment and content personalization occur behind the scenes with no visible indicators. Users experience natural progression through content without seeing progress bars, levels, or difficulty labels, aligning with model's emphasis on implicit acquisition.

**Lean-Back First:** All interactions are designed for passive consumption during commutes, exercise, or downtime. The interface supports one-handed mobile use and works with screen-off audio playback on mobile devices.

### Core Screens and Views

**Main Listening Screen:** The primary interface featuring large, elegant audio player controls, current episode title and format indicator, and minimal visual design. Displays current playback position and episode duration. Optional: subtle background imagery or color theme matching content mood.

**Onboarding Screen:** Single, simple setup flow asking users to select initial difficulty preference (or skip to let system infer). Maximum 2-3 screens total, completable in under 30 seconds. No account creation required for initial use. Model-informed baseline establishment.

**Content Queue/History Screen (Optional/Minimal):** A lightweight view showing recently listened episodes accessible via swipe or tap but not prominently featured. Designed for users who want to resume specific content.

**Settings Screen (Minimal):** Basic controls for difficulty preference adjustment, playback speed (if supported), audio quality, and optional account creation for cross-device sync. Hidden in unobtrusive menu.

### Accessibility: None

_(Note: MVP focuses on core functionality validation. Accessibility features can be added in Phase 2 once core value proposition is proven. Current design prioritizes simplicity and minimal interface complexity.)_

### Branding

The brand identity should evoke Italian culture, storytelling, and media consumption rather than language learning. Visual design should feel warm, inviting, and sophisticated—more like a premium Italian media platform than an educational tool. Consider elegant design elements without being clichéd. The brand should communicate "personalized Italian audio experiences" rather than "learn Italian." Tone is confident, relaxed, and immersive.

### Target Device and Platforms: Web Responsive

The application is optimized for web responsive design, providing an optimal experience across mobile devices (primary), tablets, and desktop browsers. Mobile-first approach ensures the app works seamlessly on smartphones during commutes, workouts, and daily activities where most listening occurs. Progressive Web App (PWA) capabilities enable app-like experience on mobile.

---

## Technical Assumptions

### Repository Structure: Monorepo

The project uses a monorepo structure to manage frontend and backend code within a single repository. This approach enables code sharing, unified dependency management, and streamlined development workflows for a small team. The monorepo structure supports clear separation of concerns with distinct service modules (content generation, audio processing, user management, analytics, **model service**) while maintaining a cohesive codebase.

### Service Architecture

The system employs a modular monolith architecture for MVP, with clear service boundaries that can evolve into microservices if scaling requirements demand it. Core services include:

- **Model Service:** Centralized service implementing foundation language acquisition model principles. Provides model-driven APIs for content generation, adaptation, and measurement.
- **Content Generation Service:** Handles Italian text generation via AI APIs, integrates with model service for model-driven generation parameters
- **Audio Processing Service:** Coordinates text-to-speech conversion, audio file generation, and audio storage/retrieval
- **User Service:** Manages user preferences and session management (authentication deferred to post-MVP)
- **Learner Model Service:** Tracks behavioral signals, maintains user comprehension model according to foundation model principles, determines content difficulty selection using model predictions
- **Analytics Service:** Collects and processes behavioral events for adaptation, product insights, and model validation

Asynchronous processing is implemented using queue-based systems to handle content generation requests without blocking the user experience. Event-driven architecture enables behavioral signals to trigger model-driven adaptation logic.

### Testing Requirements

**Unit + Integration Testing:**
- Core business logic including model service implementation
- Model-driven content generation and adaptation algorithms
- Service layer functions and model service integration
- Target: 70%+ code coverage for critical paths including model service

**Manual Testing Convenience Methods:**
- Test utilities for model-driven content generation
- Mock behavioral signals for testing model-driven adaptation logic
- Model validation testing tools
- Content quality validation aligned with model criteria

### Additional Technical Assumptions

**Model Service Implementation:**
- Centralized model service with clear API interfaces
- Model state storage supporting probabilistic models and temporal dynamics
- Model-driven content generation integration
- Model-driven adaptation integration
- Model validation infrastructure for continuous validation

**Frontend Technology Stack:**
- React with TypeScript for type safety
- Context API for state management
- Tailwind CSS for responsive styling
- HTML5 Audio API with custom controls
- Service Workers for PWA capabilities

**Backend Technology Stack:**
- Node.js with Express for RESTful API
- TypeScript for type safety
- Model service implemented in TypeScript/JavaScript or Python
- PostgreSQL for structured data (preferences, content metadata, behavioral tracking, model state)
- Redis for session caching

**Hosting and Infrastructure:**
- Frontend: Vercel or Netlify
- Backend: Railway or Render
- Database: Managed PostgreSQL
- Audio Storage: AWS S3 or Google Cloud Storage
- CDN: CloudFlare for audio file delivery

**Third-Party API Integrations:**
- **Text-to-Speech:** Google Cloud TTS (primary) with Azure as fallback
- **Text Generation:** Google Gemini (e.g. `gemini-1.5-pro`) for Italian content generation (model-driven prompts)
- **Analytics:** Custom analytics implementation (PostgreSQL-based) for behavioral tracking and model validation

**Model Implementation Requirements:**
- Model service must be computationally efficient (no complex ML models requiring GPU infrastructure)
- Model principles operationalized through algorithms and heuristics (not full ML implementation in MVP)
- Model state efficiently stored and queried for adaptation decisions
- Model service designed for horizontal scaling as model sophistication increases

**See prd-v2-epic2.md, prd-v2-epic3.md, prd-v2-epic4.md for detailed technical assumptions per epic**

---

## User Responsibilities & Prerequisites

### External Service Account Setup (User Action Required)

The following external service accounts must be created and configured by the user before the application can function. These are **user responsibilities** and cannot be automated by developer agents:

1. **Gemini API Access (Google AI Studio)**
   - User must enable Gemini API access via Google AI Studio at https://aistudio.google.com
   - User must generate an API key with appropriate permissions
   - API key must be configured in application environment variables
   - Required for: Italian text content generation (Epic 2)

2. **Google Cloud TTS Account**
   - User must create a Google Cloud Platform account
   - User must enable the Cloud Text-to-Speech API
   - User must create a service account and download credentials
   - Service account credentials must be configured in application environment variables
   - Required for: Text-to-speech conversion (Epic 2)

3. **AWS S3 Account (or Alternative Cloud Storage)**
   - User must create an AWS account
   - User must create an S3 bucket for audio file storage
   - User must create IAM access keys with S3 permissions
   - Access keys must be configured in application environment variables
   - Required for: Audio file storage and delivery (Epic 2)

**Documentation:** Detailed setup instructions for each service are provided in Epic 1 Story 1.4 and in the project README.md file.

**Note:** The application includes validation to check for required external service credentials on startup and will display clear error messages if credentials are missing or invalid.

---

## Next Steps

See individual epic files for detailed stories and acceptance criteria:
- **prd-v2-epic1.md** - Foundation & Core Audio Experience
- **prd-v2-epic2.md** - Model-Driven Content Generation & Delivery Pipeline
- **prd-v2-epic3.md** - User Preferences & Model-Informed Adaptation
- **prd-v2-epic4.md** - Behavioral Tracking & Model-Driven Learner System

---

**Document Status:** This PRD v2 is a **living document** and should be updated as:
- The foundation language acquisition model is refined
- Model validation reveals refinements needed
- Assumptions are validated or invalidated
- User research reveals new insights
- Technical constraints become clearer
