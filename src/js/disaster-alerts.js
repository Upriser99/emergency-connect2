// Disaster Alerts System for Emergency Connect
// Frontend-only alert management

const DisasterAlerts = {
    alerts: [],
    STORAGE_KEY: 'emergencyConnect_alerts',

    // Alert types with icons and colors
    alertTypes: {
        flood: { icon: '🌊', color: '#3b82f6', name: 'Flood Warning' },
        earthquake: { icon: '🏚️', color: '#ef4444', name: 'Earthquake Alert' },
        fire: { icon: '🔥', color: '#f97316', name: 'Fire Emergency' },
        cyclone: { icon: '🌀', color: '#8b5cf6', name: 'Cyclone Warning' },
        heatwave: { icon: '🌡️', color: '#dc2626', name: 'Heat Wave' },
        storm: { icon: '⛈️', color: '#6366f1', name: 'Storm Alert' },
        landslide: { icon: '⛰️', color: '#92400e', name: 'Landslide Warning' },
        other: { icon: '⚠️', color: '#f59e0b', name: 'Emergency Alert' }
    },

    // Initialize alerts
    init() {
        this.loadAlerts();
        this.displayActiveBanner();
    },

    // Load alerts from localStorage
    loadAlerts() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.alerts = JSON.parse(stored);
                // Filter out expired alerts
                this.alerts = this.alerts.filter(alert => !this.isExpired(alert));
                this.saveAlerts();
            }
        } catch (e) {
            console.error('Failed to load alerts:', e);
        }
    },

    // Save alerts to localStorage
    saveAlerts() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alerts));
        } catch (e) {
            console.error('Failed to save alerts:', e);
        }
    },

    // Check if alert is expired
    isExpired(alert) {
        if (!alert.expiresAt) return false;
        return new Date(alert.expiresAt) < new Date();
    },

    // Create new alert
    createAlert(type, title, message, severity = 'high', duration = 24) {
        const alert = {
            id: Date.now(),
            type: type,
            title: title,
            message: message,
            severity: severity, // low, medium, high, critical
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
            read: false
        };

        this.alerts.unshift(alert);
        this.saveAlerts();
        this.displayActiveBanner();

        // Show notification if supported
        this.showNotification(alert);

        return alert;
    },

    // Display active alert banner
    displayActiveBanner() {
        const activeAlerts = this.alerts.filter(a => !a.read && !this.isExpired(a));
        const banner = document.getElementById('alertBanner');

        if (!banner) return;

        if (activeAlerts.length > 0) {
            const alert = activeAlerts[0];
            const typeInfo = this.alertTypes[alert.type] || this.alertTypes.other;

            banner.innerHTML = `
                <div class="alert-banner-content" style="background: ${typeInfo.color};">
                    <span class="alert-icon">${typeInfo.icon}</span>
                    <div class="alert-text">
                        <strong>${alert.title}</strong>
                        <p>${alert.message}</p>
                    </div>
                    <button onclick="DisasterAlerts.viewAlert(${alert.id})" class="alert-view-btn">View</button>
                    <button onclick="DisasterAlerts.dismissBanner(${alert.id})" class="alert-close-btn">×</button>
                </div>
            `;
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    },

    // View alert details
    viewAlert(id) {
        const alert = this.alerts.find(a => a.id === id);
        if (!alert) return;

        const typeInfo = this.alertTypes[alert.type] || this.alertTypes.other;

        const modal = document.getElementById('alertModal');
        if (!modal) return;

        document.getElementById('alertModalTitle').textContent = `${typeInfo.icon} ${alert.title}`;
        document.getElementById('alertModalMessage').textContent = alert.message;
        document.getElementById('alertModalSafety').innerHTML = this.getSafetyInstructions(alert.type);

        modal.classList.add('active');

        // Mark as read
        alert.read = true;
        this.saveAlerts();
    },

    // Get safety instructions for alert type
    getSafetyInstructions(type) {
        const instructions = {
            flood: `
                <h4>Safety Instructions:</h4>
                <ul>
                    <li>Move to higher ground immediately</li>
                    <li>Avoid walking or driving through flood water</li>
                    <li>Stay away from power lines and electrical wires</li>
                    <li>Listen to emergency broadcasts</li>
                    <li>Keep emergency supplies ready</li>
                </ul>
            `,
            earthquake: `
                <h4>Safety Instructions:</h4>
                <ul>
                    <li>DROP, COVER, and HOLD ON</li>
                    <li>Stay indoors until shaking stops</li>
                    <li>Stay away from windows and heavy objects</li>
                    <li>If outdoors, move to open area</li>
                    <li>After shaking stops, check for injuries</li>
                </ul>
            `,
            fire: `
                <h4>Safety Instructions:</h4>
                <ul>
                    <li>Evacuate immediately if safe to do so</li>
                    <li>Stay low to avoid smoke</li>
                    <li>Close doors behind you</li>
                    <li>Call 101 (Fire Service)</li>
                    <li>Do not use elevators</li>
                </ul>
            `,
            cyclone: `
                <h4>Safety Instructions:</h4>
                <ul>
                    <li>Stay indoors in a safe room</li>
                    <li>Keep away from windows</li>
                    <li>Store drinking water and food</li>
                    <li>Keep emergency kit ready</li>
                    <li>Listen to weather updates</li>
                </ul>
            `,
            heatwave: `
                <h4>Safety Instructions:</h4>
                <ul>
                    <li>Stay hydrated - drink plenty of water</li>
                    <li>Avoid going out during peak hours (11 AM - 4 PM)</li>
                    <li>Wear light, loose clothing</li>
                    <li>Check on elderly and children</li>
                    <li>Never leave anyone in parked vehicles</li>
                </ul>
            `
        };

        return instructions[type] || '<p>Stay safe and follow official guidance.</p>';
    },

    // Dismiss banner
    dismissBanner(id) {
        const alert = this.alerts.find(a => a.id === id);
        if (alert) {
            alert.read = true;
            this.saveAlerts();
        }
        this.displayActiveBanner();
    },

    // Show browser notification
    showNotification(alert) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const typeInfo = this.alertTypes[alert.type] || this.alertTypes.other;
            new Notification(`${typeInfo.icon} ${alert.title}`, {
                body: alert.message,
                icon: '/public/icons/icon-192.png',
                badge: '/public/icons/icon-192.png',
                tag: `alert-${alert.id}`
            });
        }
    },

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }
};

// Demo function to show disaster alert
function showDisasterAlertDemo() {
    // Request notification permission first
    DisasterAlerts.requestNotificationPermission();

    // Create a demo alert
    const demoAlerts = [
        {
            type: 'heatwave',
            title: 'Heat Wave Alert - Indore',
            message: 'Temperature expected to reach 45°C today. Stay indoors during peak hours (11 AM - 4 PM).',
            severity: 'high'
        },
        {
            type: 'flood',
            title: 'Heavy Rain Warning',
            message: 'IMD predicts heavy rainfall in Indore. Low-lying areas may experience waterlogging.',
            severity: 'medium'
        },
        {
            type: 'storm',
            title: 'Thunderstorm Alert',
            message: 'Severe thunderstorm expected in next 2 hours. Stay indoors and avoid travel.',
            severity: 'high'
        }
    ];

    // Pick a random demo alert
    const demo = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];

    // Create the alert
    DisasterAlerts.createAlert(
        demo.type,
        demo.title,
        demo.message,
        demo.severity,
        24 // 24 hours duration
    );
}

// Close alert modal
function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DisasterAlerts.init());
} else {
    DisasterAlerts.init();
}
