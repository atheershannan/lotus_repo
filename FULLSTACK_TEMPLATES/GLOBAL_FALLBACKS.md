# 🆘 GLOBAL FALLBACKS & RECOVERY PROCEDURES

> **Emergency procedures and recovery strategies for each stage**

---

## 🔄 General Recovery Principles

1. **Always backup before reset**
2. **Document what went wrong**
3. **Use entry questions to recalibrate**
4. **Don't skip safety checks**
5. **Ask for clarification if unsure**

---

## 🆘 Stage 01: Requirements & Planning

### Common Issues
- ❌ Requirements too vague
- ❌ User stories incomplete
- ❌ Scope keeps changing

### Recovery Steps
1. Run: `RESET_STAGE 01`
2. Answer entry questions more specifically
3. Use pseudo-code dialogue to clarify gaps
4. Document scope changes in ROADMAP.md
5. Re-generate templates with refined answers

### Fallback Questions
- "What EXACTLY should the system do first?"
- "What are the MUST-HAVE features vs NICE-TO-HAVE?"
- "Who are the primary users?"

---

## 🆘 Stage 02: System & Architecture

### Common Issues
- ❌ Endpoints spec incomplete
- ❌ Architecture unclear
- ❌ Tech stack incompatible

### Recovery Steps
1. Review REQUIREMENTS_TEMPLATE output
2. Use TECH_STACK_TEMPLATE to reevaluate choices
3. Consult pseudo-code dialogue for architectural decisions
4. Update ENDPOINTS_SPEC.md with corrections
5. Re-run with corrected parameters

### Fallback Questions
- "What are your hosting constraints?"
- "What's your team's expertise?"
- "What's the expected load?"

---

## 🆘 Stage 03: Project Flow

### Common Issues
- ❌ Flow missing screens
- ❌ Interactions undefined
- ❌ State management unclear

### Recovery Steps
1. Review user stories from Stage 01
2. Check ENDPOINTS_SPEC.md for API contracts
3. Use INTERACTION_LOGIC_TEMPLATE to fill gaps
4. Walk through flows manually
5. Update FLOW_DIAGRAM_TEMPLATE

### Fallback Questions
- "What happens when user clicks X?"
- "Where does data come from?"
- "What's the error handling flow?"

---

## 🆘 Stage 04: Backend TDD Planning

### Common Issues
- ❌ Test cases incomplete
- ❌ API contracts violated
- ❌ TDD strategy unclear

### Recovery Steps
1. Review ENDPOINTS_SPEC.md thoroughly
2. Use TDD_PLAN_TEMPLATE to structure tests
3. Ensure test cases cover all edge cases
4. Verify API design matches contracts
5. Re-generate with corrections

### Fallback Questions
- "What should fail gracefully?"
- "What are the success/error responses?"
- "How do we handle edge cases?"

---

## 🆘 Stage 05: Frontend TDD Planning

### Common Issues
- ❌ Component structure wrong
- ❌ UI flow missing states
- ❌ Accessibility overlooked

### Recovery Steps
1. Review flow diagrams from Stage 03
2. Use COMPONENT_STRUCTURE_TEMPLATE to reorganize
3. Map all UI states (loading, error, success)
4. Add accessibility requirements
5. Re-plan component hierarchy

### Fallback Questions
- "What happens while data loads?"
- "How do errors display?"
- "What's the mobile experience?"

---

## 🆘 Stage 06: Database Design

### Common Issues
- ❌ Schema incomplete
- ❌ Relations missing
- ❌ Indexes not planned

### Recovery Steps
1. Review data models from Stage 02
2. Check requirements for all entities
3. Use SCHEMA_AND_RELATIONS_TEMPLATE
4. Add indexes for performance
5. Plan migrations carefully

### Fallback Questions
- "What entities need relations?"
- "What queries need optimization?"
- "How will data scale?"

---

## 🆘 Stage 07: QA & Testing Strategy

### Common Issues
- ❌ Test coverage too low
- ❌ E2E scenarios missing
- ❌ Test data strategy unclear

### Recovery Steps
1. Review all TDD plans from Stages 04 & 05
2. Use INTEGRATION_TEST_PLAN_TEMPLATE
3. Add edge case scenarios
4. Define test data strategy
5. Set coverage thresholds

### Fallback Questions
- "What flows are critical?"
- "What data do we need?"
- "How do we test edge cases?"

---

## 🆘 Stage 08: Implementation

### Common Issues
- ❌ Tests failing
- ❌ Code not matching TDD plans
- ❌ Integration problems

### Recovery Steps
1. **Don't skip tests** - Fix before proceeding
2. Review TDD plans from Stages 04 & 05
3. Run tests after each feature
4. Use CODE_REVIEW_TEMPLATE if quality is low
5. Fix integration issues incrementally

### Critical Recovery Commands
```bash
# Run tests
npm test

# Check coverage
npm run test:coverage

# Run linter
npm run lint

# Fix and re-test
```

### Fallback Questions
- "Which tests are failing and why?"
- "Does implementation match TDD plan?"
- "Have you run tests after each change?"

---

## 🆘 Stage 09: Deployment

### Common Issues
- ❌ CI/CD pipeline failing
- ❌ Environment issues
- ❌ Deployment scripts broken

### Recovery Steps
1. Check GitHub Actions logs
2. Test deployment scripts locally
3. Verify environment variables
4. Run smoke tests manually
5. Fix and re-deploy incrementally

### Critical Recovery Commands
```bash
# Test locally first
npm run build
npm test

# Check environment
echo $NODE_ENV

# Test deployment script
./deploy.sh --dry-run
```

### Fallback Questions
- "What environment is failing?"
- "Are all secrets configured?"
- "Did smoke tests pass?"

---

## 🔄 RESET_STAGE Command

Use this when you need to start a stage over:

**Usage:**
```
RESET_STAGE [stage_number]
```

**Example:**
```
RESET_STAGE 04
```

**What it does:**
1. Creates backup of current stage
2. Clears stage-specific files
3. Re-asks entry questions
4. Allows fresh start

**Safety:**
- Always backs up first
- Requires confirmation
- Logs reset in ROADMAP.md

---

## 🛡️ Prevention Strategies

### Before Starting Each Stage
1. ✅ Previous stage fully complete
2. ✅ All checklists marked done
3. ✅ Decisions documented
4. ✅ No outstanding blockers

### During Each Stage
1. ✅ Follow TDD principles
2. ✅ Run tests frequently
3. ✅ Document decisions
4. ✅ Review pseudo-dialogues

### After Each Stage
1. ✅ Complete all checklist items
2. ✅ Update ROADMAP.md
3. ✅ Review generated content
4. ✅ Run final validation

---

## 📞 Emergency Escalation

If you're completely stuck:

1. **Document the problem** in ROADMAP.md
2. **Identify the blocker** specifically
3. **Use pseudo-code dialogue** to reason through
4. **Consult GLOBAL_FALLBACKS** (this file)
5. **Reset and retry** if needed

---

## 🎯 Recovery Checklist

When recovering from an issue:
- [ ] Identify root cause
- [ ] Document in ROADMAP.md
- [ ] Use appropriate fallback procedure
- [ ] Re-answer entry questions if needed
- [ ] Verify with tests/validation
- [ ] Update GLOBAL_CHECKLIST.md
- [ ] Continue to next stage

---

**Remember:** It's better to reset and do it right than to proceed with errors.

