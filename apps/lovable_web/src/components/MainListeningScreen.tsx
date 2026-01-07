import React, { useState, useEffect, useCallback, useRef } from "react";
import { Settings } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import LikeButton from "./LikeButton";
import ComprehensionButton from "./ComprehensionButton";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useContent, type Content } from "@/contexts/ContentContext";
import { useSession } from "@/contexts/SessionContext";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { loadPreferences } from "@/utils/preferences";

const formatBadge: Record<Content['format'], string> = {
  narrative: 'Racconto',
  podcast: 'Podcast',
  educational: 'Lezione',
};

interface MainListeningScreenProps {
  initialClip?: {
    id: string;
    title: string;
    subtitle?: string;
    format: 'narrative' | 'podcast' | 'educational';
    audioUrl: string;
    duration: number;
  };
  onContentChange?: (direction: 'forward' | 'backward') => void;
  onLike?: (clipId: string, liked: boolean) => void;
  onComprehensionReport?: (clipId: string, percentage: number) => void;
}

interface ContentItemProps {
  content: Content;
  isActive: boolean;
  episodePosition?: { current: number; total: number };
  onLike?: (clipId: string, liked: boolean) => void;
  onComprehensionReport?: (clipId: string, percentage: number) => void;
}

// Individual content item component (full viewport height)
const ContentItem = ({ content, isActive, episodePosition, onLike, onComprehensionReport }: ContentItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const lastActiveStateRef = useRef(isActive);

  // Handle auto-play/pause when item becomes active/inactive
  // Each AudioPlayer is independent, so we control it directly via the audio element
  useEffect(() => {
    if (!itemRef.current) return;

    // Find the audio element in this component's subtree
    const findAndControlAudio = () => {
      const audioElement = itemRef.current?.querySelector('audio') as HTMLAudioElement;
      if (!audioElement) return false;

      audioElementRef.current = audioElement;

      if (isActive && content.audioUrl) {
        // Check if audio is ready to play
        if (audioElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
          audioElement.play().catch((err) => {
            console.log('Auto-play blocked or failed:', err);
            // Auto-play blocked - user will need to click play
          });
        } else {
          // Wait for metadata to load
          const handleCanPlay = () => {
            if (isActive) {
              audioElement.play().catch((err) => {
                console.log('Auto-play blocked:', err);
              });
            }
            audioElement.removeEventListener('canplay', handleCanPlay);
          };
          audioElement.addEventListener('canplay', handleCanPlay);
        }
        return true;
      } else if (!isActive) {
        // Pause when not active
        audioElement.pause();
        return true;
      }
      return false;
    };

    // Try to find and control audio immediately
    if (!findAndControlAudio() && isActive) {
      // If audio element not found yet, retry after a delay
      const timeoutId = setTimeout(() => {
        findAndControlAudio();
      }, 200);
      return () => clearTimeout(timeoutId);
    }

    lastActiveStateRef.current = isActive;
  }, [isActive, content.audioUrl]);

  const handleLike = (liked: boolean) => {
    onLike?.(content.id, liked);
  };

  const handleComprehension = (percentage: number) => {
    onComprehensionReport?.(content.id, percentage);
  };

  return (
    <div
      ref={itemRef}
      className="min-h-screen w-full flex flex-col snap-start"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 flex-shrink-0">
        <div className="w-12" /> {/* Spacer for balance */}
        <h1 className="font-serif text-lg text-muted-foreground tracking-wide">
          Italiano
        </h1>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-safe">
        {/* Episode Info */}
        <div className="text-center mb-10 md:mb-14 max-w-lg animate-fade-in">
          {/* Episode Position Indicator */}
          {episodePosition && (
            <div className="mb-3 text-xs text-muted-foreground font-medium">
              Episodio {episodePosition.current} di {episodePosition.total}
            </div>
          )}
          
          {/* Format Badge */}
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase bg-secondary text-secondary-foreground rounded-full">
            {formatBadge[content.format]}
          </span>

          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-3">
            {content.title}
          </h2>

          {/* Subtitle */}
          {content.subtitle && (
            <p className="text-muted-foreground text-base md:text-lg">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Audio Player */}
        <div className="w-full max-w-md mb-10 md:mb-14">
          {content.audioUrl ? (
            <AudioPlayer audioUrl={content.audioUrl} />
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              Audio URL non disponibile
            </div>
          )}
        </div>

        {/* Feedback Controls */}
        <div className="flex items-center gap-4">
          <LikeButton onLike={handleLike} />
          <ComprehensionButton onSelect={handleComprehension} />
        </div>
      </main>
    </div>
  );
};

const MainListeningScreen = ({
  initialClip,
  onContentChange,
  onLike,
  onComprehensionReport,
}: MainListeningScreenProps) => {
  // Contexts
  const audioPlayer = useAudioPlayer();
  const contentContext = useContent();
  const session = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const contentItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isGeneratingRef = useRef(false);

  // Content generation hook
  const { generate, isGenerating } = useContentGeneration({
    onSuccess: (content) => {
      console.log('Content generated successfully:', content.id);
      isGeneratingRef.current = false;
      // Scroll to the new content after a brief delay to ensure it's rendered
      setTimeout(() => {
        scrollToContent(content.id);
      }, 100);
    },
    onError: (error) => {
      console.error('Content generation failed:', error);
      isGeneratingRef.current = false;
    },
  });

  // Get all content items from session, with fallback to contentContext
  const contentItems = React.useMemo(() => {
    // First try to get content from session.contentIds
    if (session.contentIds.length > 0) {
      const items = session.contentIds
        .map(id => {
          const content = contentContext.getContent(id);
          if (!content) {
            console.warn('Content not found for ID:', id);
          }
          return content;
        })
        .filter((content): content is Content => content !== undefined);
      
      if (items.length > 0) {
        return items;
      }
    }
    
    // Fallback: use all content from contentContext if session is empty
    if (contentContext.content.length > 0) {
      console.log('Using fallback: content from ContentContext directly');
      return contentContext.content;
    }
    
    return [];
  }, [session.contentIds, contentContext]);

  // Debug logging
  useEffect(() => {
    console.log('MainListeningScreen - Session contentIds:', session.contentIds);
    console.log('MainListeningScreen - ContentContext content:', contentContext.content);
    console.log('MainListeningScreen - ContentItems:', contentItems);
    console.log('MainListeningScreen - Current contentId:', session.currentContentId);
  }, [session.contentIds, contentContext.content, contentItems, session.currentContentId]);

  // Initialize with initial clip if provided
  useEffect(() => {
    if (initialClip && !audioPlayer.state.currentContent) {
      const content: Content = {
        id: initialClip.id,
        title: initialClip.title,
        subtitle: initialClip.subtitle,
        audioUrl: initialClip.audioUrl,
        duration: initialClip.duration,
        format: initialClip.format,
      };
      
      // Add to contexts
      contentContext.addContent(content);
      session.addContentId(content.id);
      session.setCurrentContentId(content.id);
      
      // Load into audio player (only if audioUrl exists)
      if (content.audioUrl) {
        audioPlayer.loadContent({
          id: content.id,
          title: content.title,
          audioUrl: content.audioUrl,
          duration: content.duration,
          format: content.format,
        });
      }
    }
  }, [initialClip, audioPlayer, contentContext, session]);

  // Set up Intersection Observer to detect which content item is in view
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxEntry = entries[0];
        let maxRatio = entries[0]?.intersectionRatio || 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxEntry = entry;
          }
        });

        // If we have an entry that's mostly in view, set it as active
        if (maxEntry && maxEntry.isIntersecting && maxEntry.intersectionRatio > 0.5) {
          // Find the content ID for this element
          const contentId = Array.from(contentItemRefs.current.entries()).find(
            ([_, element]) => element === maxEntry.target
          )?.[0];

          if (contentId && session.currentContentId !== contentId) {
            const content = contentContext.getContent(contentId);
            if (content) {
              session.setCurrentContentId(contentId);
              onContentChange?.('forward'); // Could be improved to detect direction
            }
          }
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '0px',
        threshold: [0.25, 0.5, 0.75, 1.0],
      }
    );

    // Observe all content items after a brief delay to ensure they're rendered
    const timeoutId = setTimeout(() => {
      contentItemRefs.current.forEach((element) => {
        observerRef.current?.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, [contentItems.length, contentContext, session, onContentChange]);

  // Scroll to specific content
  const scrollToContent = useCallback((contentId: string) => {
    const element = contentItemRefs.current.get(contentId);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handle scroll end to detect if we need to generate new content
  const handleScrollEnd = useCallback(() => {
    if (!scrollContainerRef.current || isGeneratingRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Check if we're near the bottom (within 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (isNearBottom) {
      // Check if we're at the last content item
      const lastContentId = session.contentIds[session.contentIds.length - 1];
      const currentContentId = session.currentContentId;

      if (lastContentId === currentContentId && !isGeneratingRef.current) {
        // Generate new content
        isGeneratingRef.current = true;
        const preferences = loadPreferences();
        generate(preferences).catch((err) => {
          console.error('Failed to generate content on scroll:', err);
          isGeneratingRef.current = false;
        });
      }
    }
  }, [session, generate]);

  // Set up scroll end detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleScrollEnd();
      }, 150); // Wait for scroll to settle
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScrollEnd]);

  // Register content item refs
  const registerContentRef = useCallback((contentId: string, element: HTMLDivElement | null) => {
    if (element) {
      contentItemRefs.current.set(contentId, element);
      observerRef.current?.observe(element);
    } else {
      contentItemRefs.current.delete(contentId);
    }
  }, []);

  // Determine which content is currently active (in view)
  const activeContentId = session.currentContentId || contentItems[0]?.id || null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
        }}
      >
        {contentItems.length === 0 ? (
          <div className="min-h-screen w-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No content available</p>
            </div>
          </div>
        ) : (
          contentItems.map((content, index) => {
            const episodePosition = {
              current: index + 1,
              total: contentItems.length,
            };
            
            return (
              <div
                key={content.id}
                ref={(el) => registerContentRef(content.id, el)}
              >
                <ContentItem
                  content={content}
                  isActive={activeContentId === content.id}
                  episodePosition={episodePosition}
                  onLike={onLike}
                  onComprehensionReport={onComprehensionReport}
                />
              </div>
            );
          })
        )}

        {/* Loading indicator at bottom when generating */}
        {isGenerating && (
          <div className="min-h-screen w-full flex items-center justify-center snap-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground text-sm">Generando contenuto...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainListeningScreen;
