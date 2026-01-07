// User Preferences Utility - Loads and manages user preferences from localStorage

import type { UserPreferences } from '@/services/contentService';

const PREFERENCES_STORAGE_KEY = 'italian-audio-preferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  difficultyPreference: 'beginner',
  preferredFormats: ['narrative', 'podcast', 'educational'],
  preferredGenres: [],
  autoPlay: true,
  playbackSpeed: 1.0,
};

/**
 * Load user preferences from localStorage
 */
export const loadPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Failed to load preferences from storage:', error);
  }

  return DEFAULT_PREFERENCES;
};

/**
 * Save user preferences to localStorage
 */
export const savePreferences = (preferences: UserPreferences): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences to storage:', error);
  }
};
