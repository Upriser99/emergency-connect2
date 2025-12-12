// OpenStreetMap Overpass API Service
const OSMService = {
    overpassUrl: 'https://overpass-api.de/api/interpreter',

    // Category mapping to OSM tags
    categoryMap: {
        police: 'amenity=police',
        hospital: 'amenity=hospital',
        fire: 'amenity=fire_station',
        petrol: 'amenity=fuel'
    },

    // Fetch nearby places from OSM
    async fetchNearbyPlaces(category, lat, lng, radiusMeters = 10000) {
        const osmTag = this.categoryMap[category];
        if (!osmTag) {
            console.error('Unknown category:', category);
            return [];
        }

        // Build Overpass query
        const query = `
            [out:json][timeout:10];
            (
                node[${osmTag}](around:${radiusMeters},${lat},${lng});
                way[${osmTag}](around:${radiusMeters},${lat},${lng});
            );
            out body;
            >;
            out skel qt;
        `;

        try {
            const response = await fetch(this.overpassUrl, {
                method: 'POST',
                body: query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) {
                throw new Error(`OSM API error: ${response.status}`);
            }

            const data = await response.json();
            return this.convertOSMData(data.elements);
        } catch (error) {
            console.error('Failed to fetch OSM data:', error);
            return [];
        }
    },

    // Convert OSM data to app format
    convertOSMData(elements) {
        return elements
            .filter(el => el.type === 'node' && el.tags && el.tags.name)
            .map(el => ({
                name: el.tags.name,
                address: this.buildAddress(el.tags),
                phone: el.tags.phone || el.tags['contact:phone'] || 'N/A',
                lat: el.lat,
                lng: el.lon,
                verified: false,
                source: 'osm'
            }));
    },

    // Build address from OSM tags
    buildAddress(tags) {
        const parts = [];
        if (tags['addr:street']) parts.push(tags['addr:street']);
        if (tags['addr:city']) parts.push(tags['addr:city']);
        if (tags['addr:postcode']) parts.push(tags['addr:postcode']);

        return parts.length > 0 ? parts.join(', ') : 'Address not available';
    },

    // Merge static and OSM data, prioritizing verified static data
    mergeResults(staticData, osmData) {
        const merged = [...staticData];
        const staticNames = new Set(staticData.map(s => s.name.toLowerCase()));

        // Add OSM data that doesn't duplicate static data
        osmData.forEach(osmItem => {
            if (!staticNames.has(osmItem.name.toLowerCase())) {
                merged.push(osmItem);
            }
        });

        return merged;
    },

    // Cache OSM data
    cacheData(category, data) {
        try {
            const cacheKey = `osm_${category}`;
            localStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('Failed to cache OSM data:', e);
        }
    },

    // Get cached OSM data
    getCachedData(category) {
        try {
            const cacheKey = `osm_${category}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Cache valid for 7 days
                if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
                    return data;
                }
            }
        } catch (e) {
            console.error('Failed to get cached OSM data:', e);
        }
        return null;
    }
};
