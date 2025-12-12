// Emergency Tools - Phase 4

// Siren Tool
const SirenTool = {
    audioContext: null,
    oscillator: null,
    gainNode: null,
    isPlaying: false,

    init() {
        // Audio context will be created on first play (user interaction required)
    },

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    },

    play() {
        try {
            // Create audio context on first play
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Create oscillator for siren sound
            this.oscillator = this.audioContext.createOscillator();
            this.gainNode = this.audioContext.createGain();

            // Connect nodes
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            // Set initial frequency and volume
            this.oscillator.frequency.value = 800;
            this.gainNode.gain.value = 0.3;

            // Create siren effect (alternating frequency)
            const now = this.audioContext.currentTime;
            for (let i = 0; i < 100; i++) {
                const time = now + (i * 0.5);
                const freq = (i % 2 === 0) ? 800 : 400;
                this.oscillator.frequency.setValueAtTime(freq, time);
            }

            // Start oscillator
            this.oscillator.start();
            this.isPlaying = true;

            // Update button UI
            const btn = document.getElementById('sirenBtn');
            if (btn) {
                btn.classList.add('playing');
                btn.querySelector('.action-label').textContent = 'Stop';
            }

        } catch (error) {
            console.error('Siren error:', error);
            alert('Siren not supported on this device');
        }
    },

    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }

        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }

        this.isPlaying = false;

        // Update button UI
        const btn = document.getElementById('sirenBtn');
        if (btn) {
            btn.classList.remove('playing');
            btn.querySelector('.action-label').textContent = t('siren') || 'Siren';
        }
    }
};

// Location Share Tool
const LocationShare = {
    async share() {
        const location = App.userLocation;

        if (!location) {
            alert(t('locationUnavailable') || 'Location not available. Please enable location services.');
            return;
        }

        const lat = location.lat.toFixed(6);
        const lng = location.lng.toFixed(6);
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        const message = `🆘 EMERGENCY! I need help at this location: ${mapsLink}`;

        // Try Web Share API first (works on mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Emergency Location',
                    text: message
                });
                return;
            } catch (err) {
                // User cancelled or error, show modal
                if (err.name !== 'AbortError') {
                    console.log('Share failed, showing modal');
                }
            }
        }

        // Fallback: Show share options modal
        this.showShareModal(message, mapsLink);
    },

    showShareModal(message, link) {
        const modal = document.getElementById('shareLocationModal');
        if (modal) {
            // Update link in modal
            const linkEl = document.getElementById('shareLocationLink');
            if (linkEl) {
                linkEl.textContent = link;
            }

            // Update WhatsApp link
            const whatsappBtn = document.getElementById('shareWhatsApp');
            if (whatsappBtn) {
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                whatsappBtn.href = whatsappUrl;
            }

            // Update SMS link
            const smsBtn = document.getElementById('shareSMS');
            if (smsBtn) {
                const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
                smsBtn.href = smsUrl;
            }

            modal.classList.add('active');
        }
    },

    copyLink() {
        const location = App.userLocation;
        if (!location) return;

        const lat = location.lat.toFixed(6);
        const lng = location.lng.toFixed(6);
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        navigator.clipboard.writeText(mapsLink).then(() => {
            alert(t('locationCopied') || 'Location link copied to clipboard!');
            this.closeModal();
        }).catch(err => {
            console.error('Copy failed:', err);
            // Fallback: select text
            const linkEl = document.getElementById('shareLocationLink');
            if (linkEl) {
                const range = document.createRange();
                range.selectNode(linkEl);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        });
    },

    closeModal() {
        const modal = document.getElementById('shareLocationModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
};

// Global functions
function toggleSiren() {
    SirenTool.toggle();
}

function shareLocation() {
    LocationShare.share();
}

function showEmergencyNumbers() {
    const modal = document.getElementById('emergencyNumbersModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeEmergencyNumbers() {
    const modal = document.getElementById('emergencyNumbersModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeShareLocation() {
    LocationShare.closeModal();
}

function copyLocationLink() {
    LocationShare.copyLink();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    SirenTool.init();
});
