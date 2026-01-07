# Browser Testing Guide - How to Test

This guide provides step-by-step instructions for testing the application across different browsers and devices.

## Prerequisites

1. **Start the Development Server**
   ```bash
   cd apps/lovable_web
   pnpm dev
   ```
   The app will be available at `http://localhost:8080` (or the port shown in terminal)

2. **Build for Production Testing** (optional, for more accurate performance testing)
   ```bash
   cd apps/lovable_web
   pnpm build
   pnpm preview
   ```

## Desktop Browser Testing

### Chrome Desktop
1. Open Chrome browser
2. Navigate to `http://localhost:8080`
3. **Test Responsive Design:**
   - Press `F12` to open DevTools
   - Click the device toolbar icon (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
   - Test different viewport sizes:
     - Mobile (375px, 414px)
     - Tablet (768px, 1024px)
     - Desktop (1280px, 1920px)
   - Verify layout adapts correctly at each breakpoint

4. **Test Scrolling:**
   - Use mouse wheel to scroll up/down
   - Verify scroll direction indicators appear
   - Check console for scroll direction logs

5. **Test Performance (3G Throttling):**
   - Open DevTools (`F12`)
   - Go to **Network** tab
   - Click throttling dropdown (usually says "No throttling")
   - Select **"Slow 3G"** or **"Fast 3G"**
   - Refresh page (`Ctrl+R` / `Cmd+R`)
   - Check **Network** tab for load time
   - Verify initial render completes in under 2 seconds

6. **Test Audio Player:**
   - Click play button
   - Test skip forward/backward buttons
   - Verify progress bar updates

### Firefox Desktop
1. Open Firefox browser
2. Navigate to `http://localhost:8080`
3. **Open DevTools:**
   - Press `F12` or `Ctrl+Shift+I` / `Cmd+Option+I`
   - Use responsive design mode (same as Chrome)
4. Follow same testing steps as Chrome

### Safari Desktop (macOS only)
1. Open Safari browser
2. Enable Developer menu:
   - Safari → Settings → Advanced → Check "Show features for web developers"
3. Navigate to `http://localhost:8080`
4. **Open Responsive Design Mode:**
   - Develop → Enter Responsive Design Mode (or `Cmd+Ctrl+R`)
5. Test same features as Chrome

### Edge Desktop
1. Open Microsoft Edge browser
2. Navigate to `http://localhost:8080`
3. Edge uses Chromium engine, so testing is similar to Chrome
4. Use `F12` for DevTools and follow Chrome testing steps

## Mobile Device Testing

### Testing on Real Devices (Recommended)

#### iOS Safari (iPhone/iPad)
1. **Connect iPhone/iPad to same Wi-Fi network as your computer**
2. **Find your computer's IP address:**
   - Windows: Open Command Prompt, type `ipconfig`, look for "IPv4 Address"
   - Mac/Linux: Open Terminal, type `ifconfig` or `ip addr`, look for inet address
   - Example: `192.168.1.100`

3. **On your iPhone/iPad:**
   - Open Safari
   - Navigate to `http://YOUR_IP_ADDRESS:8080`
   - Example: `http://192.168.1.100:8080`

4. **Test Features:**
   - Touch scrolling (swipe up/down)
   - Verify scroll direction indicators
   - Test audio player with touch
   - Test "Add to Home Screen":
     - Tap Share button (square with arrow)
     - Scroll down, tap "Add to Home Screen"
     - Verify app icon appears
     - Open from home screen, verify standalone mode

5. **Test Safe Area Insets:**
   - Check that content doesn't overlap with notch/home indicator
   - Verify bottom padding on devices with home indicator

#### Android Chrome
1. **Connect Android device to same Wi-Fi network**
2. **On your Android device:**
   - Open Chrome
   - Navigate to `http://YOUR_IP_ADDRESS:8080`

3. **Test Features:**
   - Touch scrolling
   - Audio player controls
   - PWA installation:
     - Chrome should show "Add to Home Screen" banner
     - Or use menu (three dots) → "Add to Home Screen"
     - Verify app installs and opens in standalone mode

### Testing on Emulators/Simulators

#### Chrome DevTools Mobile Emulation
1. Open Chrome DevTools (`F12`)
2. Click device toolbar icon (`Ctrl+Shift+M`)
3. Select device presets:
   - iPhone 12/13/14 Pro
   - Samsung Galaxy S20/S21
   - iPad
4. Test touch interactions using mouse (simulated touch)

#### iOS Simulator (macOS only)
1. Open Xcode
2. Xcode → Open Developer Tool → Simulator
3. Select device (iPhone 14, iPad, etc.)
4. Open Safari in simulator
5. Navigate to `http://localhost:8080`

#### Android Emulator
1. Install Android Studio
2. Create/start an Android Virtual Device (AVD)
3. Open Chrome in emulator
4. Navigate to `http://10.0.2.2:8080` (special IP for Android emulator)

## Testing Checklist

### Responsive Design
- [ ] Mobile (320px - 768px): Layout stacks vertically, text readable
- [ ] Tablet (768px - 1024px): Layout adapts, spacing appropriate
- [ ] Desktop (1024px+): Full layout, optimal spacing
- [ ] Landscape orientation on mobile: Layout adapts
- [ ] Portrait orientation: Layout works correctly

### Scrolling Functionality
- [ ] Desktop: Mouse wheel triggers scroll direction indicators
- [ ] Mobile: Touch swipe triggers scroll direction indicators
- [ ] Scroll direction shows "Next" when scrolling down
- [ ] Scroll direction shows "Previous" when scrolling up
- [ ] Indicators fade out after scroll action
- [ ] Console logs show scroll events (check browser console)

### Performance
- [ ] Initial load < 2 seconds on throttled 3G (Chrome DevTools Network tab)
- [ ] No layout shifts during load
- [ ] Fonts load without flash of invisible text (FOIT)
- [ ] Images/assets load progressively

### PWA Features
- [ ] Manifest.json loads (check Network tab, should see manifest.json request)
- [ ] "Add to Home Screen" prompt appears (mobile Chrome)
- [ ] App installs successfully
- [ ] App opens in standalone mode (no browser UI)
- [ ] Theme color matches (#a84c2a) in browser UI
- [ ] App icon appears on home screen (once icons are added)

### Audio Player
- [ ] Play/pause button works
- [ ] Skip forward/backward buttons work
- [ ] Progress bar updates during playback
- [ ] Time display updates correctly
- [ ] Touch controls work on mobile

## Troubleshooting

### Can't Access from Mobile Device
- **Check firewall:** Windows Firewall may block port 8080
  - Solution: Allow port 8080 in Windows Firewall settings
- **Check network:** Ensure device is on same Wi-Fi network
- **Try different port:** Modify `vite.config.ts` server port if needed

### PWA Not Installing
- **Check manifest:** Verify `manifest.json` is accessible at `/manifest.json`
- **Check icons:** Icons must exist at paths specified in manifest
- **HTTPS required:** Some PWA features require HTTPS (localhost is OK, but production needs HTTPS)

### Performance Issues
- **Clear cache:** Hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`)
- **Check bundle size:** Use Chrome DevTools → Network tab to see file sizes
- **Disable extensions:** Browser extensions can slow down testing

## Quick Test Commands

```bash
# Start dev server
cd apps/lovable_web
pnpm dev

# Build for production testing
pnpm build
pnpm preview

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Next Steps

After completing browser testing:
1. Document any issues found in `BROWSER_TESTING.md`
2. Note any browser-specific workarounds needed
3. Update story file with testing results
4. Create PWA icons if testing reveals issues with icon paths
