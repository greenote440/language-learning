# Browser Compatibility Testing Checklist

This document outlines the browser compatibility testing requirements for Story 1.5.

## Required Browser Testing

### Mobile Devices
- [ ] **iOS Safari** (latest 2 versions)
  - Test responsive layout
  - Test touch scrolling interactions
  - Test PWA "Add to Home Screen" functionality
  - Verify safe area insets (notch, home indicator)
  - Test audio playback

- [ ] **Chrome Mobile** (latest 2 versions)
  - Test responsive layout
  - Test touch scrolling interactions
  - Test PWA installation prompt
  - Test audio playback

### Desktop Browsers
- [ ] **Chrome Desktop** (latest 2 versions)
  - Test responsive layout at different screen sizes
  - Test mouse wheel scrolling
  - Test audio playback
  - Verify performance (load time < 2s on 3G)

- [ ] **Firefox Desktop** (latest 2 versions)
  - Test responsive layout
  - Test mouse wheel scrolling
  - Test audio playback

- [ ] **Safari Desktop** (latest 2 versions)
  - Test responsive layout
  - Test mouse wheel scrolling
  - Test audio playback

- [ ] **Edge Desktop** (latest 2 versions)
  - Test responsive layout
  - Test mouse wheel scrolling
  - Test audio playback

## Testing Areas

### Responsive Design
- [ ] Mobile viewport (320px - 768px)
- [ ] Tablet viewport (768px - 1024px)
- [ ] Desktop viewport (1024px+)
- [ ] Landscape orientation on mobile
- [ ] Portrait orientation on mobile

### Scrolling Functionality
- [ ] Desktop: Mouse wheel scrolling triggers content change
- [ ] Mobile: Touch scrolling triggers content change
- [ ] Scroll direction indicators display correctly
- [ ] Bidirectional scrolling works (forward/backward)

### Performance
- [ ] Initial load < 2 seconds on throttled 3G connection
- [ ] Smooth scrolling performance
- [ ] No layout shifts during load
- [ ] Fonts load without FOIT (Flash of Invisible Text)

### PWA Features
- [ ] Manifest.json loads correctly
- [ ] "Add to Home Screen" prompt appears (mobile)
- [ ] App installs correctly
- [ ] App opens in standalone mode
- [ ] Theme color matches (#a84c2a)
- [ ] Splash screen displays correctly

## Known Considerations

- **Icons**: PWA icons (192x192, 512x512) need to be created and added to `/public/icons/`
- **Service Worker**: Will be implemented in Story 1.9 (offline functionality)
- **Performance Testing**: Use Chrome DevTools Network throttling (3G preset) for load time testing

## Notes

All automated tests will be added in future stories. This story focuses on manual browser compatibility verification.
