# Project Brief v2: MVP Scope

**Part of:** Project Brief v2 - Adaptive Italian Audio for Accelerated Acquisition  
**Document Version:** 2.0  
**Date:** 2026-01-07  
**Status:** Draft

---

## MVP Scope

### Core Motivation: Foundation Language Acquisition Model

**The Foundation Model as Core Driver:**

The MVP is fundamentally motivated by a specific language acquisition model that represents the core understanding of how natural language acquisition occurs. This model is not just referenced—it is **operationally integrated** into the MVP's content generation, adaptation logic, and user experience design.

**Why This Matters:**

Unlike apps that apply generic SLA principles or heuristic-based adaptation, this app is built to operationalize a specific, coherent model of language acquisition. The model drives:
- Content generation parameters and structure
- Adaptation decision-making
- Comprehension inference approaches
- User experience design choices

**Model Integration Points in MVP:**

1. **Content Generation:** The model determines what types of content are generated, how complexity is controlled, and how repetition/variation patterns are structured
2. **Adaptation Logic:** The model provides the theoretical framework for how difficulty should be adjusted and what signals indicate comprehension
3. **Learner State Representation:** The model defines what aspects of linguistic competence are tracked and how they evolve
4. **Measurement Approach:** The model guides which behavioral signals are meaningful and how they should be interpreted

---

### Foundation Language Acquisition Model

**Internal Acquisition Model: Prediction, Meaning, Abstraction, and Compression**

This model posits that language acquisition emerges from four coupled mechanisms operating in a continuous cycle, not a linear pipeline. Acquisition is fundamentally a process of representational adjustment through repeated meaningful encounters with language in context.

#### Core Principles

**1. The Four Coupled Mechanisms:**

- **Prediction under uncertainty:** The learner constantly predicts upcoming linguistic material (sounds, words, structures, intentions). Errors update internal representations, creating a feedback loop between expectation and reality.

- **Meaning anchoring through situational context:** Language units are not learned in isolation, but anchored to:
  - Perceptual context (scene, action, video)
  - Pragmatic context (intent, relevance)
  - Affective salience (interest, emotion)

- **Statistical abstraction across exemplars:** Repeated exposure to varied instances allows the learner to abstract:
  - Constructions (not rules first)
  - Collocations
  - Pragmatic patterns
  Generalization is gradient, not categorical.

- **Active re-expression (output + reformulation):** Acquisition stabilizes when the learner attempts to express meaning and receives reformulations, paraphrases, or contrastive alternatives. Output is not the source of learning, but a compression pressure on representations.

**2. The Internal Processing Cycle:**

Language acquisition follows a continuous cycle, not discrete stages:

1. **Pre-activation:** Prior knowledge (L1, other languages, world knowledge) activates expectations. The learner does not start from zero.

2. **Comprehension attempt:** Input is partially understood. Ambiguity is tolerated. Unknown elements are carried as placeholders ("something grammatical happens here").

3. **Prediction error:** The learner's expectations mismatch the input. Salient mismatches are registered (form, meaning, usage).

4. **Micro-update:** Representations shift slightly—lexical meaning becomes more precise, constructions widen or narrow, pragmatic constraints sharpen.

5. **Implicit hypothesis formation:** Not explicit rules, but probabilistic biases ("This form tends to appear when…", "This phrasing sounds wrong here…").

6. **Re-use / re-expression:** Learner tries to reuse patterns. Errors reveal representational gaps.

7. **Reformulation feedback:** Correct input doesn't say "wrong"; it shows better alternatives in the same semantic space.

This loop repeats hundreds of times per day in small increments. Acquisition is continuous representational drift, not stage-based mastery.

**3. Key Principles That Make Acquisition Work:**

- **Principle 1: Comprehensibility before correctness** — Input must be understandable enough to predict meaning, even if form is not yet mastered. Never gate content by grammar mastery alone. Gate by semantic access.

- **Principle 2: Variation is essential** — Repetition alone causes overfitting. Controlled variation drives abstraction. Same meaning → multiple phrasings; same structure → multiple contexts.

- **Principle 3: Attention follows interest, not curriculum** — Salience accelerates plasticity. Emotion and curiosity modulate learning rate. Let topic choice influence sequencing more than grammatical order.

- **Principle 4: Errors are representational signals, not failures** — Errors reveal the learner's current internal model. Correction must target the gap, not the surface form. Corrections should preserve meaning, highlight contrast, and avoid meta-grammar unless requested.

- **Principle 5: Output compresses knowledge** — Producing language forces the learner to choose. Choice exposes uncertainty and forces reorganization. Output tasks should be low-stakes, meaning-driven, and immediately followed by reformulation.

- **Principle 6: Acquisition is non-linear and uneven** — Vocabulary, grammar, pragmatics progress at different speeds. Temporary regressions are normal. No rigid "levels"—use overlapping competence estimates.

**Internal Doctrine:** Language is acquired through repeated cycles of meaningful prediction, partial understanding, representational adjustment, and re-expression under communicative pressure.

#### Key Components

**1. Essential Elements (Non-Negotiable):**

- **Meaningful input (semantically grounded):** Language must be coupled to something other than language (perceptual context, situational intent, narrative coherence). Pure text-only input is insufficient for robust acquisition in early and intermediate stages. Meaning stabilizes form.

- **Comprehension margin (i+ε, not i+1):** Input must sit inside a zone of partial understanding—enough known material to infer meaning, enough unknown material to generate prediction error. If everything is known → no learning. If everything is unknown → no structure forms.

- **Repetition with variation:** The same semantic intent must reappear across speakers, registers, and syntactic forms. Generalization requires contrast. Single exemplars never form abstractions.

- **Active engagement (attention + intent):** The learner must care about the content and attempt to understand or respond. Passive exposure works only at very low rates. Attention gates plasticity.

- **Feedback via reformulation:** The system must show how a competent speaker would express the same meaning without interrupting communication. Negative feedback alone ("wrong") does not specify where the model is wrong.

**2. Conditions/Inputs That Must Exist:**

- Input must be usage-first, not rule-first (language appears as something people do, not as abstract structures)
- Temporal density (frequent, temporally clustered exposure)
- Rich pragmatic signals (intent, politeness, social role, stakes)
- Tolerance for ambiguity (learner must be allowed to not fully understand and hold multiple hypotheses)

**3. Systems/Capabilities That Must Be in Place:**

- **Learner state model:** Maintains a probabilistic model of what the learner probably understands, partially understands, and what is unstable or mis-generalized (not a skill checklist, but a probabilistic competence map)

- **Adaptive input generation:** Selects or generates input at the right difficulty, adapts topic/register/form. Static curricula violate the model.

- **Semantic alignment engine:** Knows what the learner intended to say and how close it was to native-like expression (requires meaning comparison, not string matching).

- **Reformulation & contrast engine:** For any learner output, produces minimal corrections, alternative phrasings, register shifts. Prefers "here's how I'd say it" over explanations.

- **Memory & recurrence tracking:** Tracks when constructions last appeared, when they were successfully reused, when they decayed. Supports intelligent recycling.

**4. Environmental Factors Required:**

- **Psychological safety:** Learner must feel free to be wrong, unjudged, ungraded by default. Anxiety suppresses output and experimentation.

- **Cultural authenticity (bounded):** Input must resemble real language (real pacing, idioms, discourse structure) but excessive chaos must be filtered. Balance authenticity without control (overwhelms) vs. control without authenticity (produces sterile competence).

- **Continuity over time:** Learning requires long arcs, recurring themes, narrative continuity. Language competence grows through re-encounter, not coverage.

- **Agency for the learner:** Learner can choose topics, ask questions, steer depth. Agency increases salience and retention.

#### Operational Mechanisms

**1. Content Generation (Meaning-First Approach):**

Content is generated from a structured "meaning layer" rather than random target-language sentences:

- **Scene representation:** Entities, actions, goals, emotions, time, location
- **Intent representation:** Request, refusal, explanation, narration, opinion, speculation
- **Discourse plan:** 2–5 turns with pragmatic function (ask/answer/clarify/confirm)

Then "render" that into language with explicit control knobs:
- Lexical set: known/high-frequency vs new/rare
- Construction set: allowed syntactic patterns
- Register: casual/neutral/formal
- Rate of novelty: how many new items per 100 tokens
- Discourse role: question/answer/clarification/backchannel

**Systematic variation families:**
- Same meaning, different syntax ("I had to leave early" / "I needed to leave early" / "I ended up leaving early")
- Same syntax, different meaning slots ("I'm looking for X because Y" with X/Y swapped)
- Same intent, different register ("Could you…?" / "Can you…?" / "Would you mind…?")

**2. Adaptation Decisions:**

- **Choose next intent:** Comprehension-first turns if learner is fragile; production/compression turns if learner is stable
- **Choose novelty budget:** Controls new lemmas per segment, new constructions per segment, speed/length (e.g., Beginner: 1 new lemma / 15–25 tokens)
- **Decide whether to recycle or expand:** Recently seen but not used → recycle with variation; used successfully twice → expand context/register; consistently misused → contrast set + re-elicitation
- **Decide feedback mode:** Recast (implicit) → Highlighted contrast → Micro-rule → Drill (only if user opts in)

**3. Implementation Hooks (Principles → Operations):**

- **Comprehensibility before correctness:** Gate content by semantic accessibility score (predicted comprehension of key propositions, availability of context cues, novelty budget), not grammar checklist
- **Repetition with variation:** Maintain construction scheduler—every construction needs N successful encounters in varied contexts, avoid back-to-back identical forms
- **Attention follows interest:** Topic selection prioritizes user-chosen domains and recent engagement signals
- **Errors are signals:** Store errors as confusions (tense/aspect, preposition/argument structure, register/pragmatics), not as "wrong answer"
- **Output compresses knowledge:** Insert "compression turns" regularly ("Say the same thing, shorter", "Explain to a friend", "Summarize", "Roleplay: ask for X politely")
- **Non-linearity:** Learner state is probabilistic + decay-aware, not level-based

**4. Core Algorithms/Heuristics:**

**Learner state model:** Represent knowledge as graph of items (lexemes, constructions, pragmatic nodes) with parameters: mastery probability p, stability s, last_seen/last_used, decay rate d, confusion set. Update with Bayesian-ish heuristics (success increases p and s; hesitation slightly increases p but lowers s; error updates confusion edges).

**Item selection policy:** Score(item) = w1 × (1 - p) + w2 × forgetting_risk + w3 × usefulness + w4 × relevance - w5 × overload. Pick bundle: 1–2 items to introduce, 2–4 items to recycle, 1 pragmatic move to practice.

**Controlled generation:** Two layers—(A) Plan: choose intent + semantic content + target items + register; (B) Realize: generate candidates, filter by constraints, keep 2–4 paraphrase variants for contrast.

**Reformulation engine:** Given learner output, infer intended meaning, produce minimal recast + one alternative + one register-shift (optional), highlight only changed span. Key heuristic: preserve learner's content; change smallest amount needed.

**Evaluation signals:** Comprehension checks (micro-questions), ability to paraphrase meaning, ability to choose appropriate alternative, response latency, self-corrections, paraphrase distance, pragmatic appropriateness.

#### Measurement Framework

**1. Definition of "Successful Acquisition":**

An item is acquired when the learner can reliably use and interpret it appropriately across varied contexts, without external scaffolding, and without destabilizing related knowledge. Properties: reliability (not one-off success), contextual flexibility, low cognitive load, pragmatic appropriateness. Acquisition is gradual and probabilistic, not binary.

**2. Indicators (Weakest to Strongest Evidence):**

- **Layer 1: Recognition & anticipation** — Predicts upcoming words/constructions, finishes sentences, selects correct option (passive, low confidence)
- **Layer 2: Comprehension under variation** — Understands same meaning in different registers/speakers/syntactic forms (receptive robustness)
- **Layer 3: Guided production** — Uses correctly when prompted/given constraints/shown exemplars (semi-stable)
- **Layer 4: Spontaneous production** — Uses unprompted, in self-chosen content, with correct pragmatics (strong evidence)
- **Layer 5: Transfer & repair** — Applies in new domains/novel situations, self-corrects/reformulates (full integration)

**3. Measurement Without Traditional Tests:**

- **Micro-evidence accumulation:** Collect micro-observations continuously (correct paraphrase selection, latency decrease, fewer clarification requests, smoother turn-taking). Each interaction is weak signal; acquisition inferred statistically.

- **Longitudinal competence curves:** For each item, track p_use (probability of correct use), p_comp (probability of correct interpretation), stability (variance), decay resistance (retention over time). Progress = upward trend + variance reduction.

- **Embedded challenges:** Vary register unexpectedly, swap constructions with same meaning, introduce distractors. Success is diagnostic, not punitive.

**4. Meaningful Behavioral Signals:**

- **High-value:** Spontaneous reuse, self-initiated paraphrasing, appropriate pragmatic choice, fast confident responses, self-repair before feedback
- **Medium-value:** Correct use after prompt, correct choice among options, partial paraphrase with minor errors
- **Low-value:** Correct repetition, forced drills, multiple-choice with obvious distractors

**5. "Acquired" vs "In Progress" Distinction:**

**In progress:** Correct in constrained contexts, fails under variation, high latency, interferes with neighbors

**Acquired:** Correct across ≥ N varied contexts, ≥ M temporal separations, used spontaneously ≥ 1 time, survives decay test, does not destabilize related constructions

**Decision rule (example):** Item marked functionally acquired if: p_use > 0.75, stability > threshold, used spontaneously ≥ 1 time, no confusion with top-2 neighbors in last K uses, retained after T days without exposure.

**6. Success Criteria:**

- **Micro level:** "I don't think about it anymore, it just comes out" — fast, appropriate, varied use, minimal correction
- **Meso level (sessions):** Increasing discourse length, pragmatic range, register control; decreasing hesitation, explicit form questions
- **Macro level (identity shift):** Uses language as tool not object of study, can negotiate meaning/repair misunderstandings/adapt tone, feels ownership

**What the model does NOT optimize for:** Perfect grammatical accuracy in isolation, explicit rule recall, level completion, coverage of syllabus (these may happen as side effects, not goals).

#### MVP Implementation

**1. MVP Philosophy:**

The MVP is not a full learner model, comprehensive curriculum, or measurement-perfect system. The MVP IS: a behaviorally faithful instantiation of the acquisition loop; a proof that this way of learning feels different and works better. The MVP must already feel like "language is being acquired implicitly," even if internals are crude. If MVP behaves like traditional app with AI polish, the model has already failed.

**2. Minimum Viable Acquisition Loop (Non-Negotiable):**

Must implement this loop, even simplified:
1. Grounded input (meaning-first)
2. Controlled variation
3. Light comprehension check
4. Low-pressure output
5. Reformulation-based feedback
6. Simple learner-state update
7. Adaptive next input

**3. What's Included vs Deferred:**

**Included in MVP (must-have):** Meaning-first content (video/audio/story), adaptive difficulty (even if heuristic), reformulation instead of correction, spaced recurrence of items, lean-back consumption with optional engagement, one learner state dimension (not many), continuous invisible measurement

**Explicitly deferred (do NOT fake these):** Fine-grained construction ontology, Bayesian mastery estimation, multi-register control, full pragmatic modeling, cross-session long-term decay modeling, explicit dashboards for "mastery"

**4. MVP Feature → Model Principles Mapping:**

**Feature 1: Model-Driven Content Generation**
- **MVP implementation:** Short grounded units (30–90s): video clip, narrated micro-scene, illustrated story. Each unit has single communicative intent, 1–2 target constructions, limited novelty
- **Model principles:** Meaning anchoring, usage-before-rules, comprehensibility over correctness
- **MVP simplification:** Hardcode intents (e.g., narration, explanation, request), limit to one register (neutral conversational)

**Feature 2: Model-Informed Adaptive Difficulty**
- **MVP implementation:** Use heuristics—track % comprehension success, response latency, number of reformulations needed. Adjust sentence length, speech rate, lexical novelty, syntactic density
- **Model principles:** Comprehension margin, non-linear acquisition, error-as-signal
- **MVP simplification:** 2–3 difficulty bands only, rule-based thresholds ("if confused twice, slow down & simplify")

**Feature 3: Lean-Back Audio Experience**
- **MVP implementation:** Default mode: watch/listen only, no forced interaction. Subtle affordances: "Replay", "Simpler version", "Another way to say it"
- **Model principles:** Psychological safety, attention-driven learning, tolerance for ambiguity
- **MVP simplification:** No branching narratives, no explicit "goals" shown

**Feature 4: Optional Interaction (Compression Pressure)**
- **MVP implementation:** Occasional optional prompts: "Say this in your own words", "Answer naturally", "Explain why X happened". No grading, no points
- **Model principles:** Output as compression, meaning-driven production, agency
- **MVP simplification:** Free-text or voice only, no structured exercises yet

**Feature 5: Reformulation-Based Feedback (CRITICAL)**
- **MVP implementation:** When learner produces output, system infers intended meaning, responds with minimal recast + 1 alternative phrasing, highlights only what changed. Example: Learner: "I leave early because I was tired" → System: "I left early because I was tired." Also: "I was tired, so I left early."
- **Model principles:** Errors as representational gaps, no explicit correction, variation drives abstraction
- **MVP simplification:** No explanations unless user asks, no terminology ("past tense", "connector")

**Feature 6: Basic Engagement Tracking (Implicit Measurement)**
- **MVP implementation:** Track silently: comprehension success, hesitation, self-correction, spontaneous reuse, paraphrase distance. Use only to adapt content
- **Model principles:** Continuous measurement, behavior over declarations, progress as stability
- **MVP simplification:** Aggregate signals per session, no per-item mastery yet

**Feature 7: User Onboarding + Recurrence**
- **MVP implementation:** Establish baseline difficulty. Reuse themes, characters, constructions. Bring back prior items days later in new contexts
- **Model principles:** Spaced reinforcement, transfer, narrative continuity
- **MVP simplification:** Fixed small content pool, simple "recent vs old" scheduling

**5. MVP Architecture (Mental Model):**

```
User
 ↓
Grounded Content Unit
 ↓
Lean-Back Consumption
 ↓
(Optional) Interaction
 ↓
Reformulation Feedback
 ↓
Behavioral Signals
 ↓
Simple Learner State Update
 ↓
Next Content Selection
```

If MVP does not already behave like this loop, it's not implementing the model.

**6. What MVP Proves:**

MVP does NOT prove: perfect acquisition, faster CEFR progression, grammatical mastery

MVP DOES prove: learners tolerate ambiguity, feel less anxiety, reuse language spontaneously, stay longer, report "it sticks without studying"

That's enough to justify the rest.

**Model Requirements for MVP:**

The MVP must include a **basic operational form** of this model that:
- Drives content generation decisions
- Informs adaptation logic
- Guides comprehension inference
- Provides theoretical grounding for all MVP features

Even if the full sophistication of the model is deferred to post-MVP phases, the MVP must demonstrate that the model's core principles are operational and driving the system's behavior.

---

### Core Features (Must Have)

#### 1. Model-Driven Content Generation

**Description:** Italian audio content delivered in multiple formats (serial narratives, podcast-style content, educational content) where content generation is explicitly driven by the foundation language acquisition model. The model determines:
- Content structure and complexity
- Repetition and variation patterns
- Semantic stability vs. linguistic variation
- Progression and difficulty calibration

**Rationale:** Content generation must be grounded in the model's principles, not generic heuristics. This ensures that the MVP validates the model's operationalizability and demonstrates its effectiveness.

**Model Integration:**
- Content generation prompts and parameters are derived from model principles
- Content structure (narratives, dialogues, explanations) aligns with model predictions about effective input
- Repetition patterns follow model specifications for frequency and variation
- Complexity control reflects model understanding of comprehensibility and challenge

#### 2. Model-Informed Adaptive Difficulty

**Description:** Coarse difficulty adaptation at the content selection level, where difficulty decisions are made according to the foundation model's principles. The system distinguishes between "lexical-heavy" (simpler vocabulary, explicit reference) and "discourse-heavy" (complex syntax, implicit reference) content, but these distinctions are informed by the model's understanding of what makes content comprehensible and challenging.

**Rationale:** Adaptation must reflect the model's predictions about optimal input characteristics, not generic difficulty scales. This ensures that personalization serves the model's acquisition goals.

**Model Integration:**
- Difficulty classification follows model definitions of comprehensibility
- Adaptation triggers align with model predictions about when adjustment is needed
- Difficulty calibration reflects model understanding of i+1 zone
- Content selection prioritizes model-specified input characteristics

#### 3. Lean-Back Audio Experience

**Description:** Minimal interface design where audio starts playing when the app opens. Primary interaction is time spent listening. Basic playback controls (play, pause, skip) are available but unobtrusive.

**Rationale:** Removes friction and creates media consumption experience rather than study tool, aligning with engagement-first design. The model's emphasis on naturalistic acquisition requires an experience that doesn't feel like learning.

**Model Integration:**
- Interface design supports model's emphasis on meaning-focused processing
- Interaction patterns align with model predictions about engagement and attention
- Experience design reflects model understanding of how acquisition occurs during natural consumption

#### 4. Content Generation Pipeline

**Description:** System generates Italian text content (narratives, dialogues, podcast scripts, educational explanations) and converts to audio using free TTS APIs. Content includes basic repetition and variation (same topic/content expressed with different complexity levels), where repetition patterns are determined by the foundation model.

**Rationale:** Enables infinite content generation within free API constraints, solving the volume problem while providing format diversity to maintain engagement. Model-driven generation ensures content serves acquisition goals.

**Model Integration:**
- Generation pipeline implements model-specified content patterns
- Repetition and variation follow model predictions about frequency effects
- Content diversity aligns with model understanding of contextual variation needs
- Generation parameters reflect model operational principles

#### 5. Basic Engagement Tracking

**Description:** Track listening duration, session frequency, content completion rates, and basic behavioral signals (pauses, replays, skips). Data collection is passive and invisible to user.

**Rationale:** Provides foundation for future adaptation while validating engagement hypothesis in MVP. Behavioral signals are interpreted according to the foundation model's understanding of comprehension indicators.

**Model Integration:**
- Signal collection aligns with model predictions about meaningful behavioral indicators
- Engagement metrics reflect model understanding of what constitutes productive exposure
- Behavioral interpretation follows model framework for comprehension inference
- Tracking design supports model's emphasis on naturalistic measurement

#### 6. User Onboarding

**Description:** Simple initial setup to establish baseline difficulty preference (self-reported or inferred from first session). No complex profile creation required.

**Rationale:** Enables personalization without overwhelming new users. Onboarding establishes initial model state, allowing the system to begin generating model-appropriate content immediately.

**Model Integration:**
- Onboarding questions/process reflect model understanding of initial learner state
- Baseline establishment follows model framework for learner representation
- Initial content selection uses model principles to calibrate starting point

#### 7. Web App Format

**Description:** Accessible via web browser (responsive design for mobile and desktop). No native app required for MVP.

**Rationale:** Reduces development complexity and enables rapid iteration, aligns with free API constraints.

---

### Out of Scope for MVP

#### Sophisticated Learner Model Refinement

**What's Deferred:** Fine-grained linguistic modeling (constructional, discourse-level tracking), confidence intervals, ensemble models, or trend detection beyond basic patterns. MVP uses coarse difficulty levels only, but these are still model-informed.

**Rationale:** Core experience must work without perfect modeling; sophisticated adaptation can be added incrementally. The foundation model provides theoretical grounding even with coarse implementation.

**Model Note:** The model's full sophistication may be deferred, but its core principles must be operational in MVP.

#### Real-Time Adaptive Flow

**What's Deferred:** Mid-stream complexity adjustments during listening. MVP adapts at content selection level (between episodes/sessions), not during playback.

**Rationale:** Requires advanced sensing and low-latency generation; not necessary for initial value delivery. Model principles can be validated with session-level adaptation first.

#### Video Integration

**What's Deferred:** Video fetching, semantic extraction, or video-audio relationships. MVP is audio-only.

**Rationale:** Video is Phase 3+ enrichment; core audio experience must be validated first. Model validation should focus on audio-only implementation initially.

#### Explicit Progress Tracking

**What's Deferred:** Visible progress bars, levels, scores, or achievement systems. MVP has no explicit learning metrics visible to users.

**Rationale:** Aligns with "forget you're learning" principle; progress is implicit through content evolution. Model validation occurs through behavioral signals, not explicit metrics.

#### Social Features

**What's Deferred:** User profiles, sharing, community, or collaborative features. MVP is individual experience only.

**Rationale:** Core value proposition doesn't require social features; adds complexity without clear MVP benefit. Model focuses on individual acquisition processes.

#### Multiple Languages

**What's Deferred:** Support for languages other than Italian. MVP is Italian-only.

**Rationale:** Validates approach for one language before expanding; reduces complexity. Model validation should focus on single-language implementation first.

#### Offline Mode

**What's Deferred:** Downloadable content for offline listening. MVP requires internet connection for content generation and streaming.

**Rationale:** Adds significant technical complexity; not essential for MVP validation.

#### Advanced Content Types

**What's Deferred:** Complex dialogue systems, interactive narratives, branching storylines, or highly interactive content. MVP focuses on linear content (stories, podcasts, educational segments) that can be consumed passively.

**Rationale:** Core engagement hypothesis can be validated with simpler content structure; interactivity adds complexity without clear MVP benefit. Model principles can be demonstrated with linear content.

#### Comprehensive Analytics Dashboard

**What's Deferred:** Detailed user analytics, learning reports, or progress visualizations. MVP has minimal analytics visible to users.

**Rationale:** Analytics are internal tooling; user-facing analytics not required for MVP. Model validation occurs through behavioral signals, not user-facing reports.

#### Payment/Subscription System

**What's Deferred:** Monetization features, subscription management, or payment processing. MVP is free to validate product-market fit.

**Rationale:** Revenue features can be added after validation; not required for MVP.

---

### MVP Success Criteria

**The MVP is considered successful if it demonstrates:**

1. **Model Operationalization:** The foundation language acquisition model is successfully operationalized in content generation and adaptation. Content generation follows model principles, and adaptation decisions reflect model predictions. The model is not just referenced—it actively drives system behavior.

2. **Engagement Validation:** Users consistently listen for 20+ minutes per session (target: 30+ minutes) without feeling like "study time," proving that diverse content formats (stories, podcasts, educational) and lean-back experience create sustained attention. This validates that model-driven content can sustain engagement.

3. **Content Quality:** Generated Italian content (across all formats) is grammatically correct, coherent, and engaging enough to maintain interest across multiple episodes. Users report content feels "natural" rather than "generated," regardless of format (narrative, podcast, or educational). Model-driven generation produces high-quality content.

4. **Model-Informed Adaptation Works:** Coarse difficulty adaptation (lexical vs. discourse-heavy) successfully matches user comprehension level when driven by model principles, evidenced by:
   - Appropriate completion rates (70%+)
   - Minimal abandonment due to difficulty mismatch
   - User-reported satisfaction with content appropriateness
   - Behavioral signals align with model predictions about comprehension

5. **Volume Achievement:** Users accumulate 20+ hours of listening within first 3 months, demonstrating that the app provides sufficient exposure volume to drive acquisition. Model-driven content generation enables the volume needed for acquisition.

6. **Retention Signal:** 30%+ of users return after 30 days, indicating the app delivers ongoing value and fits into user lifestyles. Model-driven personalization creates value that sustains usage.

7. **Technical Feasibility:** System operates within free-tier API limits, proving economic viability. Content generation pipeline is stable and reliable. Model-driven generation is technically feasible with available resources.

8. **Core Value Proposition Validated:** Users report that the experience feels like "entertainment" or "media consumption" rather than "learning," validating the engagement-first approach. Model-driven content achieves the "forget you're learning" goal.

9. **Model Validation:** Behavioral signals and user outcomes align with model predictions about acquisition processes. The model's operational principles are validated through user behavior and outcomes.

10. **No Critical Blockers:** No fundamental technical, content, or engagement issues that would prevent scaling to Phase 2 features (refined model implementation, passive sensing, refined adaptation).

**MVP Failure Criteria (indicating need to pivot):**
- Average session duration <15 minutes (engagement hypothesis fails, model-driven content doesn't sustain attention)
- 30-day retention <20% (value delivery insufficient, model-driven personalization doesn't create value)
- Users consistently report content feels "like studying" (core value proposition fails, model principles don't achieve naturalistic experience)
- Technical limitations prevent reliable content generation (feasibility fails, model operationalization is technically infeasible)
- Model principles don't translate to effective content generation or adaptation (model operationalization fails)

---

## Model Integration Summary

**Key Principle:** The foundation language acquisition model is not an add-on or reference—it is the **core driver** of the MVP. Every feature, every decision, every design choice should be traceable back to model principles.

**MVP Must Demonstrate:**
- Model principles can be operationalized in content generation
- Model-driven adaptation creates value for users
- Model predictions align with user behavior and outcomes
- Model provides coherent theoretical foundation for the entire system

**Post-MVP Refinement:**
- Model sophistication can increase (finer granularity, more precise predictions)
- Model validation can deepen (more signals, longer-term outcomes)
- Model principles can expand (additional mechanisms, broader scope)
- But MVP must prove the model works in basic operational form

---

**Next:** See **brief-v2-goals-metrics.md** for success metrics aligned with model validation.
