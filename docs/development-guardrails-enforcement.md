# Development Guardrails Enforcement Guide

See `docs/ambitious-project-guardrails.md` for full guardrails.

## ✅ Pre-Development Checklist

- [ ] MVP complete? (Block V1+ if MVP incomplete)
- [ ] Correct version? (MVP → V1 → V2)
- [ ] Story file exists in `docs/stories/`
- [ ] PRD epic referenced
- [ ] QA risk/design completed
- [ ] Issue/ticket linked

---

## 🔍 During Development

- [ ] Only implementing acceptance criteria (no "while I'm here" additions)
- [ ] Feature not deferred to later version?
- [ ] Updating story file as work progresses
- [ ] Writing tests WITH code (not after)
- [ ] Referencing files, not copying full context

---

## 📋 Post-Development Validation

- [ ] All acceptance criteria met, nothing extra
- [ ] MVP tests pass (if MVP story)
- [ ] Story file updated (summary, files changed, test coverage)
- [ ] Issue tracker updated
- [ ] Architecture updated (if changed)
- [ ] All tests pass

---

## 🔄 Agent Responsibilities

**@dev:** Run checklists above. Block V1+ if MVP incomplete. Update artifacts continuously.

**@qa:** Verify scope boundaries. Flag scope creep. Ensure MVP tests exist.

**@po:** Audit scope compliance. Verify MVP before V1/V2. Consolidate docs after each version.

---

## 🚨 Common Violations

1. **V1+ started while MVP incomplete** → Check MVP status before starting
2. **Future version features added** → Verify PRD scope before implementing
3. **Artifacts not updated** → Update story file and issue tracker continuously
4. **Tests written after code** → Write tests WITH code
5. **Scope creep** → Implement only acceptance criteria
