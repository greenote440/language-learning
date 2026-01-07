/**
 * Storage Cleanup Utility
 * 
 * Utilities to clean up old mock data and invalid session data from localStorage
 */

const SESSION_STORAGE_KEY = 'italian-audio-session';
const SESSION_ID_KEY = 'italian-audio-session-id';

/**
 * Clear all session data from localStorage
 */
export function clearSessionStorage(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  console.log('Session storage cleared');
}

/**
 * Clean up mock content IDs from session storage
 */
export function cleanupMockData(): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const validContentIds = (data.contentIds || []).filter((id: string) => !id.startsWith('mock-'));
      
      if (validContentIds.length !== (data.contentIds || []).length) {
        const cleanedData = {
          ...data,
          contentIds: validContentIds,
          currentContentId: data.currentContentId && !data.currentContentId.startsWith('mock-')
            ? data.currentContentId
            : (validContentIds.length > 0 ? validContentIds[0] : null),
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cleanedData));
        console.log('Cleaned up mock data from session storage');
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Failed to cleanup mock data:', error);
    return false;
  }
}

/**
 * Check if session contains mock data
 */
export function hasMockData(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const contentIds = data.contentIds || [];
      return contentIds.some((id: string) => id.startsWith('mock-'));
    }
    return false;
  } catch (error) {
    return false;
  }
}
