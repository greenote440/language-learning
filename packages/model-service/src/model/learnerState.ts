/**
 * Learner State Module
 * 
 * Implements model-based learner state tracking.
 * Applies foundation model principles: probabilistic competence map,
 * overlapping competence estimates, non-linear progression.
 */

import { LearnerState } from '../interfaces/v1/learner-state.interface';
import { SignalInterpretation } from '../interfaces/v1/signal-interpretation.interface';

/**
 * Create initial learner state.
 * 
 * @param initialPreferences - Optional initial preference weights
 * @returns Initial learner state
 */
export function createInitialLearnerState(
  initialPreferences?: {
    preferenceWeights?: Partial<LearnerState['preferenceWeights']>;
    comprehensionLevel?: number;
  }
): LearnerState {
  return {
    preferenceWeights: {
      narrative: initialPreferences?.preferenceWeights?.narrative ?? 0.33,
      podcast: initialPreferences?.preferenceWeights?.podcast ?? 0.33,
      educational: initialPreferences?.preferenceWeights?.educational ?? 0.33,
    },
    comprehensionLevel: initialPreferences?.comprehensionLevel ?? 0.5,
    contentTypePreferences: {
      formatScores: {},
      genreScores: {},
      difficultyScores: {},
    },
    difficultyAdjustment: 0,
    lastUpdated: new Date(),
    dataPoints: 0,
  };
}

/**
 * Update learner state based on signal interpretation.
 * 
 * Implements:
 * - Probabilistic competence map updates
 * - State persistence structure (ready for database storage)
 * - Overlapping competence estimates (non-linear progression)
 * 
 * Model principles:
 * - Probabilistic competence tracking: Updates are probabilistic, not deterministic
 * - Non-linear progression: Competence estimates overlap, not level-based
 * - Meaning-driven updates: State reflects model understanding of acquisition
 * 
 * @param signalInterpretation - Interpreted behavioral signals
 * @param currentState - Current learner state (optional, creates initial if not provided)
 * @returns Updated learner state
 */
export function updateLearnerState(
  signalInterpretation: SignalInterpretation,
  currentState?: LearnerState
): LearnerState {
  // Create initial state if not provided
  const state = currentState ?? createInitialLearnerState();

  // Update comprehension level using exponential moving average
  // Model principle: Probabilistic updates, not abrupt changes
  const alpha = 0.3; // Learning rate for comprehension level
  const newComprehensionLevel =
    state.comprehensionLevel * (1 - alpha) +
    signalInterpretation.comprehensionLevel * alpha;

  // Update preference weights using weighted average
  // Model principle: Preferences evolve gradually
  const preferenceAlpha = 0.2; // Learning rate for preferences
  const updatedPreferenceWeights = { ...state.preferenceWeights };

  Object.keys(signalInterpretation.preferenceWeights).forEach((key) => {
    const currentWeight = updatedPreferenceWeights[key] ?? 0;
    const signalWeight = signalInterpretation.preferenceWeights[key] ?? 0;
    updatedPreferenceWeights[key] =
      currentWeight * (1 - preferenceAlpha) + signalWeight * preferenceAlpha;
  });

  // Normalize preference weights to sum to 1.0 (for format weights)
  const formatSum =
    (updatedPreferenceWeights.narrative ?? 0) +
    (updatedPreferenceWeights.podcast ?? 0) +
    (updatedPreferenceWeights.educational ?? 0);

  if (formatSum > 0) {
    updatedPreferenceWeights.narrative =
      (updatedPreferenceWeights.narrative ?? 0) / formatSum;
    updatedPreferenceWeights.podcast =
      (updatedPreferenceWeights.podcast ?? 0) / formatSum;
    updatedPreferenceWeights.educational =
      (updatedPreferenceWeights.educational ?? 0) / formatSum;
  }

  // Update content type preferences using weighted average
  const contentTypeAlpha = 0.25; // Learning rate for content type preferences
  const updatedContentTypePreferences = {
    formatScores: mergeScores(
      state.contentTypePreferences.formatScores,
      signalInterpretation.contentTypePreferences.formatScores,
      contentTypeAlpha
    ),
    genreScores: mergeScores(
      state.contentTypePreferences.genreScores,
      signalInterpretation.contentTypePreferences.genreScores,
      contentTypeAlpha
    ),
    difficultyScores: mergeScores(
      state.contentTypePreferences.difficultyScores,
      signalInterpretation.contentTypePreferences.difficultyScores,
      contentTypeAlpha
    ),
  };

  // Calculate difficulty adjustment based on comprehension level
  // Model principle: Difficulty adjustment reflects comprehension margin
  const difficultyAdjustment = calculateDifficultyAdjustmentFromComprehension(
    newComprehensionLevel,
    state.comprehensionLevel
  );

  return {
    preferenceWeights: updatedPreferenceWeights,
    comprehensionLevel: Math.max(0, Math.min(1, newComprehensionLevel)),
    contentTypePreferences: updatedContentTypePreferences,
    difficultyAdjustment,
    lastUpdated: new Date(),
    dataPoints: state.dataPoints + 1,
  };
}

/**
 * Merge scores using exponential moving average.
 */
function mergeScores(
  currentScores: Record<string, number>,
  newScores: Record<string, number>,
  alpha: number
): Record<string, number> {
  const merged: Record<string, number> = { ...currentScores };

  Object.entries(newScores).forEach(([key, value]) => {
    const current = merged[key] ?? 0;
    merged[key] = current * (1 - alpha) + value * alpha;
  });

  return merged;
}

/**
 * Calculate difficulty adjustment from comprehension level change.
 * Model principle: Maintain comprehension margin (i+ε zone).
 */
function calculateDifficultyAdjustmentFromComprehension(
  newComprehensionLevel: number,
  previousComprehensionLevel: number
): number {
  const change = newComprehensionLevel - previousComprehensionLevel;

  // If comprehension is improving, can slightly increase difficulty
  if (change > 0.1) {
    return 0.1; // Small positive adjustment
  }

  // If comprehension is declining, decrease difficulty
  if (change < -0.1) {
    return -0.2; // Larger negative adjustment
  }

  // If comprehension is very high (>0.9), can increase difficulty
  if (newComprehensionLevel > 0.9) {
    return 0.15;
  }

  // If comprehension is very low (<0.3), decrease difficulty
  if (newComprehensionLevel < 0.3) {
    return -0.25;
  }

  // Otherwise, maintain current difficulty
  return 0;
}

/**
 * Get learner state representation.
 * 
 * @param currentState - Current learner state
 * @returns Learner state representation
 */
export function getLearnerState(currentState: LearnerState): LearnerState {
  return {
    ...currentState,
    // Return a copy to prevent mutation
  };
}
