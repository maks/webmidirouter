# Web MIDI Router

A simple web application to route MIDI messages between connected devices using the WebMIDI API.

## Running Locally

Because this project uses ES Modules (`<script type="module">`), you cannot open `index.html` directly from the file system due to browser security restrictions (CORS). You must serve the files using a local HTTP server.

### Using Python (Recommended)
If you have Python installed, you can run:

```bash
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Using Node.js
If you have Node.js installed, you can use `npx`:

```bash
npx serve .
```

## Features
- Route MIDI messages from any input to all other outputs.
- View connected devices.
- See a log of MIDI activity.
- Works offline (PWA).
