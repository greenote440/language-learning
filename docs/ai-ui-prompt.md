# AI UI Generation Prompt for Adaptive Italian Audio App

## Master Prompt for AI Frontend Generation Tools (v0, Lovable.ai, etc.)

---

### PROJECT CONTEXT & TECH STACK

**Project:** Adaptive Italian Audio for Accelerated Acquisition - A lean-back audio application that delivers personalized Italian content through an engaging listening experience. The app functions as a language-driven media system where users consume compelling Italian stories, dialogues, and narratives.

**Tech Stack:**
- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS (utility-first, responsive design)
- **State Management:** React Context API
- **Audio:** HTML5 Audio API with custom controls
- **PWA:** Service Workers for offline capabilities
- **Architecture:** Mobile-first responsive design

**Design Philosophy:**
- **Lean-back experience:** Audio-first, minimal interface that "disappears" as a tool
- **Media consumption feel:** Premium podcast/audiobook aesthetic, not educational tool
- **Single-screen design:** No traditional navigation, content discovery through scrolling
- **Mobile-first:** Optimized for one-handed mobile use during commutes/exercise

---

### HIGH-LEVEL GOAL

Create the main listening screen component for an adaptive Italian audio application. This is a single-screen, audio-first interface with a continuous scrolling feed, elegant audio player controls, and minimal UI that supports 30+ minute listening sessions. The interface should feel like a premium Italian media platform, not a language learning app.

---

### DETAILED STEP-BY-STEP INSTRUCTIONS

**1. Create Main Listening Screen Component**
   - Create a new React component file: `MainListeningScreen.tsx`
   - Use TypeScript for type safety
   - Component should be a functional component using React hooks

**2. Implement Layout Structure (Mobile-First)**
   - Create a full-viewport container with centered content
   - Use Tailwind CSS flexbox utilities for vertical centering
   - Ensure content is centered both horizontally and vertically on mobile
   - Add responsive padding: `p-4` on mobile, `p-6` on tablet, `p-8` on desktop
   - Background should be subtle (light neutral color, consider gradient later)

**3. Build Audio Player Component**
   - Create a large, prominent audio player in the center of the screen
   - **Play/Pause Button:**
     - Large circular button (minimum 60px, preferably 80px on mobile)
     - Centered, prominent placement
     - Use play/pause icons (consider Heroicons or Feather Icons)
     - Smooth transition on state change (200ms)
     - Touch-friendly: minimum 44x44px tap target
   - **Skip Controls:**
     - Skip backward 15 seconds button (left of play/pause)
     - Skip forward 15 seconds button (right of play/pause)
     - Smaller than play/pause but still accessible (minimum 44px)
     - Use appropriate icons (rewind/forward)
   - **Progress Bar:**
     - Thin, elegant progress bar below controls
     - Shows current time and total duration
     - Interactive: user can scrub to seek
     - Minimal styling, doesn't dominate interface
   - **Audio State Management:**
     - Use HTML5 Audio API
     - Track playing/paused state with React useState
     - Track current time and duration
     - Handle audio loading and error states gracefully

**4. Add Episode Title Display**
   - Large, elegant typography for episode title (24-32px on mobile)
   - Position above audio player
   - Italian text should be prominent and readable
   - Support for long titles with graceful truncation (ellipsis)
   - Optional: Subtle format indicator badge (Narrative, Podcast, Educational)
   - Use appropriate font weight (medium to semibold for titles)

**5. Implement Like Button**
   - Instagram-style heart icon
   - Position unobtrusively near audio player (consider top-right area)
   - Unfilled state (outline) when not liked
   - Filled state with color when liked
   - Smooth animation on state change (250ms scale or fill animation)
   - Minimum 44x44px touch target
   - Use React state to track liked/unliked state

**6. Add Comprehension Percentage Button**
   - Button positioned near like button (consider grouping feedback buttons)
   - Default state: Shows icon or "Understand?" label
   - When clicked, opens percentage selector interface
   - **Percentage Selector Options:**
     - Quick buttons: 0%, 25%, 50%, 75%, 100% (fast selection)
     - OR slider: Continuous 0-100% (more precise)
     - Selection saves automatically
     - Button shows selected percentage after selection (e.g., "75%")
   - Use React state to track current percentage
   - Reset percentage when new audio clip starts

**7. Implement Settings Menu Access**
   - Hidden menu icon (hamburger or gear) in top corner
   - Unobtrusive, doesn't compete with audio controls
   - On click, opens settings overlay (implement overlay component separately)
   - For now, just add the icon/button - overlay implementation can be separate

**8. Add Continuous Scrolling Feed Support**
   - Implement scroll detection (use React useEffect with scroll event listener)
   - Track scroll direction (forward = down, backward = up)
   - On scroll forward: Trigger new content generation (placeholder function for now)
   - On scroll backward: Access session history (placeholder function for now)
   - Smooth scroll behavior
   - Visual indicator (optional, minimal) showing scroll capability

**9. Implement Loading States**
   - Skeleton screen or minimal spinner during content generation
   - Show loading state for audio buffering
   - Smooth transition from loading to content (300ms fade)
   - Keep loading states minimal and elegant—don't create anxiety

**10. Add Responsive Breakpoints**
    - **Mobile (320px-767px):** Full-width layout, large touch targets, generous spacing
    - **Tablet (768px-1023px):** Slightly wider layout, more horizontal space, side-by-side elements where appropriate
    - **Desktop (1024px+):** Centered content with max-width constraint, optimized spacing
    - Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`

**11. Implement Auto-Play on Load**
    - Component should attempt to auto-play audio when mounted
    - Handle browser auto-play policies gracefully
    - If auto-play blocked, show clear play button to start manually
    - Audio should start within 2 seconds of component mount

**12. Add Error Handling**
    - Graceful handling of audio loading failures
    - Show friendly error message with retry option
    - Handle network errors during content generation
    - Don't break the interface on errors—maintain user experience

---

### CODE EXAMPLES, DATA STRUCTURES & CONSTRAINTS

**Component Structure:**
```typescript
interface AudioClip {
  id: string;
  title: string;
  format: 'narrative' | 'podcast' | 'educational';
  audioUrl: string;
  duration: number; // in seconds
}

interface MainListeningScreenProps {
  initialClip?: AudioClip;
  onContentChange?: (direction: 'forward' | 'backward') => void;
  onLike?: (clipId: string) => void;
  onComprehensionReport?: (clipId: string, percentage: number) => void;
}
```

**State Management:**
- Use React useState for local component state (playing, currentTime, liked, comprehensionPercentage)
- Use React useEffect for audio element lifecycle and scroll detection
- Use React useRef for audio element reference

**Styling Constraints:**
- **DO:** Use Tailwind CSS utility classes exclusively
- **DO:** Follow mobile-first responsive design (base styles for mobile, then `sm:`, `md:`, `lg:` prefixes)
- **DO:** Use Tailwind spacing scale (4px base: `p-4`, `p-6`, `p-8`, etc.)
- **DO:** Ensure all interactive elements have minimum 44x44px touch targets
- **DON'T:** Use inline styles or CSS modules
- **DON'T:** Create custom CSS files unless absolutely necessary
- **DON'T:** Use complex animations that might impact performance

**Color Palette (Placeholder - use neutral colors for now):**
- Background: `bg-neutral-50` or `bg-white` (light mode)
- Text: `text-neutral-900` (primary), `text-neutral-600` (secondary)
- Buttons: Use `bg-primary-500` (placeholder - will be defined later)
- Borders: `border-neutral-200`

**Typography:**
- Episode Title: `text-2xl md:text-3xl lg:text-4xl font-semibold`
- Body text: `text-base md:text-lg`
- Small text: `text-sm text-neutral-600`

**Icons:**
- Use Heroicons (recommended) or Feather Icons
- Import icons as React components
- Example: `import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'`

**Audio API Usage:**
```typescript
const audioRef = useRef<HTMLAudioElement>(null);

// Play audio
audioRef.current?.play();

// Pause audio
audioRef.current?.pause();

// Seek to time
audioRef.current.currentTime = 30; // seconds

// Listen to time updates
audioRef.current.addEventListener('timeupdate', () => {
  setCurrentTime(audioRef.current?.currentTime || 0);
});
```

**DO NOT:**
- Don't create navigation menus or tabs (single-screen design)
- Don't add progress bars, levels, or gamification elements
- Don't add grammar explanations or educational UI elements
- Don't create complex forms or multi-step processes
- Don't add unnecessary animations or visual effects
- Don't break the "lean-back" aesthetic with busy interfaces

---

### STRICT SCOPE DEFINITION

**Files to Create:**
1. `components/MainListeningScreen.tsx` - Main listening screen component
2. `components/AudioPlayer.tsx` - Audio player component (can be separate or integrated)
3. `components/LikeButton.tsx` - Like button component (optional, can be inline)
4. `components/ComprehensionButton.tsx` - Comprehension percentage button component (optional, can be inline)

**Files You MAY Modify:**
- `App.tsx` or main entry point to integrate the MainListeningScreen component
- `tailwind.config.js` if custom colors or spacing are needed

**Files You MUST NOT Modify:**
- Any existing routing configuration (if present)
- Any existing API service files
- Any existing state management setup (beyond adding local component state)
- Any existing build configuration
- Any other page or component files

**Component Boundaries:**
- MainListeningScreen should be self-contained with minimal external dependencies
- Use placeholder functions for API calls (content generation, like submission, comprehension reporting)
- Don't create full backend integration—focus on UI/UX implementation
- Audio URL can be a placeholder or prop for now

---

### VISUAL STYLE GUIDELINES

**Overall Aesthetic:**
- **Feel:** Premium Italian media platform (like Spotify, Audible, or premium podcast app)
- **Avoid:** Educational tool aesthetics, gamification, language learning app stereotypes
- **Tone:** Warm, inviting, sophisticated, elegant without being clichéd

**Layout:**
- Center-aligned content
- Generous whitespace
- Content should "breathe" - avoid cramped layouts
- Mobile: Single column, full-width elements
- Desktop: Centered with max-width constraint

**Colors (Temporary - use neutral palette):**
- Primary background: Light neutral (`bg-neutral-50` or `bg-white`)
- Text: Dark neutral (`text-neutral-900`)
- Accents: Will be defined later (use `bg-blue-500` as placeholder for interactive elements)
- Ensure sufficient contrast (WCAG AA minimum)

**Spacing:**
- Generous padding around audio controls (minimum 24px on mobile)
- Comfortable margins between elements (16px-24px)
- Use Tailwind spacing scale consistently

**Typography:**
- Italian text should be prominent and elegant
- Support Italian characters and diacritics properly
- Line height should support comfortable reading (1.5-1.6 for body text)
- Font weights: Use medium (500) to semibold (600) for titles

---

### ADDITIONAL REQUIREMENTS

**Performance:**
- Component should load and render quickly
- Audio controls must respond within 100ms
- Use CSS transforms for animations (GPU-accelerated)
- Avoid layout shifts during loading

**Accessibility:**
- All interactive elements must be keyboard accessible
- Use semantic HTML (button elements, not divs with onClick)
- Add ARIA labels where appropriate
- Ensure sufficient color contrast
- Support screen reader navigation

**Mobile Optimization:**
- All touch targets minimum 44x44px
- Support one-handed use (controls within thumb reach)
- Test on actual mobile devices if possible
- Support screen-off audio playback (audio continues when screen locks)

**Browser Compatibility:**
- Support latest 2 versions of Chrome, Firefox, Safari, Edge
- Graceful degradation for older browsers
- Handle browser auto-play policies

---

### EXPECTED OUTPUT

The generated code should produce:
1. A fully functional main listening screen component
2. Working audio player with play/pause and skip controls
3. Episode title display with proper typography
4. Like button with state management
5. Comprehension percentage button with selection interface
6. Settings menu access button
7. Scroll detection infrastructure (can trigger placeholder functions)
8. Loading states for content generation
9. Responsive design that works on mobile, tablet, and desktop
10. Clean, maintainable TypeScript/React code following best practices

---

### ITERATION NOTES

**This is a starting point.** The generated code will likely need:
- Refinement based on actual design mockups (when available)
- Integration with real API endpoints
- Testing and bug fixes
- Performance optimization
- Accessibility audit and improvements
- User testing and iteration

**Next Steps After Generation:**
1. Review generated code for correctness and completeness
2. Test on actual devices (especially mobile)
3. Integrate with real audio content API
4. Add proper error handling and edge cases
5. Conduct accessibility audit
6. Performance testing and optimization
7. User testing with target personas
8. Iterate based on feedback

---

## IMPORTANT REMINDER

**All AI-generated code requires careful human review, testing, and refinement to be considered production-ready.** This prompt provides a comprehensive starting point, but the generated code should be:
- Reviewed by experienced developers
- Tested thoroughly on multiple devices and browsers
- Validated against accessibility standards
- Performance profiled and optimized
- User tested with real users
- Refined based on feedback and iteration

Use this prompt as a foundation, but expect to iterate and improve the generated code through the normal software development process.
