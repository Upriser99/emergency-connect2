// Flashlight Tool for Emergency Connect
// Uses Camera API to control device flashlight

const FlashlightTool = {
    stream: null,
    track: null,
    isOn: false,
    strobeInterval: null,

    // Initialize flashlight
    async init() {
        try {
            // Request camera access for flashlight
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            this.track = this.stream.getVideoTracks()[0];

            // Check if torch is supported
            const capabilities = this.track.getCapabilities();
            if (!capabilities.torch) {
                console.warn('Flashlight not supported on this device');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Flashlight init error:', error);
            return false;
        }
    },

    // Toggle flashlight on/off
    async toggle() {
        if (!this.track) {
            const initialized = await this.init();
            if (!initialized) {
                // Fallback to white screen
                this.useScreenFlash();
                return;
            }
        }

        try {
            this.isOn = !this.isOn;
            await this.track.applyConstraints({
                advanced: [{ torch: this.isOn }]
            });

            this.updateUI();
        } catch (error) {
            console.error('Flashlight toggle error:', error);
            this.useScreenFlash();
        }
    },

    // Turn off flashlight
    async turnOff() {
        if (this.track && this.isOn) {
            try {
                await this.track.applyConstraints({
                    advanced: [{ torch: false }]
                });
                this.isOn = false;
                this.updateUI();
            } catch (error) {
                console.error('Flashlight off error:', error);
            }
        }

        // Stop strobe if running
        if (this.strobeInterval) {
            clearInterval(this.strobeInterval);
            this.strobeInterval = null;
        }

        // Remove screen flash
        const screenFlash = document.getElementById('screenFlash');
        if (screenFlash) {
            screenFlash.remove();
        }
    },

    // SOS strobe mode (· · · — — — · · ·)
    async startSOSStrobe() {
        if (!this.track) {
            const initialized = await this.init();
            if (!initialized) {
                alert('Flashlight not available on this device');
                return;
            }
        }

        // SOS pattern: 3 short, 3 long, 3 short
        const pattern = [
            200, 200, 200, 200, 200, 200,  // · · ·
            600, 200, 600, 200, 600, 200,  // — — —
            200, 200, 200, 200, 200, 1000  // · · ·
        ];

        let index = 0;

        this.strobeInterval = setInterval(async () => {
            const duration = pattern[index];
            const isFlash = index % 2 === 0;

            try {
                await this.track.applyConstraints({
                    advanced: [{ torch: isFlash }]
                });
            } catch (error) {
                console.error('Strobe error:', error);
            }

            index = (index + 1) % pattern.length;
        }, 200);

        this.updateUI('strobe');
    },

    // Fallback: Use screen as flashlight
    useScreenFlash() {
        let screenFlash = document.getElementById('screenFlash');

        if (!screenFlash) {
            screenFlash = document.createElement('div');
            screenFlash.id = 'screenFlash';
            screenFlash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 99999;
                display: none;
            `;
            document.body.appendChild(screenFlash);
        }

        if (screenFlash.style.display === 'none') {
            screenFlash.style.display = 'block';
            this.isOn = true;
        } else {
            screenFlash.style.display = 'none';
            this.isOn = false;
        }

        this.updateUI();
    },

    // Update UI button state
    updateUI(mode = 'normal') {
        const flashlightBtn = document.querySelector('[data-action="flashlight"]');
        if (!flashlightBtn) return;

        const label = flashlightBtn.querySelector('.action-label');
        const icon = flashlightBtn.querySelector('.action-icon');

        if (mode === 'strobe') {
            flashlightBtn.classList.add('active', 'pulsing');
            if (label) label.textContent = 'SOS Mode';
        } else if (this.isOn) {
            flashlightBtn.classList.add('active');
            flashlightBtn.classList.remove('pulsing');
            if (label) label.textContent = 'Turn Off';
        } else {
            flashlightBtn.classList.remove('active', 'pulsing');
            if (label) label.textContent = 'Flashlight';
        }
    },

    // Check battery level
    checkBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2 && this.isOn) {
                    alert('⚠️ Low battery! Flashlight may drain battery quickly.');
                }
            });
        }
    },

    // Cleanup
    cleanup() {
        this.turnOff();
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.track = null;
        }
    }
};

// Global functions for button clicks
function toggleFlashlight() {
    FlashlightTool.toggle();
    FlashlightTool.checkBattery();
}

function startSOSFlash() {
    if (confirm('Start SOS strobe mode?')) {
        FlashlightTool.startSOSStrobe();
    }
}

function stopFlashlight() {
    FlashlightTool.turnOff();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    FlashlightTool.cleanup();
});
