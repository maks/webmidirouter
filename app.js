import { MIDIHandler } from './src/midi.js';
import { UIHandler } from './src/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIHandler();
    const midi = new MIDIHandler(ui);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch((err) => console.log('Service Worker registration failed', err));
    }
});

