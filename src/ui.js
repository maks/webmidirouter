export class UIHandler {
    constructor() {
        this.deviceList = document.getElementById('device-list');
        this.messageLog = document.getElementById('message-log');
        this.filterClockRouteCheckbox = document.getElementById('filter-clock-route');
        this.filterClockLogCheckbox = document.getElementById('filter-clock-log');
    }

    get filterClockRoute() {
        return this.filterClockRouteCheckbox.checked;
    }

    get filterClockLog() {
        return this.filterClockLogCheckbox.checked;
    }

    log(text) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="timestamp">${time}</span> [System] ${text}`;
        this.messageLog.prepend(entry);
    }

    logMessage(msg, input) {
        // Filter 0xF8 (Timing Clock) if enabled
        if (this.filterClockLog && msg.data[0] === 0xF8) {
            return;
        }

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const data = Array.from(msg.data).map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
        const time = new Date().toLocaleTimeString();
        entry.innerHTML = `<span class="timestamp">${time}</span> [${input.name}] ${data}`;
        this.messageLog.prepend(entry);

        // Keep log size manageable
        if (this.messageLog.children.length > 50) {
            this.messageLog.lastElementChild.remove();
        }
    }

    renderDevices(inputs, outputs) {
        this.deviceList.innerHTML = '';

        const createList = (title, devices) => {
            const container = document.createElement('div');
            container.style.marginBottom = '1rem';
            const header = document.createElement('h3');
            header.textContent = title;
            header.style.fontSize = '1rem';
            header.style.color = '#888';
            header.style.marginBottom = '0.5rem';
            container.appendChild(header);

            if (devices.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'None';
                p.style.fontStyle = 'italic';
                p.style.color = '#666';
                container.appendChild(p);
            } else {
                devices.forEach(device => {
                    const div = document.createElement('div');
                    div.className = 'device-item';
                    const status = document.createElement('span');
                    status.className = `device-status ${device.state === 'connected' ? 'connected' : ''}`;
                    div.appendChild(status);
                    div.appendChild(document.createTextNode(device.name));
                    container.appendChild(div);
                });
            }
            return container;
        };

        this.deviceList.appendChild(createList('Inputs', inputs));
        this.deviceList.appendChild(createList('Outputs', outputs));
    }
}
