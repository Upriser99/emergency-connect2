// Geolocation Service
const GeolocationService = {
    currentLocation: null,

    // Get user's current location
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported, using fallback');
                resolve(this.getFallbackLocation());
                return;
            }

            console.log('Requesting geolocation permission...');

            // Try to get current position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Location detected:', position.coords);
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now()
                    };

                    this.currentLocation = location;
                    this.saveLocation(location);
                    resolve(location);
                },
                (error) => {
                    console.error('❌ Geolocation error:', error);
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);

                    // Provide specific error feedback
                    let errorMsg = 'Location unavailable';
                    switch (error.code) {
                        case 1: // PERMISSION_DENIED
                            errorMsg = 'Location permission denied';
                            console.warn('💡 Please allow location access in browser settings');
                            break;
                        case 2: // POSITION_UNAVAILABLE
                            errorMsg = 'Location unavailable';
                            break;
                        case 3: // TIMEOUT
                            errorMsg = 'Location request timed out';
                            break;
                    }

                    resolve(this.getFallbackLocation());
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000, // Increased to 10 seconds
                    maximumAge: 30000 // Cache for 30 seconds (reduced for more accuracy)
                }
            );
        });
    },

    // Get fallback location (last known or city center)
    getFallbackLocation() {
        // Try to get last saved location
        const lastLocation = this.getLastLocation();
        if (lastLocation) {
            console.log('Using last known location');
            return lastLocation;
        }

        // Use city center as final fallback
        console.log('Using city center as fallback');
        return {
            lat: INDORE_CONFIG.cityCenter.lat,
            lng: INDORE_CONFIG.cityCenter.lng,
            fallback: true
        };
    },

    // Save location to localStorage
    saveLocation(location) {
        try {
            localStorage.setItem('lastLocation', JSON.stringify(location));
        } catch (e) {
            console.error('Failed to save location:', e);
        }
    },

    // Get last saved location
    getLastLocation() {
        try {
            const saved = localStorage.getItem('lastLocation');
            if (saved) {
                const location = JSON.parse(saved);
                // Check if location is not too old (24 hours)
                if (Date.now() - location.timestamp < 24 * 60 * 60 * 1000) {
                    return location;
                }
            }
        } catch (e) {
            console.error('Failed to get last location:', e);
        }
        return null;
    }
};
