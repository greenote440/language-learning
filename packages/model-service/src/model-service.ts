/**
 * Model Service Implementation
 * 
 * Main ModelService class implementing foundation language acquisition model.
 * Provides versioned API for content generation, adaptation, signal interpretation,
 * and learner state management.
 */

import { ModelService as IModelService } from './interfaces/v1/model-service.interface';
import { GenerationParameters } from './interfaces/v1/generation-parameters.interface';
import { AdaptationRecommendations } from './interfaces/v1/adaptation-recommendations.interface';
import { SignalInterpretation } from './interfaces/v1/signal-interpretation.interface';
import { LearnerState } from './interfaces/v1/learner-state.interface';
import { UserPreferences } from './interfaces/types/user-preferences.type';
import { BehavioralEvent } from './interfaces/types/behavioral-event.type';
import { LikeEngagement } from './interfaces/types/like-engagement.type';

import { getGenerationParameters, getPromptEngineeringGuidance } from './model/generationParameters';
import { getAdaptationRecommendations } from './model/adaptationEngine';
import { interpretSignals } from './model/signalInterpreter';
import { updateLearnerState, getLearnerState as getState } from './model/learnerState';

/**
 * ModelService v1 Implementation
 * 
 * Centralized service implementing foundation language acquisition model principles.
 * Provides APIs for:
 * - Content generation parameters
 * - Adaptation recommendations
 * - Behavioral signal interpretation
 * - Learner state management
 */
export class ModelService implements IModelService {
  private readonly version = 'v1';

  /**
   * Get generation parameters based on model principles and user preferences.
   * 
   * @param userPreferences - User preferences for difficulty, formats, genres
   * @returns Generation parameters aligned with model principles
   */
  getGenerationParameters(userPreferences: UserPreferences): GenerationParameters {
    return getGenerationParameters(userPreferences);
  }

  /**
   * Get adaptation recommendations based on behavioral signals and learner state.
   * 
   * @param recentEvents - Recent behavioral events
   * @param recentLikes - Recent like engagement data
   * @param userPreferences - User preferences
   * @param currentLearnerState - Current learner state (optional)
   * @returns Adaptation recommendations
   */
  getAdaptationRecommendations(
    recentEvents: BehavioralEvent[],
    recentLikes: LikeEngagement[],
    userPreferences: UserPreferences,
    currentLearnerState?: LearnerState
  ): AdaptationRecommendations {
    return getAdaptationRecommendations(
      recentEvents,
      recentLikes,
      userPreferences,
      currentLearnerState
    );
  }

  /**
   * Interpret behavioral signals according to model framework.
   * 
   * @param events - Behavioral events to interpret
   * @param likes - Like engagement data
   * @returns Signal interpretation
   */
  interpretSignals(events: BehavioralEvent[], likes: LikeEngagement[]): SignalInterpretation {
    return interpretSignals(events, likes);
  }

  /**
   * Update learner state based on signal interpretation.
   * 
   * @param signalInterpretation - Interpreted behavioral signals
   * @param currentState - Current learner state (optional, creates initial if not provided)
   * @returns Updated learner state
   */
  updateLearnerState(
    signalInterpretation: SignalInterpretation,
    currentState?: LearnerState
  ): LearnerState {
    return updateLearnerState(signalInterpretation, currentState);
  }

  /**
   * Get current learner state representation.
   * 
   * @param currentState - Current learner state
   * @returns Learner state representation
   */
  getLearnerState(currentState: LearnerState): LearnerState {
    return getState(currentState);
  }

  /**
   * Get API version
   * 
   * @returns API version string
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * Get prompt engineering guidance aligned with model principles.
   * 
   * Helper method for content generation service.
   * 
   * @param userPreferences - User preferences
   * @param generationParameters - Calculated generation parameters
   * @returns Prompt engineering guidance
   */
  getPromptEngineeringGuidance(
    userPreferences: UserPreferences,
    generationParameters: GenerationParameters
  ): {
    meaningFirstApproach: string;
    variationSpecification: string;
    comprehensibilityGuidance: string;
    semanticAnchoringGuidance: string;
  } {
    return getPromptEngineeringGuidance(userPreferences, generationParameters);
  }
}

/**
 * Factory function to create ModelService instance.
 * 
 * @returns ModelService instance
 */
export function createModelService(): ModelService {
  return new ModelService();
}
