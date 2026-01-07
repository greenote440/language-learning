/**
 * Generation Parameters Interface (v1)
 * 
 * Parameters for content generation determined by model principles.
 * These parameters guide the content generation service to produce
 * model-aligned content.
 */

/**
 * Generation parameters for content generation.
 * Determined by model principles (meaning-first, comprehensibility, variation).
 */
export interface GenerationParameters {
  /**
   * Lexical novelty budget: Rate of new vocabulary introduction.
   * Controls how many new words/lemmas per segment.
   * Example: 0.05 = 1 new lemma per 20 tokens
   */
  lexicalNoveltyBudget: number;

  /**
   * Construction sets: Grammatical patterns appropriate for difficulty level.
   * Array of construction identifiers or pattern specifications.
   * Example: ['present-tense', 'simple-questions', 'basic-connectives']
   */
  constructionSets: string[];

  /**
   * Variation pattern: Specification for controlled variation.
   * Describes how to vary phrasing while maintaining semantic stability.
   * Example: 'same-meaning-different-syntax' | 'same-syntax-different-slots'
   */
  variationPattern: string;

  /**
   * Comprehensibility target: Target comprehensibility score (0-1).
   * Model-calculated target for semantic accessibility.
   * Higher = more comprehensible, lower = more challenging
   */
  comprehensibilityTarget: number;

  /**
   * Semantic stability: Requirement for meaning anchoring.
   * Ensures language is coupled to non-linguistic context.
   * Higher = more stable meaning, lower = more abstract
   */
  semanticStability: number;

  /**
   * Discourse complexity: Discourse complexity level (post-MVP).
   * Optional for MVP, reserved for future use.
   */
  discourseComplexity?: number;

  /**
   * Vocabulary level: Vocabulary level specification (post-MVP).
   * Optional for MVP, reserved for future use.
   */
  vocabularyLevel?: string;

  /**
   * Grammar complexity: Grammar complexity level (post-MVP).
   * Optional for MVP, reserved for future use.
   */
  grammarComplexity?: number;
}
