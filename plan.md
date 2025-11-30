# Web MIDI Router Implementation Plan

## Goal
Build a simple, offline-capable web application to route MIDI messages between connected devices using the WebMIDI API. The app will use vanilla JS/HTML/CSS with no build step and be deployable to GitHub Pages.

## User Review Required
> [!IMPORTANT]
> The application requires a browser that supports the WebMIDI API (e.g., Chrome, Edge, Opera). Firefox and Safari have limited or no support without polyfills/flags.

## Proposed Changes

### Core Application
#### [NEW] [index.html](file:///home/maks/work/music/webmidirouter/index.html)
- Main entry point.
- Links to `style.css` and `app.js` (as module).
- Contains containers for Device List and Message Log.

#### [NEW] [style.css](file:///home/maks/work/music/webmidirouter/style.css)
- Minimalistic, mobile-first styles.
- Dark mode preference support.
- Touch-friendly sizing for elements.

#### [NEW] [app.js](file:///home/maks/work/music/webmidirouter/app.js)
- Main application logic.
- Initializes MIDI and UI modules.
- Registers Service Worker.

#### [NEW] [src/midi.js](file:///home/maks/work/music/webmidirouter/src/midi.js)
- Handles `navigator.requestMIDIAccess`.
- Manages inputs and outputs.
- Implements the routing logic (Input `midimessage` event -> send to other Outputs).
- Exposes events or callbacks for UI updates.

#### [NEW] [src/ui.js](file:///home/maks/work/music/webmidirouter/src/ui.js)
- Renders the list of connected devices.
- Renders the log of MIDI messages.
- Handles UI updates based on MIDI events.

### Offline Support (PWA)
#### [NEW] [manifest.json](file:///home/maks/work/music/webmidirouter/manifest.json)
- Web App Manifest for installability.

#### [NEW] [sw.js](file:///home/maks/work/music/webmidirouter/sw.js)
- Service Worker for offline caching of static assets.

### Deployment
#### [NEW] [.github/workflows/deploy.yml](file:///home/maks/work/music/webmidirouter/.github/workflows/deploy.yml)
- GitHub Action to deploy to GitHub Pages on push to main.

## Verification Plan

### Automated Tests
- Since there is no build step or test framework, we will rely on manual verification.
- We can add a simple lint check if requested, but currently not in scope.

### Manual Verification
1. **Browser Compatibility**: Open in Chrome/Edge.
2. **MIDI Access**: Verify browser asks for MIDI permission.
3. **Device Detection**: Connect a MIDI device (or virtual MIDI port) and verify it appears in the list.
4. **Routing**:
    - Connect two MIDI devices.
    - Send note on Device A.
    - Verify Device B receives the note.
    - Verify UI logs the message.
5. **Offline**:
    - Load the page.
    - Go offline (Network tab -> Offline).
    - Reload page. Verify it loads.
6. **Mobile**: Use Chrome DevTools Device Toolbar to simulate a phone. Verify layout.
