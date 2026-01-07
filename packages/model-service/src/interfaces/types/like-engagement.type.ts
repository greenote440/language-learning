/**
 * Like Engagement Type
 * 
 * Like engagement data for model service preference inference.
 * Used as input to model service for signal interpretation.
 */

import { ContentCharacteristics } from './behavioral-event.type';

/**
 * Like engagement for model service preference inference.
 */
export interface LikeEngagement {
  contentId: string;
  liked: boolean;
  likedAt: Date | null;
  sessionId: string;
  contentCharacteristics: ContentCharacteristics;
}
