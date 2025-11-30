export class MIDIHandler {
    constructor(uiHandler) {
        this.midi = null;
        this.inputs = [];
        this.outputs = [];
        this.ui = uiHandler;
        this.init();
    }

    async init() {
        if (!navigator.requestMIDIAccess) {
            this.ui.log('WebMIDI API not supported in this browser.');
            return;
        }

        try {
            this.midi = await navigator.requestMIDIAccess();
            this.updateDevices();
            this.midi.addEventListener('statechange', (e) => this.handleStateChange(e));
            this.ui.log('MIDI Access Granted');
        } catch (err) {
            this.ui.log('MIDI Access Failed: ' + err);
        }
    }

    handleStateChange(e) {
        this.ui.log(`Device ${e.port.name} ${e.port.state}`);
        this.updateDevices();
    }

    updateDevices() {
        this.inputs = Array.from(this.midi.inputs.values());
        this.outputs = Array.from(this.midi.outputs.values());

        // Re-attach listeners to new inputs
        // Note: onmidimessage is null by default, so we can just overwrite it.
        // If we wanted to support multiple listeners we'd use addEventListener, 
        // but we need to be careful not to add duplicates on re-render.
        // Assigning to onmidimessage is safer for this simple app.
        this.inputs.forEach(input => {
            input.onmidimessage = (msg) => this.handleMessage(msg, input);
        });

        this.ui.renderDevices(this.inputs, this.outputs);
    }

    handleMessage(msg, sourceInput) {
        // Check if input device is enabled
        if (!this.ui.isDeviceEnabled(sourceInput.id)) {
            return;
        }

        // Filter 0xF8 (Timing Clock) if enabled
        if (this.ui.filterClockRoute && msg.data[0] === 0xF8) {
            return;
        }

        // Route to all outputs except the one corresponding to the source (if possible to determine)
        // We use name matching to avoid immediate feedback loops

        this.outputs.forEach(output => {
            // Check if output device is enabled
            if (!this.ui.isDeviceEnabled(output.id)) {
                return;
            }

            if (output.name !== sourceInput.name) {
                try {
                    output.send(msg.data);
                } catch (e) {
                    console.error(`Failed to send to ${output.name}:`, e);
                }
            }
        });

        this.ui.logMessage(msg, sourceInput);
    }
}
