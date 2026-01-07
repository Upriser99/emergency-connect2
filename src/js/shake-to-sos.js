// Shake to SOS - Detect device shake and trigger emergency call
// Uses DeviceMotion API

const ShakeToSOS = {
    enabled: false,
    sensitivity: 15, // Default sensitivity (Low: 20, Medium: 15, High: 10)
    shakeThreshold: 15,
    lastShake: 0,
    shakeTimeout: null,
    countdownInterval: null,
    countdownSeconds: 3,

    // Initialize shake detection
    init() {
        // Load settings from localStorage
        const settings = JSON.parse(localStorage.getItem('shakeToSOSSettings') || '{}');
        this.enabled = settings.enabled !== false; // Default enabled
        this.sensitivity = settings.sensitivity || 15;

        if (this.enabled) {
            this.start();
        }
    },

    // Start listening for shakes
    start() {
        if (typeof DeviceMotionEvent === 'undefined') {
            console.warn('DeviceMotion not supported');
            return;
        }

        // Request permission on iOS 13+
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.attachListener();
                    }
                })
                .catch(console.error);
        } else {
            this.attachListener();
        }

        this.enabled = true;
        this.saveSettings();
    },

    // Attach motion event listener
    attachListener() {
        window.addEventListener('devicemotion', this.handleMotion.bind(this));
    },

    // Handle device motion
    handleMotion(event) {
        if (!this.enabled) return;

        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        // Calculate total acceleration
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

        // Detect shake
        if (totalAcceleration > this.sensitivity) {
            const now = Date.now();

            // Prevent multiple triggers (debounce)
            if (now - this.lastShake > 1000) {
                this.lastShake = now;
                this.onShakeDetected();
            }
        }
    },

    // Shake detected - show countdown
    onShakeDetected() {
        // Vibrate if available
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }

        this.showCountdown();
    },

    // Show countdown modal
    showCountdown() {
        // Create modal if doesn't exist
        let modal = document.getElementById('shakeSOSModal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'shakeSOSModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="text-align: center;">
                    <h2 style="color: var(--color-fire); margin-bottom: 1rem;">
                        🚨 Shake Detected!
                    </h2>
                    <p style="font-size: 1.125rem; margin-bottom: 1.5rem;">
                        Calling emergency services in:
                    </p>
                    <div id="shakeCountdown" style="font-size: 4rem; font-weight: bold; color: var(--color-fire); margin: 1rem 0;">
                        3
                    </div>
                    <button class="btn-primary" onclick="cancelShakeSOS()" style="background: var(--color-fire); font-size: 1.125rem; padding: 1rem 2rem;">
                        ❌ CANCEL
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.classList.add('active');

        // Start countdown
        let seconds = this.countdownSeconds;
        const countdownEl = document.getElementById('shakeCountdown');
        countdownEl.textContent = seconds;

        this.countdownInterval = setInterval(() => {
            seconds--;
            countdownEl.textContent = seconds;

            // Vibrate each second
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            if (seconds <= 0) {
                clearInterval(this.countdownInterval);
                this.triggerSOS();
            }
        }, 1000);
    },

    // Cancel SOS
    cancelCountdown() {
        clearInterval(this.countdownInterval);
        const modal = document.getElementById('shakeSOSModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Trigger SOS call
    triggerSOS() {
        const modal = document.getElementById('shakeSOSModal');
        if (modal) {
            modal.classList.remove('active');
        }

        // Call 112
        window.location.href = 'tel:112';
    },

    // Toggle enable/disable
    toggle() {
        this.enabled = !this.enabled;

        if (this.enabled) {
            this.start();
            alert('✅ Shake to SOS enabled');
        } else {
            alert('❌ Shake to SOS disabled');
        }

        this.saveSettings();
    },

    // Set sensitivity
    setSensitivity(level) {
        // Low: 20, Medium: 15, High: 10
        const levels = {
            'low': 20,
            'medium': 15,
            'high': 10
        };

        this.sensitivity = levels[level] || 15;
        this.saveSettings();
    },

    // Save settings
    saveSettings() {
        localStorage.setItem('shakeToSOSSettings', JSON.stringify({
            enabled: this.enabled,
            sensitivity: this.sensitivity
        }));
    }
};

// Global functions
function cancelShakeSOS() {
    ShakeToSOS.cancelCountdown();
}

function toggleShakeToSOS() {
    ShakeToSOS.toggle();
}

function setShakeSensitivity(level) {
    ShakeToSOS.setSensitivity(level);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    ShakeToSOS.init();
});
