/**
 * Unit tests for Learner State Module
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialLearnerState,
  updateLearnerState,
  getLearnerState,
} from '../src/model/learnerState';
import { SignalInterpretation } from '../src/interfaces/v1/signal-interpretation.interface';
import { LearnerState } from '../src/interfaces/v1/learner-state.interface';

describe('Learner State', () => {
  const createMockInterpretation = (
    comprehensionLevel: number = 0.7
  ): SignalInterpretation => ({
    comprehensionLevel,
    preferenceWeights: {
      narrative: 0.5,
      podcast: 0.3,
      educational: 0.2,
    },
    contentTypePreferences: {
      formatScores: { narrative: 0.8, podcast: 0.6 },
      genreScores: { adventure: 0.9 },
      difficultyScores: { 'lexical-heavy': 0.7 },
    },
  });

  describe('createInitialLearnerState', () => {
    it('should create initial state with default values', () => {
      const state = createInitialLearnerState();

      expect(state.preferenceWeights.narrative).toBe(0.33);
      expect(state.preferenceWeights.podcast).toBe(0.33);
      expect(state.preferenceWeights.educational).toBe(0.33);
      expect(state.comprehensionLevel).toBe(0.5);
      expect(state.difficultyAdjustment).toBe(0);
      expect(state.dataPoints).toBe(0);
      expect(state.lastUpdated).toBeInstanceOf(Date);
    });

    it('should create initial state with custom preferences', () => {
      const state = createInitialLearnerState({
        preferenceWeights: {
          narrative: 0.6,
          podcast: 0.4,
        },
        comprehensionLevel: 0.7,
      });

      expect(state.preferenceWeights.narrative).toBe(0.6);
      expect(state.preferenceWeights.podcast).toBe(0.4);
      expect(state.comprehensionLevel).toBe(0.7);
    });
  });

  describe('updateLearnerState', () => {
    it('should update state from signal interpretation', () => {
      const initialState = createInitialLearnerState();
      const interpretation = createMockInterpretation(0.8);

      const updatedState = updateLearnerState(interpretation, initialState);

      expect(updatedState.comprehensionLevel).toBeGreaterThan(initialState.comprehensionLevel);
      expect(updatedState.dataPoints).toBe(initialState.dataPoints + 1);
      expect(updatedState.lastUpdated).toBeInstanceOf(Date);
    });

    it('should create initial state if not provided', () => {
      const interpretation = createMockInterpretation(0.7);

      const state = updateLearnerState(interpretation);

      expect(state.comprehensionLevel).toBeGreaterThan(0);
      expect(state.comprehensionLevel).toBeLessThanOrEqual(1);
      expect(state.dataPoints).toBe(1);
    });

    it('should update preference weights gradually', () => {
      const initialState = createInitialLearnerState();
      const interpretation = createMockInterpretation();

      const updatedState = updateLearnerState(interpretation, initialState);

      // Weights should move toward interpretation but not jump immediately
      expect(updatedState.preferenceWeights.narrative).toBeGreaterThan(initialState.preferenceWeights.narrative);
      expect(updatedState.preferenceWeights.narrative).toBeLessThan(interpretation.preferenceWeights.narrative);
    });

    it('should update content type preferences', () => {
      const initialState = createInitialLearnerState();
      const interpretation = createMockInterpretation();

      const updatedState = updateLearnerState(interpretation, initialState);

      expect(updatedState.contentTypePreferences.formatScores['narrative']).toBeGreaterThan(0);
      expect(updatedState.contentTypePreferences.genreScores['adventure']).toBeGreaterThan(0);
    });

    it('should calculate difficulty adjustment from comprehension', () => {
      const initialState = createInitialLearnerState({ comprehensionLevel: 0.5 });
      const interpretation = createMockInterpretation(0.9); // High comprehension

      const updatedState = updateLearnerState(interpretation, initialState);

      expect(updatedState.difficultyAdjustment).toBeGreaterThanOrEqual(-1);
      expect(updatedState.difficultyAdjustment).toBeLessThanOrEqual(1);
    });

    it('should handle multiple updates', () => {
      let state = createInitialLearnerState();
      const interpretation1 = createMockInterpretation(0.6);
      const interpretation2 = createMockInterpretation(0.8);

      state = updateLearnerState(interpretation1, state);
      state = updateLearnerState(interpretation2, state);

      expect(state.dataPoints).toBe(2);
      expect(state.comprehensionLevel).toBeGreaterThan(0.5);
    });
  });

  describe('getLearnerState', () => {
    it('should return copy of learner state', () => {
      const state = createInitialLearnerState();
      const retrieved = getLearnerState(state);

      expect(retrieved).toEqual(state);
      expect(retrieved).not.toBe(state); // Should be a copy
    });
  });
});
