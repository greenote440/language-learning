import { useState, useEffect, useCallback, useRef } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
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

// Intersection Observer threshold for detecting visible AudioPlayer
const INTERSECTION_THRESHOLD = 0.5;
// Debounce time for scroll actions (ms)
const SCROLL_DEBOUNCE = 300;

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

// Individual AudioPlayer item component (displays content metadata)
interface AudioPlayerItemProps {
  content: Content;
  isVisible: boolean;
  onLike: (liked: boolean) => void;
  onComprehension: (percentage: number) => void;
}

const AudioPlayerItem = ({ content, isVisible, onLike, onComprehension }: AudioPlayerItemProps) => {
  const audioPlayer = useAudioPlayer();
  const itemRef = useRef<HTMLDivElement>(null);

  // Load content into audio player when this item becomes visible
  useEffect(() => {
    if (isVisible && audioPlayer.state.currentContent?.id !== content.id) {
      // Load this content into the audio player with auto-play
      audioPlayer.loadContent(content, true);
    }
  }, [isVisible, content, audioPlayer]);

  // Pause when not visible
  useEffect(() => {
    if (!isVisible && audioPlayer.state.currentContent?.id === content.id && audioPlayer.state.isPlaying) {
      audioPlayer.pause();
    }
  }, [isVisible, content.id, audioPlayer]);

  const handleLike = (liked: boolean) => {
    onLike(liked);
  };

  const handleComprehension = (percentage: number) => {
    onComprehension(percentage);
  };

  return (
    <div
      ref={itemRef}
      className="h-screen w-full flex flex-col snap-start snap-always"
      style={{ 
        scrollSnapAlign: 'start',
        minHeight: '100vh', // Full viewport height for each item
      }}
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

        {/* Audio Player - Only show if this content is currently loaded and visible */}
        {isVisible && audioPlayer.state.currentContent?.id === content.id && (
          <div className="w-full max-w-md mb-10 md:mb-14">
            <AudioPlayer />
          </div>
        )}

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

  // Content generation hook
  const { generate, isGenerating, error: generationError } = useContentGeneration({
    onSuccess: (content) => {
      console.log('Content generated successfully:', content.id);
      // Content is automatically added to contexts by the hook
      // Scroll to the new content
      if (content.id) {
        setTimeout(() => {
          scrollToContent(content.id);
        }, 100);
      }
    },
    onError: (error) => {
      console.error('Content generation failed:', error);
    },
  });

  // State
  const [visibleContentId, setVisibleContentId] = useState<string | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isSwitchingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Get all content items from session
  const contentItems = session.contentIds
    .map((contentId) => contentContext.getContent(contentId))
    .filter((content): content is Content => content !== undefined);

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
      
      // Load into audio player
      audioPlayer.loadContent(content);
      setVisibleContentId(content.id);
    }
  }, [initialClip, audioPlayer, contentContext, session]);

  // Set up Intersection Observer to track which AudioPlayer is visible
  // This handles all content switching naturally as user scrolls
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleEntry: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio && entry.intersectionRatio >= INTERSECTION_THRESHOLD) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        }

        if (mostVisibleEntry) {
          const target = mostVisibleEntry.target as HTMLElement;
          const contentId = target.getAttribute('data-content-id');
          if (contentId && contentId !== visibleContentId) {
            // Detect scroll direction by comparing content indices
            const currentIndex = session.contentIds.findIndex((id) => id === visibleContentId);
            const newIndex = session.contentIds.findIndex((id) => id === contentId);
            const direction = newIndex > currentIndex ? 'forward' : 'backward';
            
            setVisibleContentId(contentId);
            const content = contentContext.getContent(contentId);
            if (content) {
              session.setCurrentContentId(contentId);
              onContentChange?.(direction);
              
              // For backward navigation, ensure content is loaded
              if (direction === 'backward') {
                audioPlayer.loadContent(content, true);
              }
            }
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        root: container,
        rootMargin: '0px',
      }
    );

    intersectionObserverRef.current = observer;

    // Observe all content items
    const observeItems = () => {
      itemRefs.current.forEach((element) => {
        observer.observe(element);
      });
    };

    // Observe items after a short delay to ensure refs are set
    const timeoutId = setTimeout(observeItems, 0);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [contentItems.length, visibleContentId, contentContext, session, audioPlayer, onContentChange]);

  // Handle scroll events to trigger content generation when at the end
  // Note: IntersectionObserver handles visibility detection, this only handles content generation
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isSwitchingRef.current || isGenerating) {
      return;
    }

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const containerHeight = container.clientHeight;
    
    // Check if we're near the bottom (within 100px) - user is scrolling forward to end
    const isNearBottom = scrollTop + containerHeight >= scrollHeight - 100;
    
    if (isNearBottom) {
      // User has scrolled to the end, check if we need to generate new content
      const currentContentIndex = session.contentIds.findIndex((id) => id === session.currentContentId);
      const isLastItem = currentContentIndex === session.contentIds.length - 1;
      
      if (isLastItem) {
        // We're at the last item and user scrolled to bottom, generate next
        const nextContentId = session.getNextContentId();
        if (!nextContentId && !isGenerating) {
          isSwitchingRef.current = true;
          onContentChange?.('forward');
          
          const preferences = loadPreferences();
          generate(preferences).catch((error) => {
            console.error('Failed to generate content:', error);
            isSwitchingRef.current = false;
          });
        }
      }
    }
  }, [session, onContentChange, isGenerating, generate]);

  // Set up scroll listener - let browser handle all physics naturally
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initialize scroll position
    lastScrollTopRef.current = container.scrollTop;

    // Track if scroll is actively happening (for debouncing content generation)
    let scrollEndTimeout: NodeJS.Timeout | null = null;
    let isScrollingActive = false;
    
    // Debounced scroll handler - only triggers content logic after scroll settles
    const debouncedHandleScroll = () => {
      // Update scroll direction indicator immediately
      const scrollTop = container.scrollTop;
      const direction = scrollTop > lastScrollTopRef.current ? 'forward' : 'backward';
      lastScrollTopRef.current = scrollTop;
      
      setIsScrolling(true);
      setScrollDirection(direction);
      setShowScrollHint(false);
      
      // Clear previous timeout
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }
      
      // Mark as actively scrolling
      isScrollingActive = true;
      
      // After scroll settles (momentum has finished), trigger content logic
      scrollEndTimeout = setTimeout(() => {
        isScrollingActive = false;
        setIsScrolling(false);
        setScrollDirection(null);
        
        // Now that scroll has settled, check if we need to generate/load content
        // IntersectionObserver will handle visibility, but we need to check direction
        handleScroll();
      }, 300); // Wait for momentum to finish
    };
    
    // Simple scroll listener - browser handles all physics
    container.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', debouncedHandleScroll);
      if (scrollEndTimeout) {
        clearTimeout(scrollEndTimeout);
      }
    };
  }, [handleScroll, contentItems.length]);

  // Hide scroll hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle like action
  const handleLike = useCallback((contentId: string, liked: boolean) => {
    onLike?.(contentId, liked);
  }, [onLike]);

  // Handle comprehension action
  const handleComprehension = useCallback((contentId: string, percentage: number) => {
    onComprehensionReport?.(contentId, percentage);
  }, [onComprehensionReport]);

  // Scroll to specific content - only used for new content generation
  // Uses instant scroll to avoid interfering with momentum
  const scrollToContent = useCallback((contentId: string) => {
    const element = itemRefs.current.get(contentId);
    if (element && scrollContainerRef.current) {
      // Use instant scroll (not smooth) to avoid interfering with user's momentum
      element.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, []);

  // NOTE: Removed auto-scroll on currentContentId change
  // IntersectionObserver handles visibility detection naturally
  // Programmatic scrolling would interrupt user's natural scroll momentum
  
  // Reset switching flag when generation completes
  useEffect(() => {
    if (!isGenerating) {
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, SCROLL_DEBOUNCE);
    }
  }, [isGenerating]);

  // Set initial visible content
  useEffect(() => {
    if (!visibleContentId && session.currentContentId) {
      // Verify content exists before setting as visible
      const content = contentContext.getContent(session.currentContentId);
      if (content) {
        setVisibleContentId(session.currentContentId);
        // Load content into audio player if not already loaded
        if (audioPlayer.state.currentContent?.id !== session.currentContentId) {
          audioPlayer.loadContent(content);
        }
      } else if (contentItems.length > 0) {
        // If current content doesn't exist, use first available content
        setVisibleContentId(contentItems[0].id);
        session.setCurrentContentId(contentItems[0].id);
        audioPlayer.loadContent(contentItems[0]);
      }
    } else if (!visibleContentId && contentItems.length > 0) {
      // No current content set, but we have content items - use first one
      setVisibleContentId(contentItems[0].id);
      session.setCurrentContentId(contentItems[0].id);
      audioPlayer.loadContent(contentItems[0]);
    }
  }, [visibleContentId, session.currentContentId, contentItems, contentContext, audioPlayer, session]);

  // Get current visible content
  const currentVisibleContent = visibleContentId 
    ? contentContext.getContent(visibleContentId) 
    : null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Scrolling Container */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className="absolute inset-0 w-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
          // Note: scrollBehavior removed - let CSS scroll-snap handle all snapping naturally
        }}
      >
        {contentItems.length === 0 && !isGenerating ? (
          <div className="h-screen w-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No content available</p>
            </div>
          </div>
        ) : (
          <>
            {contentItems.map((content) => (
              <div
                key={content.id}
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(content.id, el);
                    // Re-observe if observer exists
                    if (intersectionObserverRef.current) {
                      intersectionObserverRef.current.observe(el);
                    }
                  } else {
                    itemRefs.current.delete(content.id);
                  }
                }}
                data-content-id={content.id}
              >
                <AudioPlayerItem
                  content={content}
                  isVisible={visibleContentId === content.id}
                  onLike={(liked) => handleLike(content.id, liked)}
                  onComprehension={(percentage) => handleComprehension(content.id, percentage)}
                />
              </div>
            ))}
            {/* Loading item for content generation */}
            {isGenerating && (
              <div className="h-screen w-full flex flex-col snap-start snap-always" style={{ minHeight: '100vh' }}>
                <header className="flex items-center justify-between p-4 md:p-6 flex-shrink-0">
                  <div className="w-12" />
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
                <main className="flex-1 flex flex-col items-center justify-center px-6 pb-safe">
                  <div className="text-center mb-10 md:mb-14 max-w-lg">
                    <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground text-base md:text-lg">
                      Generando contenuto...
                    </p>
                  </div>
                </main>
              </div>
            )}
          </>
        )}
      </div>


      {/* Scroll Hint */}
      {showScrollHint && contentItems.length > 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fade-in pointer-events-none z-10">
          <span className="text-xs text-muted-foreground mb-2">Scroll for more</span>
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </div>
      )}

      {/* Scroll Direction Indicator - Only show when actively scrolling */}
      {scrollDirection && isScrolling && (
        <div className={`fixed left-1/2 -translate-x-1/2 
          pointer-events-none z-50 transition-opacity duration-200
          ${scrollDirection === 'forward' ? 'bottom-8' : 'top-8'}`}>
          <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-full
            bg-primary/10 backdrop-blur-sm border border-primary/20 animate-fade-in">
            {scrollDirection === 'forward' ? (
              <>
                <ChevronDown className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-primary">Next</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-primary">Previous</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Generando contenuto...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainListeningScreen;
