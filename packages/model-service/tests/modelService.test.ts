/**
 * Unit tests for ModelService Class
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModelService, createModelService } from '../src/model-service';
import { BehavioralEvent } from '../src/interfaces/types/behavioral-event.type';
import { LikeEngagement } from '../src/interfaces/types/like-engagement.type';
import { UserPreferences } from '../src/interfaces/types/user-preferences.type';
import { LearnerState } from '../src/interfaces/v1/learner-state.interface';

describe('ModelService', () => {
  let modelService: ModelService;

  beforeEach(() => {
    modelService = createModelService();
  });

  describe('getVersion', () => {
    it('should return v1', () => {
      expect(modelService.getVersion()).toBe('v1');
    });
  });

  describe('getGenerationParameters', () => {
    it('should return generation parameters', () => {
      const preferences: UserPreferences = {
        difficultyPreference: 'intermediate',
        preferredFormats: ['narrative', 'podcast'],
        preferredGenres: ['adventure'],
        playbackSpeed: 1.0,
        autoPlay: true,
      };

      const params = modelService.getGenerationParameters(preferences);

      expect(params.lexicalNoveltyBudget).toBeGreaterThan(0);
      expect(params.constructionSets.length).toBeGreaterThan(0);
      expect(params.variationPattern).toBeDefined();
      expect(params.comprehensibilityTarget).toBeGreaterThanOrEqual(0);
      expect(params.comprehensibilityTarget).toBeLessThanOrEqual(1);
      expect(params.semanticStability).toBeGreaterThanOrEqual(0);
      expect(params.semanticStability).toBeLessThanOrEqual(1);
    });
  });

  describe('getAdaptationRecommendations', () => {
    it('should return adaptation recommendations', () => {
      const preferences: UserPreferences = {
        difficultyPreference: 'intermediate',
        preferredFormats: ['narrative'],
        preferredGenres: ['adventure'],
        playbackSpeed: 1.0,
        autoPlay: true,
      };

      const events: BehavioralEvent[] = [];
      const likes: LikeEngagement[] = [];

      const recommendations = modelService.getAdaptationRecommendations(
        events,
        likes,
        preferences
      );

      expect(recommendations.recommendedFormats.length).toBeGreaterThan(0);
      expect(recommendations.recommendedGenres.length).toBeGreaterThanOrEqual(0);
      expect(recommendations.difficultyAdjustment).toBeGreaterThanOrEqual(-1);
      expect(recommendations.difficultyAdjustment).toBeLessThanOrEqual(1);
      expect(recommendations.templateRecommendations.length).toBeGreaterThan(0);
    });
  });

  describe('interpretSignals', () => {
    it('should interpret behavioral signals', () => {
      const events: BehavioralEvent[] = [];
      const likes: LikeEngagement[] = [];

      const interpretation = modelService.interpretSignals(events, likes);

      expect(interpretation.comprehensionLevel).toBeGreaterThanOrEqual(0);
      expect(interpretation.comprehensionLevel).toBeLessThanOrEqual(1);
      expect(interpretation.preferenceWeights.narrative).toBeGreaterThanOrEqual(0);
      expect(interpretation.preferenceWeights.podcast).toBeGreaterThanOrEqual(0);
      expect(interpretation.preferenceWeights.educational).toBeGreaterThanOrEqual(0);
      expect(interpretation.contentTypePreferences).toBeDefined();
    });
  });

  describe('updateLearnerState', () => {
    it('should update learner state', () => {
      const interpretation = modelService.interpretSignals([], []);

      const state = modelService.updateLearnerState(interpretation);

      expect(state.comprehensionLevel).toBeGreaterThanOrEqual(0);
      expect(state.comprehensionLevel).toBeLessThanOrEqual(1);
      expect(state.dataPoints).toBe(1);
      expect(state.lastUpdated).toBeInstanceOf(Date);
    });

    it('should update existing learner state', () => {
      const initialState: LearnerState = {
        preferenceWeights: {
          narrative: 0.5,
          podcast: 0.3,
          educational: 0.2,
        },
        comprehensionLevel: 0.6,
        contentTypePreferences: {
          formatScores: {},
          genreScores: {},
          difficultyScores: {},
        },
        difficultyAdjustment: 0,
        lastUpdated: new Date(),
        dataPoints: 5,
      };

      const interpretation = modelService.interpretSignals([], []);
      const updatedState = modelService.updateLearnerState(interpretation, initialState);

      expect(updatedState.dataPoints).toBe(initialState.dataPoints + 1);
    });
  });

  describe('getLearnerState', () => {
    it('should return learner state', () => {
      const initialState = modelService.updateLearnerState(
        modelService.interpretSignals([], [])
      );

      const retrieved = modelService.getLearnerState(initialState);

      expect(retrieved).toEqual(initialState);
    });
  });

  describe('getPromptEngineeringGuidance', () => {
    it('should return prompt engineering guidance', () => {
      const preferences: UserPreferences = {
        difficultyPreference: 'intermediate',
        preferredFormats: ['narrative'],
        preferredGenres: ['adventure'],
        playbackSpeed: 1.0,
        autoPlay: true,
      };

      const params = modelService.getGenerationParameters(preferences);
      const guidance = modelService.getPromptEngineeringGuidance(preferences, params);

      expect(guidance.meaningFirstApproach).toBeDefined();
      expect(guidance.variationSpecification).toBeDefined();
      expect(guidance.comprehensibilityGuidance).toBeDefined();
      expect(guidance.semanticAnchoringGuidance).toBeDefined();
    });
  });

  describe('createModelService', () => {
    it('should create ModelService instance', () => {
      const service = createModelService();

      expect(service).toBeInstanceOf(ModelService);
      expect(service.getVersion()).toBe('v1');
    });
  });
});
