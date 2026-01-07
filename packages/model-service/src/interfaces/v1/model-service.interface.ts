/**
 * Model Service Interface (v1)
 * 
 * Main interface for the Model Service API.
 * Provides methods for content generation parameters, adaptation decisions,
 * signal interpretation, and learner state management.
 */

import { GenerationParameters } from './generation-parameters.interface';
import { AdaptationRecommendations } from './adaptation-recommendations.interface';
import { SignalInterpretation } from './signal-interpretation.interface';
import { LearnerState } from './learner-state.interface';
import { UserPreferences } from '../types/user-preferences.type';
import { BehavioralEvent } from '../types/behavioral-event.type';
import { LikeEngagement } from '../types/like-engagement.type';

/**
 * Model Service API v1
 * 
 * Centralized service implementing foundation language acquisition model principles.
 * Provides APIs for content generation, adaptation, signal interpretation, and learner state.
 */
export interface ModelService {
  /**
   * Get generation parameters based on model principles and user preferences.
   * 
   * @param userPreferences - User preferences for difficulty, formats, genres
   * @returns Generation parameters aligned with model principles
   */
  getGenerationParameters(userPreferences: UserPreferences): GenerationParameters;

  /**
   * Get adaptation recommendations based on behavioral signals and learner state.
   * 
   * @param recentEvents - Recent behavioral events
   * @param recentLikes - Recent like engagement data
   * @param userPreferences - User preferences
   * @param currentLearnerState - Current learner state (optional)
   * @returns Adaptation recommendations (formats, genres, difficulty, templates)
   */
  getAdaptationRecommendations(
    recentEvents: BehavioralEvent[],
    recentLikes: LikeEngagement[],
    userPreferences: UserPreferences,
    currentLearnerState?: LearnerState
  ): AdaptationRecommendations;

  /**
   * Interpret behavioral signals according to model framework.
   * 
   * @param events - Behavioral events to interpret
   * @param likes - Like engagement data
   * @returns Signal interpretation (comprehension level, preferences, content type preferences)
   */
  interpretSignals(
    events: BehavioralEvent[],
    likes: LikeEngagement[]
  ): SignalInterpretation;

  /**
   * Update learner state based on signal interpretation.
   * 
   * @param signalInterpretation - Interpreted behavioral signals
   * @param currentState - Current learner state (optional, creates initial state if not provided)
   * @returns Updated learner state
   */
  updateLearnerState(
    signalInterpretation: SignalInterpretation,
    currentState?: LearnerState
  ): LearnerState;

  /**
   * Get current learner state representation.
   * 
   * @param currentState - Current learner state
   * @returns Learner state representation
   */
  getLearnerState(currentState: LearnerState): LearnerState;

  /**
   * Get API version
   */
  getVersion(): string;
}
