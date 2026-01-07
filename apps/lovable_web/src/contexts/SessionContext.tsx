import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { eventService } from '@/services/eventService';

interface SessionContextType {
  sessionId: string;
  contentIds: string[]; // Ordered list of content IDs in session
  currentContentId: string | null;
  addContentId: (contentId: string) => void;
  setCurrentContentId: (contentId: string | null) => void;
  getNextContentId: () => string | null;
  getPreviousContentId: () => string | null;
  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'italian-audio-session';

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [sessionId] = useState<string>(() => {
    // Generate or load session ID
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${STORAGE_KEY}-id`);
      if (stored) {
        eventService.setSessionId(stored);
        return stored;
      }
      const newId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      localStorage.setItem(`${STORAGE_KEY}-id`, newId);
      eventService.setSessionId(newId);
      return newId;
    }
    const newId = `session-${Date.now()}`;
    eventService.setSessionId(newId);
    return newId;
  });

  const [contentIds, setContentIds] = useState<string[]>([]);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Save to localStorage when session changes
  useEffect(() => {
    saveToStorage();
  }, [contentIds, currentContentId]);

  const loadFromStorage = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setContentIds(data.contentIds || []);
        setCurrentContentId(data.currentContentId || null);
      }
    } catch (error) {
      console.error('Failed to load session from storage:', error);
    }
  };

  const saveToStorage = () => {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        sessionId,
        contentIds,
        currentContentId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  };

  const addContentId = (contentId: string) => {
    setContentIds((prev) => {
      // Don't add duplicates, but maintain order
      if (prev.includes(contentId)) {
        return prev;
      }
      return [...prev, contentId];
    });
  };

  const getNextContentId = (): string | null => {
    if (!currentContentId) return null;
    const currentIndex = contentIds.indexOf(currentContentId);
    if (currentIndex === -1 || currentIndex === contentIds.length - 1) {
      return null; // No next content
    }
    return contentIds[currentIndex + 1];
  };

  const getPreviousContentId = (): string | null => {
    if (!currentContentId) return null;
    const currentIndex = contentIds.indexOf(currentContentId);
    if (currentIndex <= 0) {
      return null; // No previous content
    }
    return contentIds[currentIndex - 1];
  };

  const value: SessionContextType = {
    sessionId,
    contentIds,
    currentContentId,
    addContentId,
    setCurrentContentId,
    getNextContentId,
    getPreviousContentId,
    loadFromStorage,
    saveToStorage,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
