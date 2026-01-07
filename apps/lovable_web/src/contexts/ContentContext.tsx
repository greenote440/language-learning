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
      return [...prev, newContent];
    });
  };

  // Placeholder for future API integration
  const loadContent = async (contentId: string): Promise<Content | null> => {
    // Check if already loaded
    const existing = getContent(contentId);
    if (existing) {
      return existing;
    }

    // TODO: Implement API call to fetch content
    // For now, return null
    return null;
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
