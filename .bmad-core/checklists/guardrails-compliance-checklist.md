<!-- Powered by BMAD™ Core -->

# Guardrails Compliance Checklist

**Use this checklist before starting and after completing each story.**

[[LLM: This checklist ensures ambitious project guardrails are followed. Go through each section systematically. If any item fails, pause and address it before proceeding.]]

## PRE-DEVELOPMENT CHECK (Before Starting Story)

### MVP Priority & Order
- [ ] MVP is complete (if story is V1+)
- [ ] Story belongs to correct version for current phase
- [ ] No higher-priority MVP stories pending (if working on V1+)

### Scope Boundaries
- [ ] Story version identified (MVP/V1/V2)
- [ ] Story features are IN the current epic scope
- [ ] Story features are NOT deferred to future versions (check PRD)
- [ ] No "nice-to-have" additions planned beyond acceptance criteria

### Artifacts Ready
- [ ] Story file exists in `docs/stories/`
- [ ] PRD epic file referenced and reviewed
- [ ] Architecture docs relevant to story reviewed
- [ ] Issue/ticket exists and linked to story

### QA Readiness
- [ ] QA risk assessment completed (`@qa *risk {story}`)
- [ ] QA test design completed (`@qa *design {story}`)
- [ ] Test strategy understood

### Context Discipline
- [ ] Focused on ONLY this story (no multi-story context)
- [ ] Will reference files, not copy full context
- [ ] Will update story file during implementation
- [ ] Will write summary when complete

**If any item above is [ ], DO NOT START. Address missing items first.**

---

## DURING DEVELOPMENT (Self-Check During Implementation)

### Scope Discipline
- [ ] Implementing ONLY acceptance criteria from story
- [ ] No "while I'm here" additions
- [ ] Future enhancements documented in notes, not implemented

### MVP Priority Maintained
- [ ] Code supports MVP functionality (if MVP story) or doesn't block it
- [ ] No infrastructure built that MVP doesn't need

### Artifact Updates
- [ ] Story file updated with implementation decisions
- [ ] Issue tracker updated with progress
- [ ] Architecture updated if changed

### Testing Integration
- [ ] Tests written WITH code, not after
- [ ] Tests follow QA test design
- [ ] Tests cover acceptance criteria

**If scope creep detected, STOP and reassess. Document in story file.**

---

## POST-DEVELOPMENT CHECK (Before Marking "Review" or "Done")

### MVP Validation (if MVP story)
- [ ] MVP core functionality still works end-to-end
- [ ] MVP smoke tests pass
- [ ] No breaking changes to MVP

### Scope Compliance
- [ ] All acceptance criteria met
- [ ] Nothing extra added beyond story scope
- [ ] Feature belongs to current epic version
- [ ] No deferred features accidentally included

### Artifact Completeness
- [ ] Story file has implementation summary
- [ ] Story file lists files changed
- [ ] Story file documents test coverage
- [ ] Issue/ticket status updated
- [ ] Architecture updated if changed

### Testing Completeness
- [ ] Tests written per QA test design
- [ ] All tests pass locally
- [ ] Test coverage adequate for story requirements
- [ ] No flaky tests introduced

### Documentation Quality
- [ ] Story file summary clear and concise
- [ ] Key decisions reference specific files/sections
- [ ] Next agent can understand what was done

**If any item above is [ ], DO NOT MARK COMPLETE. Fix issues first.**

---

## VIOLATIONS TO WATCH FOR

⚠️ **Red Flags (STOP and fix):**
- Working on V1+ while MVP incomplete
- Implementing features from future versions
- Adding features not in acceptance criteria
- No tests written
- Artifacts not updated

⚠️ **Yellow Flags (Review and justify):**
- Scope slightly expanded (document rationale)
- Architecture changed without updating docs
- Tests written after implementation (should be with code)

---

## QUICK DECISION TREE

**"Should I add this feature?"**
→ Check: Is it in story acceptance criteria? → YES: Add it → NO: Document in notes, defer

**"Should I start V1 story?"**
→ Check: Is MVP complete and tested? → YES: Proceed → NO: Block or work on MVP

**"Should I implement this 'easy' addition?"**
→ Check: Is it in current epic scope? → YES: Check with user → NO: Document for future epic

**"Tests written after code - is that OK?"**
→ Answer: NO. Write tests WITH code, not after. Fix now.

---

**Related Documents:**
- `docs/ambitious-project-guardrails.md` (full guardrails)
- `docs/development-guardrails-enforcement.md` (enforcement guide)
