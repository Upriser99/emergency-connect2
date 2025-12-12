// Distance calculation using Haversine formula
const DistanceCalculator = {
    // Calculate distance between two coordinates in kilometers
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers

        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 100) / 100; // Round to 2 decimal places
    },

    // Convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    // Format distance for display
    formatDistance(km) {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toFixed(1)} km`;
    },

    // Get distance category for color coding
    getDistanceCategory(km) {
        if (km < 2) return 'near';
        if (km < 5) return 'medium';
        return 'far';
    },

    // Sort services by distance from user location
    sortByDistance(services, userLocation) {
        return services.map(service => {
            const distance = this.calculateDistance(
                userLocation.lat,
                userLocation.lng,
                service.lat,
                service.lng
            );
            return { ...service, distance };
        }).sort((a, b) => a.distance - b.distance);
    }
};
