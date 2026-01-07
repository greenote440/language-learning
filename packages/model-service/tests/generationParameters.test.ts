/**
 * Unit tests for Generation Parameters Module
 */

import { describe, it, expect } from 'vitest';
import { getGenerationParameters, getPromptEngineeringGuidance } from '../src/model/generationParameters';
import { UserPreferences } from '../src/interfaces/types/user-preferences.type';

describe('Generation Parameters', () => {
  const defaultPreferences: UserPreferences = {
    difficultyPreference: 'intermediate',
    preferredFormats: ['narrative', 'podcast'],
    preferredGenres: ['adventure'],
    playbackSpeed: 1.0,
    autoPlay: true,
  };

  describe('getGenerationParameters', () => {
    it('should return generation parameters for beginner difficulty', () => {
      const preferences: UserPreferences = {
        ...defaultPreferences,
        difficultyPreference: 'beginner',
      };

      const params = getGenerationParameters(preferences);

      expect(params.lexicalNoveltyBudget).toBe(0.04);
      expect(params.constructionSets).toContain('present-tense');
      expect(params.constructionSets).toContain('simple-questions');
      expect(params.variationPattern).toBe('same-meaning-minimal-variation');
      expect(params.comprehensibilityTarget).toBeGreaterThanOrEqual(0.3);
      expect(params.comprehensibilityTarget).toBeLessThanOrEqual(0.95);
      expect(params.semanticStability).toBeGreaterThanOrEqual(0.5);
      expect(params.semanticStability).toBeLessThanOrEqual(0.95);
    });

    it('should return generation parameters for intermediate difficulty', () => {
      const params = getGenerationParameters(defaultPreferences);

      expect(params.lexicalNoveltyBudget).toBe(0.06);
      expect(params.constructionSets).toContain('past-tense');
      expect(params.constructionSets).toContain('conditional');
      expect(params.variationPattern).toBe('same-meaning-moderate-variation');
      expect(params.comprehensibilityTarget).toBeGreaterThanOrEqual(0.3);
      expect(params.comprehensibilityTarget).toBeLessThanOrEqual(0.95);
    });

    it('should return generation parameters for advanced difficulty', () => {
      const preferences: UserPreferences = {
        ...defaultPreferences,
        difficultyPreference: 'advanced',
      };

      const params = getGenerationParameters(preferences);

      expect(params.lexicalNoveltyBudget).toBe(0.08);
      expect(params.constructionSets).toContain('subjunctive');
      expect(params.constructionSets).toContain('passive-voice');
      expect(params.variationPattern).toBe('same-meaning-extensive-variation');
      expect(params.comprehensibilityTarget).toBeGreaterThanOrEqual(0.3);
      expect(params.comprehensibilityTarget).toBeLessThanOrEqual(0.95);
    });

    it('should return parameters within valid ranges', () => {
      const params = getGenerationParameters(defaultPreferences);

      expect(params.lexicalNoveltyBudget).toBeGreaterThan(0);
      expect(params.lexicalNoveltyBudget).toBeLessThanOrEqual(0.1);
      expect(params.constructionSets.length).toBeGreaterThan(0);
      expect(params.comprehensibilityTarget).toBeGreaterThanOrEqual(0);
      expect(params.comprehensibilityTarget).toBeLessThanOrEqual(1);
      expect(params.semanticStability).toBeGreaterThanOrEqual(0);
      expect(params.semanticStability).toBeLessThanOrEqual(1);
    });
  });

  describe('getPromptEngineeringGuidance', () => {
    it('should return prompt engineering guidance', () => {
      const params = getGenerationParameters(defaultPreferences);
      const guidance = getPromptEngineeringGuidance(defaultPreferences, params);

      expect(guidance.meaningFirstApproach).toContain('semantic grounding');
      expect(guidance.variationSpecification).toContain('variation pattern');
      expect(guidance.comprehensibilityGuidance).toContain('comprehensibility');
      expect(guidance.semanticAnchoringGuidance).toContain('Semantic stability');
    });

    it('should include construction sets in guidance', () => {
      const params = getGenerationParameters(defaultPreferences);
      const guidance = getPromptEngineeringGuidance(defaultPreferences, params);

      expect(guidance.meaningFirstApproach).toContain(params.constructionSets[0]);
    });
  });
});
