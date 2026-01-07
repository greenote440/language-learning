/**
 * Generation Parameters Module
 * 
 * Implements model-driven parameter calculation for content generation.
 * Applies foundation model principles: meaning-first, comprehensibility before correctness,
 * variation is essential, meaning anchoring, statistical abstraction.
 */

import { GenerationParameters } from '../interfaces/v1/generation-parameters.interface';
import { UserPreferences } from '../interfaces/types/user-preferences.type';

/**
 * Get generation parameters based on model principles and user preferences.
 * 
 * Implements:
 * - Meaning-first approach (prioritizes semantic grounding over grammatical complexity)
 * - Comprehensibility before correctness (gates by semantic access, not grammar mastery)
 * - Variation pattern calculation (controlled variation around stable meaning)
 * - Lexical novelty budget (determines new vocabulary introduction rate)
 * - Construction sets selection (grammatical patterns appropriate for difficulty level)
 * - Prompt engineering guidance (meaning-first prompts, controlled variation specifications)
 * 
 * @param userPreferences - User preferences for difficulty, formats, genres
 * @returns Generation parameters aligned with model principles
 */
export function getGenerationParameters(
  userPreferences: UserPreferences
): GenerationParameters {
  // Map difficulty preference to model parameters
  const difficultyConfig = getDifficultyConfig(userPreferences.difficultyPreference);

  // Calculate lexical novelty budget based on difficulty
  // Model principle: Beginner = lower novelty (1 new lemma per 20-25 tokens)
  //                   Intermediate = moderate novelty (1 new lemma per 15-20 tokens)
  //                   Advanced = higher novelty (1 new lemma per 10-15 tokens)
  const lexicalNoveltyBudget = calculateLexicalNoveltyBudget(
    userPreferences.difficultyPreference
  );

  // Select construction sets based on difficulty
  // Model principle: Comprehensibility before correctness - gate by semantic access
  const constructionSets = selectConstructionSets(
    userPreferences.difficultyPreference
  );

  // Determine variation pattern
  // Model principle: Variation is essential - controlled variation around stable meaning
  const variationPattern = determineVariationPattern(
    userPreferences.difficultyPreference
  );

  // Calculate comprehensibility target
  // Model principle: Input must sit in zone of partial understanding (i+ε)
  const comprehensibilityTarget = calculateComprehensibilityTarget(
    userPreferences.difficultyPreference
  );

  // Calculate semantic stability requirement
  // Model principle: Meaning anchoring - language coupled to non-linguistic context
  const semanticStability = calculateSemanticStability(
    userPreferences.difficultyPreference
  );

  return {
    lexicalNoveltyBudget,
    constructionSets,
    variationPattern,
    comprehensibilityTarget,
    semanticStability,
  };
}

/**
 * Get difficulty configuration for model parameters.
 */
function getDifficultyConfig(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): {
  noveltyRate: number;
  comprehensibilityMin: number;
  semanticStabilityMin: number;
} {
  switch (difficulty) {
    case 'beginner':
      return {
        noveltyRate: 0.04, // 1 new lemma per 25 tokens
        comprehensibilityMin: 0.7, // High comprehensibility target
        semanticStabilityMin: 0.8, // High semantic stability (strong meaning anchoring)
      };
    case 'intermediate':
      return {
        noveltyRate: 0.06, // 1 new lemma per ~17 tokens
        comprehensibilityMin: 0.6, // Moderate comprehensibility target
        semanticStabilityMin: 0.7, // Moderate semantic stability
      };
    case 'advanced':
      return {
        noveltyRate: 0.08, // 1 new lemma per ~12 tokens
        comprehensibilityMin: 0.5, // Lower comprehensibility (more challenging)
        semanticStabilityMin: 0.6, // Lower semantic stability (more abstract)
      };
  }
}

/**
 * Calculate lexical novelty budget.
 * Model principle: Controls rate of new vocabulary introduction.
 */
function calculateLexicalNoveltyBudget(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  const config = getDifficultyConfig(difficulty);
  return config.noveltyRate;
}

/**
 * Select construction sets based on difficulty.
 * Model principle: Comprehensibility before correctness - gate by semantic access.
 */
function selectConstructionSets(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): string[] {
  switch (difficulty) {
    case 'beginner':
      return [
        'present-tense',
        'simple-questions',
        'basic-connectives',
        'declarative-statements',
        'simple-negation',
      ];
    case 'intermediate':
      return [
        'present-tense',
        'past-tense',
        'future-tense',
        'conditional',
        'simple-questions',
        'complex-questions',
        'basic-connectives',
        'advanced-connectives',
        'relative-clauses',
        'declarative-statements',
        'negation',
      ];
    case 'advanced':
      return [
        'present-tense',
        'past-tense',
        'future-tense',
        'conditional',
        'subjunctive',
        'passive-voice',
        'all-question-types',
        'all-connectives',
        'relative-clauses',
        'complex-sentences',
        'all-statement-types',
        'all-negation-patterns',
      ];
  }
}

/**
 * Determine variation pattern.
 * Model principle: Variation is essential - controlled variation around stable meaning.
 */
function determineVariationPattern(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): string {
  switch (difficulty) {
    case 'beginner':
      // Same meaning, minimal syntax variation
      return 'same-meaning-minimal-variation';
    case 'intermediate':
      // Same meaning, moderate syntax variation
      return 'same-meaning-moderate-variation';
    case 'advanced':
      // Same meaning, extensive syntax and register variation
      return 'same-meaning-extensive-variation';
  }
}

/**
 * Calculate comprehensibility target.
 * Model principle: Input must sit in zone of partial understanding (i+ε).
 */
function calculateComprehensibilityTarget(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  const config = getDifficultyConfig(difficulty);
  // Add small random variation to avoid over-regularization
  const base = config.comprehensibilityMin;
  const variation = (Math.random() - 0.5) * 0.1; // ±0.05 variation
  return Math.max(0.3, Math.min(0.95, base + variation));
}

/**
 * Calculate semantic stability requirement.
 * Model principle: Meaning anchoring - language coupled to non-linguistic context.
 */
function calculateSemanticStability(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  const config = getDifficultyConfig(difficulty);
  // Add small random variation
  const base = config.semanticStabilityMin;
  const variation = (Math.random() - 0.5) * 0.1; // ±0.05 variation
  return Math.max(0.5, Math.min(0.95, base + variation));
}

/**
 * Get prompt engineering guidance aligned with model principles.
 * 
 * Returns guidance for constructing meaning-first prompts with controlled variation.
 * 
 * @param userPreferences - User preferences
 * @param generationParameters - Calculated generation parameters
 * @returns Prompt engineering guidance
 */
export function getPromptEngineeringGuidance(
  userPreferences: UserPreferences,
  generationParameters: GenerationParameters
): {
  meaningFirstApproach: string;
  variationSpecification: string;
  comprehensibilityGuidance: string;
  semanticAnchoringGuidance: string;
} {
  return {
    meaningFirstApproach: `Generate content that prioritizes semantic grounding over grammatical complexity. Ensure meaning is clear through context, not just grammatical form. Use ${generationParameters.constructionSets.length} construction patterns: ${generationParameters.constructionSets.join(', ')}.`,
    variationSpecification: `Apply variation pattern: ${generationParameters.variationPattern}. Maintain semantic stability (${generationParameters.semanticStability.toFixed(2)}) while varying linguistic form.`,
    comprehensibilityGuidance: `Target comprehensibility: ${generationParameters.comprehensibilityTarget.toFixed(2)}. Ensure input sits in zone of partial understanding - enough known material to infer meaning, enough unknown to generate learning.`,
    semanticAnchoringGuidance: `Anchor language to non-linguistic context (narrative, situation, intent). Semantic stability requirement: ${generationParameters.semanticStability.toFixed(2)}.`,
  };
}
