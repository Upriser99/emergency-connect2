// Emergency Connect - Main Application
// Phase 1-6 Complete

// Show Emergency Guides View
function showGuidesView() {
    document.getElementById('homeView').classList.remove('active');
    document.getElementById('serviceView').classList.remove('active');
    document.getElementById('guidesView').classList.add('active');
}

// Show Home View
function showHome() {
    document.getElementById('homeView').classList.add('active');
    document.getElementById('serviceView').classList.remove('active');
    document.getElementById('guidesView').classList.remove('active');
}

// Main Application Logic
const App = {
    currentView: 'home',
    currentCategory: null,
    userLocation: null,
    isOnline: navigator.onLine,
    currentDisplayView: 'list', // 'list' or 'map'
    currentServices: [], // Store current services for map view
    currentTheme: 'light', // 'light' or 'dark'
    currentLang: 'en', // 'en' or 'hi'
    serviceCounts: {}, // Store service counts for each category

    // Initialize app
    async init() {
        console.log('🚨 Emergency Connect - Initializing...');

        // Initialize theme and language
        this.initTheme();
        this.initLanguage();

        // Check and show disclaimer if not accepted
        this.checkDisclaimer();

        // Set up online/offline listeners
        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

        // Get user location
        await this.initLocation();

        // Update service counts
        this.updateServiceCounts();

        // Handle deep linking from PWA shortcuts
        this.handleDeepLink();

        console.log('✅ App initialized');
    },

    // Handle deep linking from URL parameters
    handleDeepLink() {
        const urlParams = new URLSearchParams(window.location.search);
        const view = urlParams.get('view');
        const action = urlParams.get('action');

        if (action === 'call112') {
            // Direct call to 112
            window.location.href = 'tel:112';
        } else if (action === 'numbers') {
            // Scroll to emergency numbers
            setTimeout(() => {
                const numbersSection = document.querySelector('.emergency-numbers');
                if (numbersSection) {
                    numbersSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        } else if (action === 'guides') {
            // Scroll to emergency guides
            setTimeout(() => {
                const guidesSection = document.querySelector('.guides-section');
                if (guidesSection) {
                    guidesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        } else if (action === 'share') {
            // Trigger share location
            setTimeout(() => {
                if (typeof shareLocation === 'function') {
                    shareLocation();
                }
            }, 500);
        } else if (view && ['police', 'hospital', 'fire', 'petrol', 'ambulance', 'pharmacy', 'bank'].includes(view)) {
            // Auto-open the category
            setTimeout(() => {
                this.showServices(view);
            }, 500);
        }
    },

    // Initialize theme from localStorage
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                document.getElementById('themeIcon').textContent = '☀️';
            }
        } else {
            // Auto-detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            }
        }
    },

    // Initialize language from localStorage
    initLanguage() {
        const savedLang = localStorage.getItem('language') || 'en';
        this.currentLang = savedLang;
        this.updateLanguageUI();
    },

    // Set theme
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeIcon').textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('themeIcon').textContent = '🌙';
        }
    },

    // Update language UI
    updateLanguageUI() {
        const langIcon = document.getElementById('langIcon');
        if (langIcon) {
            langIcon.textContent = this.currentLang === 'en' ? '🌐 EN' : '🌐 HI';
        }
    },

    // Update service counts on home page
    updateServiceCounts() {
        const categories = ['police', 'hospital', 'fire', 'petrol', 'ambulance', 'pharmacy', 'bank'];

        categories.forEach(category => {
            const count = STATIC_DATA[category] ? STATIC_DATA[category].length : 0;
            const countEl = document.getElementById(`${category}Count`);
            if (countEl) {
                const nearbyText = (typeof t === 'function') ? t('nearby') : 'nearby';
                countEl.textContent = `${count} ${nearbyText}`;
            }
        });
    },

    // Check if disclaimer has been accepted
    checkDisclaimer() {
        const accepted = localStorage.getItem('disclaimerAccepted');
        if (!accepted) {
            this.showDisclaimer();
        }
    },

    // Show disclaimer modal
    showDisclaimer() {
        const modal = document.getElementById('disclaimerModal');
        if (modal) {
            modal.classList.add('active');
        }
    },

    // Initialize location
    async initLocation() {
        this.updateLocationStatus('Detecting location...', 'loading');

        try {
            this.userLocation = await GeolocationService.getCurrentLocation();

            if (this.userLocation.fallback) {
                this.updateLocationStatus('Using Indore city center', 'online');
            } else {
                const accuracy = this.userLocation.accuracy
                    ? ` (±${Math.round(this.userLocation.accuracy)}m)`
                    : '';
                this.updateLocationStatus(`Location detected${accuracy}`, 'online');
            }
        } catch (error) {
            console.error('Location error:', error);
            this.updateLocationStatus('Location unavailable', 'offline');
        }
    },

    // Update location status display
    updateLocationStatus(text, status) {
        const statusText = document.getElementById('statusText');
        const statusDot = document.querySelector('.status-dot');

        if (statusText) statusText.textContent = text;
        if (statusDot) {
            statusDot.className = `status-dot ${status}`;
        }
    },

    // Update online/offline status
    updateOnlineStatus(online) {
        this.isOnline = online;
        const statusText = document.getElementById('statusText');
        const currentText = statusText.textContent;

        if (!online && !currentText.includes('Offline')) {
            this.updateLocationStatus(currentText + ' (Offline)', 'offline');
        }
    },

    // Show services for a category
    async showServices(category) {
        this.currentCategory = category;
        this.currentView = 'service';

        // Switch views
        document.getElementById('homeView').classList.remove('active');
        document.getElementById('serviceView').classList.add('active');

        // Update title
        const titles = {
            police: '🚔 Police Stations',
            hospital: '🏥 Hospitals',
            fire: '🚒 Fire Stations',
            petrol: '⛽ Petrol Pumps',
            ambulance: '🚑 Ambulance Services',
            pharmacy: '💊 Pharmacies',
            bank: '🏦 Banks & ATMs'
        };
        document.getElementById('serviceTitle').textContent = titles[category];

        // Show loading
        document.getElementById('loadingIndicator').style.display = 'block';
        document.getElementById('serviceList').innerHTML = '';

        // Load services
        await this.loadServices(category);
    },

    // Load services for category
    async loadServices(category) {
        try {
            // Start with static data
            let services = [...STATIC_DATA[category]];

            // Try to fetch OSM data if online
            if (this.isOnline) {
                console.log(`Fetching OSM data for ${category}...`);

                // Check cache first
                let osmData = OSMService.getCachedData(category);

                if (!osmData) {
                    // Fetch fresh data
                    osmData = await OSMService.fetchNearbyPlaces(
                        category,
                        this.userLocation.lat,
                        this.userLocation.lng,
                        INDORE_CONFIG.searchRadius
                    );

                    // Cache it
                    if (osmData.length > 0) {
                        OSMService.cacheData(category, osmData);
                    }
                }

                // Merge with static data
                if (osmData && osmData.length > 0) {
                    services = OSMService.mergeResults(services, osmData);
                    console.log(`Merged ${osmData.length} OSM results`);
                }
            }

            // Calculate distances and sort
            const sortedServices = DistanceCalculator.sortByDistance(
                services,
                this.userLocation
            );

            // Display services (limit to top 15)
            this.displayServices(sortedServices.slice(0, 15));

        } catch (error) {
            console.error('Error loading services:', error);
            // Fallback to static data only
            const sortedServices = DistanceCalculator.sortByDistance(
                STATIC_DATA[category],
                this.userLocation
            );
            this.displayServices(sortedServices);
        } finally {
            document.getElementById('loadingIndicator').style.display = 'none';
        }
    },

    // Display services in the list
    displayServices(services) {
        // Store services for map view and search
        this.currentServices = services;
        allServices = services; // Global for search

        const listContainer = document.getElementById('serviceList');
        listContainer.innerHTML = '';

        if (services.length === 0) {
            listContainer.innerHTML = '<p style="color: white; text-align: center; padding: 2rem;">No services found nearby.</p>';
            return;
        }

        services.forEach(service => {
            const card = this.createServiceCard(service);
            listContainer.appendChild(card);
        });

        // Initialize map if in map view
        if (this.currentDisplayView === 'map') {
            this.showMapView();
        }

        // Clear search input when new services load
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            document.getElementById('searchClear').style.display = 'none';
        }
    },

    // Create service card element
    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';

        // Add ATM class if it's an ATM
        if (service.type === 'atm') {
            card.classList.add('atm');
        } else if (service.type === 'bank') {
            card.classList.add('bank-type');
        }

        const distanceCategory = DistanceCalculator.getDistanceCategory(service.distance);
        const distanceText = DistanceCalculator.formatDistance(service.distance);

        const verifiedBadge = service.verified
            ? '<span class="verified-badge">✓ Verified</span>'
            : '';

        // Add 24/7 badge if service is open 24/7
        const badge24x7 = service.is24x7
            ? '<span class="badge-24x7">24/7 Open</span>'
            : '';

        // Add ATM type badge
        const typeBadge = service.type === 'atm'
            ? '<span class="service-type-badge">ATM</span>'
            : '';

        // Check if favorited
        const isFav = typeof FavoritesManager !== 'undefined' && FavoritesManager.isFavorite(service);
        const starIcon = isFav ? '⭐' : '☆';
        const starClass = isFav ? 'active' : '';

        card.innerHTML = `
            <button class="favorite-star ${starClass}" onclick='toggleFavoriteFromCard(${JSON.stringify(service).replace(/'/g, "\\'")}); event.stopPropagation();'>
                ${starIcon}
            </button>
            <div class="service-header">
                <div class="service-name">
                    ${service.name}
                    ${verifiedBadge}
                    ${badge24x7}
                    ${typeBadge}
                </div>
                <div class="distance-badge ${distanceCategory}">${distanceText}</div>
            </div>
            <div class="service-address">${service.address}</div>
            ${service.phone !== 'N/A' ? `<div class="service-phone">📞 ${service.phone}</div>` : ''}
            <div class="service-actions">
                <a href="tel:${service.phone}" class="action-btn call-btn">
                    📞 Call Now
                </a>
                <a href="${this.getDirectionsUrl(service)}" target="_blank" class="action-btn directions-btn">
                    🗺️ Directions
                </a>
            </div>
        `;

        return card;
    },

    // Get Google Maps directions URL
    getDirectionsUrl(service) {
        return `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}&travelmode=driving`;
    },

    // Switch between list and map view
    switchView(viewType) {
        this.currentDisplayView = viewType;

        const listViewBtn = document.getElementById('listViewBtn');
        const mapViewBtn = document.getElementById('mapViewBtn');
        const serviceList = document.getElementById('serviceList');
        const mapContainer = document.getElementById('mapContainer');

        if (viewType === 'list') {
            // Show list view
            listViewBtn.classList.add('active');
            mapViewBtn.classList.remove('active');
            serviceList.style.display = 'flex';
            mapContainer.style.display = 'none';
        } else {
            // Show map view
            listViewBtn.classList.remove('active');
            mapViewBtn.classList.add('active');
            serviceList.style.display = 'none';
            mapContainer.style.display = 'block';

            this.showMapView();
        }
    },

    // Initialize and show map view
    showMapView() {
        console.log('showMapView called');
        console.log('User location:', this.userLocation);
        console.log('Current services:', this.currentServices.length);

        if (!this.userLocation || !this.currentServices.length) {
            console.warn('Cannot show map: missing location or services');
            return;
        }

        try {
            // Initialize map if not already done
            if (!MapService.map) {
                console.log('Initializing map...');
                MapService.initMap('map', this.userLocation);
            }

            // Add user location marker
            console.log('Adding user marker...');
            MapService.addUserMarker(this.userLocation);

            // Add service markers
            console.log('Adding service markers...');
            MapService.addServiceMarkers(
                this.currentServices,
                this.currentCategory,
                this.userLocation
            );

            // Resize map to ensure proper display
            console.log('Resizing map...');
            MapService.resize();

            console.log('Map view initialized successfully');
        } catch (error) {
            console.error('Error showing map view:', error);
            alert('Map error: ' + error.message + '\nCheck console for details.');
        }
    },

    // Show home view
    showHome() {
        this.currentView = 'home';
        this.currentCategory = null;
        this.currentDisplayView = 'list'; // Reset to list view

        document.getElementById('serviceView').classList.remove('active');
        document.getElementById('homeView').classList.add('active');
    }
};

// Global functions for onclick handlers
function showServices(category) {
    App.showServices(category);
}

function showHome() {
    App.showHome();
}

function switchView(viewType) {
    App.switchView(viewType);
}

// Disclaimer functions
function acceptDisclaimer() {
    localStorage.setItem('disclaimerAccepted', 'true');
    const modal = document.getElementById('disclaimerModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeDisclaimer() {
    // Don't allow closing without accepting
    return false;
}

// Search/Filter functions
let allServices = []; // Store unfiltered services

function filterServices(query) {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const serviceList = document.getElementById('serviceList');

    // Show/hide clear button
    if (query.trim()) {
        searchClear.style.display = 'flex';
    } else {
        searchClear.style.display = 'none';
    }

    // Filter services
    const filtered = allServices.filter(service => {
        const searchText = query.toLowerCase();
        return service.name.toLowerCase().includes(searchText) ||
            service.address.toLowerCase().includes(searchText);
    });

    // Display filtered results
    if (filtered.length === 0) {
        serviceList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No Results Found</h3>
                <p>Try a different search term</p>
            </div>
        `;
    } else {
        serviceList.innerHTML = '';
        filtered.forEach(service => {
            const card = App.createServiceCard(service);
            serviceList.appendChild(card);
        });
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    searchInput.value = '';
    searchClear.style.display = 'none';

    // Restore all services
    filterServices('');
}

// Theme toggle function
function toggleTheme() {
    const newTheme = App.currentTheme === 'light' ? 'dark' : 'light';
    App.setTheme(newTheme);
}

// Quick fix for language toggle
function toggleLanguage() {
    const newLang = App.currentLang === 'en' ? 'hi' : 'en';
    App.currentLang = newLang;
    localStorage.setItem('language', newLang);
    App.updateLanguageUI();

    // Update all UI text
    updateAllText();
}


// Coming soon handler
function showComingSoon(category) {
    alert(`${category} ${t('comingSoonMessage')}\n\n${t('comingSoonDetail')}`);
}

// Toggle favorite from service card
function toggleFavoriteFromCard(service) {
    if (typeof FavoritesManager !== 'undefined') {
        if (FavoritesManager.toggleFavorite(service)) {
            // Refresh the current service list to update star icons
            if (App.currentServices && App.currentServices.length > 0) {
                App.displayServices(App.currentServices);
            }
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

