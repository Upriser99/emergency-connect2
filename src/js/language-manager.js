// Language Persistence Manager
// Saves and loads language preference

const LanguageManager = {
    STORAGE_KEY: 'emergencyConnect_language',

    // Save language preference
    saveLanguage(lang) {
        try {
            localStorage.setItem(this.STORAGE_KEY, lang);
            console.log(`Language saved: ${lang}`);
        } catch (e) {
            console.error('Failed to save language:', e);
        }
    },

    // Load saved language
    loadLanguage() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved && (saved === 'en' || saved === 'hi')) {
                return saved;
            }
        } catch (e) {
            console.error('Failed to load language:', e);
        }

        // Fallback to browser language
        return this.detectBrowserLanguage();
    },

    // Detect browser language
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        // Check if Hindi
        if (browserLang.startsWith('hi')) {
            return 'hi';
        }
        // Default to English
        return 'en';
    },

    // Initialize language on app start
    init() {
        const savedLang = this.loadLanguage();
        console.log(`Initializing with language: ${savedLang}`);
        return savedLang;
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
