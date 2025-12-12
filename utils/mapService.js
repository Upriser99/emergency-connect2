// Map Service for Emergency Connect
const MapService = {
    map: null,
    markers: [],
    userMarker: null,
    currentCategory: null,

    // Custom marker icons for different categories (using simple colored markers)
    icons: {
        police: {
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        },
        hospital: {
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        },
        fire: {
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        },
        petrol: {
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        },
        user: {
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }
    },

    // Initialize map
    initMap(containerId, center, zoom = 13) {
        console.log('MapService.initMap called');

        if (this.map) {
            this.map.remove();
        }

        this.map = L.map(containerId).setView([center.lat, center.lng], zoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        console.log('Map initialized successfully');
        return this.map;
    },

    // Add user location marker
    addUserMarker(location) {
        if (this.userMarker) {
            this.userMarker.remove();
        }

        const icon = L.icon(this.icons.user);
        this.userMarker = L.marker([location.lat, location.lng], { icon })
            .addTo(this.map)
            .bindPopup('<div class="map-popup"><strong>Your Location</strong></div>');
    },

    // Clear all service markers
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    },

    // Add service markers to map
    addServiceMarkers(services, category, userLocation) {
        this.clearMarkers();
        this.currentCategory = category;

        const icon = L.icon(this.icons[category]);

        services.forEach(service => {
            const marker = L.marker([service.lat, service.lng], { icon })
                .addTo(this.map);

            // Create popup content
            const popupContent = this.createPopupContent(service, userLocation);
            marker.bindPopup(popupContent);

            this.markers.push(marker);
        });

        // Fit map to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup([...this.markers, this.userMarker]);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    },

    // Create popup content for marker
    createPopupContent(service, userLocation) {
        const distance = DistanceCalculator.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            service.lat,
            service.lng
        );
        const distanceText = DistanceCalculator.formatDistance(distance);
        const verifiedBadge = service.verified ? '<span class="verified-badge">✓ Verified</span>' : '';

        return `
            <div class="map-popup">
                <div class="map-popup-name">${service.name} ${verifiedBadge}</div>
                <div class="map-popup-address">${service.address}</div>
                ${service.phone !== 'N/A' ? `<div class="map-popup-phone">📞 ${service.phone}</div>` : ''}
                <div class="map-popup-distance">${distanceText}</div>
                <div class="map-popup-actions">
                    <a href="tel:${service.phone}" class="map-popup-btn map-popup-call">📞 Call</a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}" 
                       target="_blank" class="map-popup-btn map-popup-directions">🗺️ Go</a>
                </div>
            </div>
        `;
    },

    // Resize map (call after showing/hiding)
    resize() {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
    }
};

console.log('MapService loaded successfully');
