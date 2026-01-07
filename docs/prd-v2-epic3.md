# PRD v2: Epic 3 - User Preferences & Model-Informed Adaptation

**Part of:** PRD v2 - Adaptive Italian Audio for Accelerated Acquisition  
**Document Version:** 2.0  
**Date:** 2026-01-07  
**Status:** Draft

---

## Epic 3: User Preferences & Model-Informed Adaptation

**Epic Goal:**

Build a simple onboarding flow that establishes baseline difficulty preferences according to model principles, and create model-informed adaptation logic that selects content based on lexical-heavy vs. discourse-heavy difficulty levels as specified by the foundation model. Implement preference storage using browser localStorage to persist user settings across sessions. Integrate user preferences with the model-driven content generation system from Epic 2 to deliver personalized content that matches individual comprehension levels as predicted by the foundation model. The epic delivers the foundation for model-driven personalization while maintaining the lean-back, frictionless experience established in Epic 1. (Note: User authentication deferred to post-MVP.)

### Story 3.1: User Preference Storage & Management

**As a** user,  
**I want** my preferences (difficulty level, content preferences) to be saved and persist across sessions using browser storage,  
**so that** I don't have to reconfigure my preferences every time I use the app.

**Acceptance Criteria:**

1. User preference data model created (difficulty level, content format preferences, any other user settings)
2. Preferences stored in browser localStorage (persists across browser sessions)
3. Preference retrieval system implemented (loads user preferences on app start from localStorage)
4. Preference update mechanisms implemented in frontend (can modify preferences, saves to localStorage)
5. Default preferences applied when user has no saved preferences in localStorage (defaults align with model baseline specifications)
6. Preferences API/service integrated with frontend state management
7. Preference changes persist immediately (auto-save to localStorage, no manual save required)
8. Preference system designed for extensibility (easy to add new preference types in future, ready for model-driven preference refinement)
9. localStorage data structure allows for easy migration to database in future (JSON structure, versioned)
10. Preference storage handles localStorage quota limits gracefully (handles storage full scenarios)

### Story 3.2: Model-Informed Onboarding Flow

**As a** user,  
**I want** to quickly set my initial difficulty preference when I first use the app,  
**so that** the model-driven content I receive matches my comprehension level from the start according to model principles.

**Acceptance Criteria:**

1. Simple onboarding flow implemented (maximum 2-3 screens, completable in under 30 seconds)
2. Onboarding appears only on first app use (can be skipped, can be accessed later via settings)
3. Difficulty preference selection screen with clear options (Beginner, Intermediate, Advanced, or specific difficulty scale aligned with model's comprehensibility framework)
4. Alternative: System can infer difficulty from first session behavior using model service (optional inference mode, model-driven baseline establishment)
5. Difficulty preference explanation provided (what each level means according to model principles, what type of content to expect)
6. Onboarding flow saves preference immediately upon selection
7. Onboarding can be dismissed/skipped (uses model-specified default difficulty if skipped)
8. Onboarding UI is elegant and unobtrusive (doesn't feel like a signup form, feels like quick setup)
9. Onboarding provides immediate value (first content generated after onboarding uses model service with selected preference)
10. Onboarding accessible from settings for users who want to change preference later
11. Model service establishes initial learner state representation based on onboarding preference (model-driven baseline setup)

### Story 3.3: Model-Informed Adaptation Logic

**As a** system,  
**I want** to implement model-informed adaptation logic that distinguishes between lexical-heavy and discourse-heavy content according to model principles,  
**so that** I can select content appropriate for the user's comprehension level as predicted by the foundation model.

**Acceptance Criteria:**

1. Model service provides adaptation logic API that implements model-informed difficulty decisions
2. Difficulty classification system implemented (lexical-heavy vs. discourse-heavy content classification aligned with model's comprehensibility framework)
3. Lexical-heavy content defined according to model (simpler vocabulary, explicit reference, straightforward sentence structure, meaning-first approach)
4. Discourse-heavy content defined according to model (complex syntax, implicit reference, advanced linguistic structures, model-specified challenge characteristics)
5. Model service determines difficulty parameters for content generation based on user preferences and model principles (i+1 zone according to model)
6. Content generation prompts modified to accept model-driven difficulty parameters (tells AI to generate at model-specified difficulty level)
7. Difficulty selection logic implemented (maps user preference to model-informed difficulty parameters for content generation)
8. Content generation service filters/selects templates based on model-determined difficulty (or adjusts generation prompts using model parameters)
9. Difficulty metadata tracked on all generated content (stores difficulty level, model parameters used with content)
10. Adaptation logic integrates with model service (model service provides adaptation decisions, logic follows model predictions)
11. Adaptation logic can be extended in future (modular design, easy to add more sophisticated model-driven adaptation)
12. System can generate content at user's preferred difficulty level on-demand using model service
13. Difficulty adaptation works seamlessly with model-driven content generation pipeline from Epic 2

### Story 3.4: Model-Driven Preference Integration with Content Generation

**As a** system,  
**I want** to integrate user preferences with model-driven content generation to personalize content selection,  
**so that** generated content matches user's difficulty preference and model predictions about optimal input characteristics.

**Acceptance Criteria:**

1. User preference system integrated with model service and content generation pipeline (preferences passed to model service, model determines generation parameters)
2. Content generation requests include user difficulty preference from localStorage (model service uses preferences to determine generation parameters)
3. Model service processes user preferences and determines model-driven generation parameters (difficulty calibration, content characteristics according to model)
4. Generated content respects user's difficulty setting while following model principles (lexical-heavy for lower difficulty, discourse-heavy for higher, both model-informed)
5. Preference changes immediately affect new content generation (real-time preference application, model service re-evaluates parameters)
6. Content generation API accepts preference context (preferences sent with each generation request, model service consulted)
7. User preferences retrieved from localStorage and included in generation requests to model service
8. Model service integration maintains generation performance (model service is computationally efficient, doesn't slow down content generation)
9. System gracefully handles missing preferences (uses model-specified sensible defaults when localStorage is empty)
10. Content generation logs include preference data and model parameters for future analytics (preference → model parameters → content quality correlation)
11. Preference integration works seamlessly with existing scrolling feed and model-driven generation pipeline
12. Model service tracks preference-performance correlation for model validation (tracks how preferences map to content performance, validates model predictions)

### Story 3.5: Settings & Preference Management UI

**As a** user,  
**I want** to access and modify my preferences through a simple settings interface,  
**so that** I can adjust my experience as my comprehension improves or preferences change, with changes informing model-driven adaptation.

**Acceptance Criteria:**

1. Settings screen/interface implemented (accessible but not prominent, minimalist design)
2. Difficulty preference can be changed in settings (updates immediately, affects model service decisions for new content)
3. Settings UI matches overall app aesthetic (lean-back, elegant, not overwhelming)
4. Settings accessible from main interface (unobtrusive menu or button)
5. Preference changes save automatically (no explicit save button required, auto-save to localStorage)
6. Visual feedback confirms preference changes (subtle confirmation, smooth transitions)
7. Settings accessible to all users (no authentication required, works with localStorage preferences)
8. Settings screen explains what each preference does (clear, concise descriptions, mentions model-driven adaptation)
9. Settings UI designed for extensibility (easy to add new preference types in future, ready for model-driven preference expansion)
10. Settings don't interrupt listening experience (can be accessed without stopping playback)
11. Preference changes trigger model service re-evaluation (model service processes updated preferences for next content generation)

---

**Next:** See **prd-v2-epic4.md** for Behavioral Tracking & Model-Driven Learner System
