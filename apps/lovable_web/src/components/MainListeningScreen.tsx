import { useState, useEffect, useCallback, useRef } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import LikeButton from "./LikeButton";
import ComprehensionButton from "./ComprehensionButton";

interface AudioClip {
  id: string;
  title: string;
  subtitle?: string;
  format: 'narrative' | 'podcast' | 'educational';
  audioUrl?: string;
  duration?: number;
}

interface MainListeningScreenProps {
  initialClip?: AudioClip;
  onContentChange?: (direction: 'forward' | 'backward') => void;
  onLike?: (clipId: string, liked: boolean) => void;
  onComprehensionReport?: (clipId: string, percentage: number) => void;
}

const formatBadge: Record<AudioClip['format'], string> = {
  narrative: 'Racconto',
  podcast: 'Podcast',
  educational: 'Lezione',
};

// Scroll threshold to trigger content change (pixels)
const SCROLL_THRESHOLD = 50;
// Debounce time for scroll actions (ms)
const SCROLL_DEBOUNCE = 300;

const MainListeningScreen = ({
  initialClip,
  onContentChange,
  onLike,
  onComprehensionReport,
}: MainListeningScreenProps) => {
  const [currentClip, setCurrentClip] = useState<AudioClip>(
    initialClip || {
      id: '1',
      title: 'Una Passeggiata per Roma',
      subtitle: 'Discovering the Eternal City through sound',
      format: 'narrative',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward' | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Refs for scroll tracking
  const scrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle wheel events (desktop)
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isLoading) return;
    
    const direction = e.deltaY > 0 ? 'forward' : 'backward';
    const now = Date.now();
    
    // Debounce scroll actions
    if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE) {
      return;
    }
    
    lastScrollTimeRef.current = now;
    setShowScrollHint(false);
    setScrollDirection(direction);
    
    // Reset direction indicator after animation
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollDirection(null);
    }, 500);
    
    // Trigger content change
    console.log('Scroll direction:', direction, 'Position:', scrollYRef.current);
    onContentChange?.(direction);
  }, [isLoading, onContentChange]);

  // Handle touch events (mobile)
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isLoading) return;
    touchStartYRef.current = e.touches[0].clientY;
  }, [isLoading]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isLoading) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartYRef.current - touchY;
    
    // Only trigger if scroll threshold is met
    if (Math.abs(deltaY) < SCROLL_THRESHOLD) {
      return;
    }
    
    const direction = deltaY > 0 ? 'forward' : 'backward';
    const now = Date.now();
    
    // Debounce scroll actions
    if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE) {
      return;
    }
    
    lastScrollTimeRef.current = now;
    setShowScrollHint(false);
    setScrollDirection(direction);
    
    // Reset direction indicator after animation
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollDirection(null);
    }, 500);
    
    // Update scroll position tracking
    scrollYRef.current += deltaY;
    setScrollPosition(scrollYRef.current);
    
    // Trigger content change
    console.log('Touch scroll direction:', direction, 'Position:', scrollYRef.current);
    onContentChange?.(direction);
    
    // Reset touch start for next gesture
    touchStartYRef.current = touchY;
  }, [isLoading, onContentChange]);

  // Track scroll position (for visual feedback)
  const handleScrollPosition = useCallback(() => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    scrollYRef.current = currentScrollY;
    setScrollPosition(currentScrollY);
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Desktop wheel events
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    // Mobile touch events
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Scroll position tracking
    window.addEventListener('scroll', handleScrollPosition, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScrollPosition);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleScrollPosition]);

  // Hide scroll hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (liked: boolean) => {
    onLike?.(currentClip.id, liked);
  };

  const handleComprehension = (percentage: number) => {
    onComprehensionReport?.(currentClip.id, percentage);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
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
            {formatBadge[currentClip.format]}
          </span>

          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-3">
            {currentClip.title}
          </h2>

          {/* Subtitle */}
          {currentClip.subtitle && (
            <p className="text-muted-foreground text-base md:text-lg">
              {currentClip.subtitle}
            </p>
          )}
        </div>

        {/* Audio Player */}
        <div className="w-full max-w-md mb-10 md:mb-14">
          <AudioPlayer audioUrl={currentClip.audioUrl} />
        </div>

        {/* Feedback Controls */}
        <div className="flex items-center gap-4">
          <LikeButton onLike={handleLike} />
          <ComprehensionButton onSelect={handleComprehension} />
        </div>
      </main>

      {/* Scroll Hint */}
      {showScrollHint && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fade-in">
          <span className="text-xs text-muted-foreground mb-2">Scroll for more</span>
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </div>
      )}

      {/* Scroll Direction Indicator */}
      {scrollDirection && (
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          pointer-events-none z-50 transition-opacity duration-300
          ${scrollDirection === 'forward' ? 'opacity-100' : 'opacity-100'}`}>
          <div className={`flex flex-col items-center gap-2 px-4 py-3 rounded-full
            bg-primary/10 backdrop-blur-sm border border-primary/20
            ${scrollDirection === 'forward' ? 'animate-fade-in' : 'animate-fade-in'}`}>
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

      {/* Scroll Position Indicator (subtle, for debugging/feedback) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/50 font-mono">
          Scroll: {Math.round(scrollPosition)}px
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Preparando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainListeningScreen;
