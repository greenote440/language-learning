import { createContext, useContext, useState, ReactNode } from 'react';

// Simplified Content interface for MVP
export interface Content {
  id: string;
  title: string;
  subtitle?: string;
  audioUrl?: string;
  duration?: number;
  format: 'narrative' | 'podcast' | 'educational';
}

interface ContentContextType {
  content: Content[];
  currentContentId: string | null;
  getContent: (contentId: string) => Content | undefined;
  setCurrentContentId: (contentId: string | null) => void;
  addContent: (content: Content) => void;
  // For future API integration
  loadContent: (contentId: string) => Promise<Content | null>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [content, setContent] = useState<Content[]>([]);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);

  const getContent = (contentId: string): Content | undefined => {
    return content.find((c) => c.id === contentId);
  };

  const addContent = (newContent: Content) => {
    setContent((prev) => {
      // Don't add duplicates
      if (prev.find((c) => c.id === newContent.id)) {
        return prev;
      }
      const updated = [...prev, newContent];
      return updated;
    });
  };

  // Load content from API
  const loadContent = async (contentId: string): Promise<Content | null> => {
    console.log(`[ContentContext] loadContent called for: ${contentId}`);
    
    // Check if already loaded
    const existing = getContent(contentId);
    if (existing) {
      console.log(`[ContentContext] Content ${contentId} already loaded`);
      return existing;
    }

    // Skip mock content IDs
    if (contentId.startsWith('mock-')) {
      console.warn(`[ContentContext] Skipping mock content ID: ${contentId}`);
      return null;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const url = `${API_BASE_URL}/api/content/${contentId}`;
      console.log(`[ContentContext] Fetching content from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`[ContentContext] Response status for ${contentId}:`, response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json().catch(() => ({ error: { message: 'Content not found' } }));
          console.warn(`[ContentContext] Content not found (404): ${contentId}`, errorData);
          // Return null to indicate content doesn't exist (old/invalid ID)
          return null;
        }
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`[ContentContext] API error for ${contentId}:`, response.status, errorText);
        throw new Error(`Failed to load content: ${response.statusText}`);
      }

      const apiContent = await response.json();
      console.log(`[ContentContext] Received API content for ${contentId}:`, apiContent);
      
      // Convert API content to context format
      const contextContent: Content = {
        id: apiContent.id,
        title: apiContent.title,
        subtitle: apiContent.description,
        audioUrl: apiContent.audioUrl || '',
        duration: apiContent.duration,
        format: apiContent.format,
      };

      console.log(`[ContentContext] Converted content for ${contentId}:`, contextContent);

      // Add to context
      addContent(contextContent);
      console.log(`[ContentContext] Added content ${contentId} to context. Total content:`, content.length + 1);
      return contextContent;
    } catch (error) {
      console.error(`[ContentContext] Exception loading content ${contentId}:`, error);
      if (error instanceof TypeError) {
        console.error(`[ContentContext] Network error details:`, {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
      return null;
    }
  };

  const value: ContentContextType = {
    content,
    currentContentId,
    getContent,
    setCurrentContentId,
    addContent,
    loadContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
