# Guardrails Enforcement - Quick Summary

**How guardrails are now enforced during development:**

## ✅ What I've Set Up

1. **Automatic Loading** (`core-config.yaml`)
   - Guardrails documents now load automatically for all dev agents
   - Agents will see guardrails before starting any work

2. **Enforcement Guide** (`docs/development-guardrails-enforcement.md`)
   - Comprehensive guide with checklists
   - Pre-development, during-development, and post-development checks
   - Integration points for all agents

3. **Compliance Checklist** (`.bmad-core/checklists/guardrails-compliance-checklist.md`)
   - Quick-reference checklist for dev agents
   - Decision trees for common situations
   - Violation warnings

## 🎯 How It Works

### For Developers
- **Before starting:** Agent automatically loads guardrails + runs pre-development checklist
- **During work:** Guardrails guide scope discipline and artifact updates
- **Before completion:** Post-development validation ensures compliance

### For QA
- Reviews check scope boundaries
- Validates Epic 0 priority
- Flags guardrails violations

### For PO
- Periodic audits after each epic
- Consolidates documentation
- Tracks compliance metrics

## 🚨 Key Guardrails Enforced

1. **Epic 0 First** - Critical loop must be complete before other epics
2. **Scope Discipline** - No feature creep, stay in version boundaries
3. **Artifact Updates** - Story files, issues, architecture must be updated
4. **Context Discipline** - One story at a time, file references not copies
5. **Testing Early** - QA risk/design before dev, tests with code

## 📋 Quick Actions

**To enforce guardrails:**
- Dev agents will automatically see guardrails on startup
- Use the compliance checklist before starting each story
- PO agent can audit compliance periodically with `@po`

**To check compliance:**
- Review story files for artifact updates
- Check Epic 0 completion before Epic 1+ stories
- Validate scope boundaries in QA reviews

## 🔗 Files Created

- `docs/development-guardrails-enforcement.md` - Full enforcement guide
- `.bmad-core/checklists/guardrails-compliance-checklist.md` - Quick checklist
- `.bmad-core/core-config.yaml` - Updated to auto-load guardrails

## 📝 Next Steps

1. **Test:** When dev agent starts, verify it loads guardrails documents
2. **Refine:** Adjust checklists based on actual usage
3. **Monitor:** Track violations and improve prevention
4. **Audit:** Use PO agent to periodically review compliance

---

**Related:** See `docs/ambitious-project-guardrails.md` for the full guardrails principles.
