# Model Service Extension Guide

This guide documents extension points for future model refinement and increased sophistication in Phase 2+.

## Versioning Strategy

The Model Service API is versioned to support model evolution without breaking changes:

- **v1 (Current):** Initial implementation with heuristic-based algorithms
- **v2+ (Future):** Enhanced implementations with increased sophistication

### Adding New Versions

1. Create new interface directory: `src/interfaces/v2/`
2. Extend or modify interfaces as needed
3. Implement new version in `src/model-service.ts` with version detection
4. Maintain backward compatibility for v1 API

## Extension Points

### 1. Generation Parameters

**Location:** `src/model/generationParameters.ts`

**Current Implementation:**
- Rule-based difficulty configuration
- Fixed construction sets per difficulty level
- Simple variation pattern selection

**Future Enhancements:**
- Dynamic construction set selection based on learner history
- Context-aware variation patterns
- Multi-dimensional comprehensibility calculation
- Discourse complexity modeling (currently post-MVP)

**Extension Points:**
- `getDifficultyConfig()` - Can be enhanced with learner-specific calibration
- `selectConstructionSets()` - Can incorporate construction frequency analysis
- `determineVariationPattern()` - Can add context-aware variation selection
- `calculateComprehensibilityTarget()` - Can incorporate multi-factor analysis

### 2. Adaptation Engine

**Location:** `src/model/adaptationEngine.ts`

**Current Implementation:**
- Signal-based difficulty adjustment
- Format/genre recommendation from preferences
- Template recommendation generation

**Future Enhancements:**
- Fine-grained construction-level adaptation
- Multi-register control
- Cross-session long-term decay modeling
- Bayesian mastery estimation

**Extension Points:**
- `calculateDifficultyAdjustment()` - Can incorporate probabilistic models
- `determineRecommendedFormats()` - Can add format transition modeling
- `analyzeComprehensionSignals()` - Can enhance with temporal pattern analysis

### 3. Signal Interpreter

**Location:** `src/model/signalInterpreter.ts`

**Current Implementation:**
- Heuristic-based comprehension inference
- Simple preference weight calculation
- Basic content type preference inference

**Future Enhancements:**
- Probabilistic competence tracking with confidence intervals
- Fine-grained construction-level inference
- Multi-dimensional preference modeling
- Temporal pattern analysis

**Extension Points:**
- `inferComprehensionLevel()` - Can add Bayesian inference
- `calculatePreferenceWeights()` - Can incorporate temporal decay
- `inferContentTypePreferences()` - Can add multi-factor preference modeling

### 4. Learner State

**Location:** `src/model/learnerState.ts`

**Current Implementation:**
- Exponential moving average updates
- Simple preference weight normalization
- Basic difficulty adjustment calculation

**Future Enhancements:**
- Probabilistic competence map with confidence intervals
- Construction-level state tracking
- Long-term decay modeling
- Multi-dimensional state representation

**Extension Points:**
- `updateLearnerState()` - Can add Bayesian update mechanisms
- `mergeScores()` - Can incorporate confidence weighting
- `calculateDifficultyAdjustmentFromComprehension()` - Can add multi-factor analysis

## Computational Efficiency

All API methods are designed to execute in < 100ms. When extending:

1. **Profile new algorithms** - Use performance tests to verify < 100ms execution
2. **Cache expensive calculations** - Consider caching for frequently accessed data
3. **Optimize data structures** - Use efficient data structures for large datasets
4. **Lazy evaluation** - Defer expensive calculations until needed

## Model Principles Integration

When extending, ensure new features align with foundation model principles:

1. **Meaning-first approach** - Prioritize semantic grounding
2. **Comprehensibility before correctness** - Gate by semantic access
3. **Variation is essential** - Maintain controlled variation
4. **Prediction under uncertainty** - Use probabilistic approaches
5. **Meaning anchoring** - Couple language to non-linguistic context
6. **Statistical abstraction** - Generalize across exemplars
7. **Re-expression/compression** - Support output tasks

## Testing Extensions

When adding new features:

1. **Unit tests** - Test new functionality in isolation
2. **Performance tests** - Verify < 100ms execution time
3. **Integration tests** - Test with existing functionality
4. **Regression tests** - Ensure existing behavior unchanged

## Documentation

When extending:

1. **Update interfaces** - Document new interface methods
2. **Add JSDoc comments** - Document algorithm choices
3. **Update this guide** - Document new extension points
4. **Version changelog** - Document breaking changes

## Example: Adding Bayesian Inference

To add Bayesian inference for comprehension level:

1. **Create new module:** `src/model/bayesianInference.ts`
2. **Extend interface:** Add optional Bayesian methods to `ModelService` interface
3. **Implement algorithm:** Use Bayesian update formula
4. **Add tests:** Unit and performance tests
5. **Update documentation:** Document new approach

The existing heuristic-based approach remains as fallback for v1 compatibility.
