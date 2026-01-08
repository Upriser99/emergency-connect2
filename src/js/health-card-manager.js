// Multi-Person Health Card Manager
// Supports storing up to 5 health cards for family members

const HealthCardManager = {
    cards: [],
    activeCardIndex: 0,
    maxCards: 5,

    init() {
        this.loadCards();
        this.updateCardsList();
        this.updatePreview();
        this.updateHomeCardsList(); // Update home page selector
    },

    loadCards() {
        const saved = localStorage.getItem('healthCards');
        if (saved) {
            try {
                this.cards = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading health cards:', e);
                this.cards = [];
            }
        }
    },

    save(cardData) {
        // Check if card with this name exists
        const existingIndex = this.cards.findIndex(c => c.name === cardData.name);

        if (existingIndex >= 0) {
            // Update existing card
            this.cards[existingIndex] = cardData;
            this.activeCardIndex = existingIndex;
        } else {
            // Add new card (max 5)
            if (this.cards.length >= this.maxCards) {
                alert(`Maximum ${this.maxCards} health cards allowed. Please delete one to add another.`);
                return false;
            }
            this.cards.push(cardData);
            this.activeCardIndex = this.cards.length - 1;
        }

        localStorage.setItem('healthCards', JSON.stringify(this.cards));
        this.updateCardsList();
        this.updatePreview();
        this.updateHomeCardsList(); // Update home page
        return true;
    },

    getActiveCard() {
        return this.cards[this.activeCardIndex] || null;
    },

    setActiveCard(index) {
        if (index >= 0 && index < this.cards.length) {
            this.activeCardIndex = index;
            this.updatePreview();
            this.updateCardsList(); // Update modal
            this.updateHomeCardsList(); // Update home page
        }
    },

    deleteCard(index) {
        if (confirm(`Delete health card for ${this.cards[index].name}?`)) {
            this.cards.splice(index, 1);
            if (this.activeCardIndex >= this.cards.length) {
                this.activeCardIndex = Math.max(0, this.cards.length - 1);
            }
            localStorage.setItem('healthCards', JSON.stringify(this.cards));
            this.updateCardsList();
            this.updatePreview();
            this.updateHomeCardsList(); // Update home page
        }
    },

    updateCardsList() {
        const container = document.getElementById('healthCardsList');
        if (!container) return;

        if (this.cards.length === 0) {
            container.innerHTML = '';
            return;
        }

        const cardsHTML = this.cards.map((card, index) => {
            const isActive = index === this.activeCardIndex;
            return `
                <button type="button" 
                        onclick="HealthCardManager.setActiveCard(${index}); loadHealthCardToForm(${index});"
                        class="health-card-btn ${isActive ? 'active' : ''}">
                    <span class="card-name">${card.name}</span>
                    <span class="card-delete" onclick="event.stopPropagation(); HealthCardManager.deleteCard(${index});">×</span>
                </button>
            `;
        }).join('');

        container.innerHTML = `
            <div class="saved-cards-section">
                <strong>Saved Health Cards:</strong>
                <div class="cards-button-group">
                    ${cardsHTML}
                </div>
            </div>
        `;
    },

    updateHomeCardsList() {
        const container = document.getElementById('healthCardsListHome');
        const actionsContainer = document.getElementById('healthCardActions');

        if (!container) return;

        if (this.cards.length === 0) {
            container.innerHTML = '';
            if (actionsContainer) actionsContainer.style.display = 'none';
            return;
        }

        // Show action buttons when cards exist
        if (actionsContainer) actionsContainer.style.display = 'flex';

        const cardsHTML = this.cards.map((card, index) => {
            const isActive = index === this.activeCardIndex;
            return `
                <button type="button" 
                        onclick="HealthCardManager.setActiveCard(${index});"
                        class="health-card-btn ${isActive ? 'active' : ''}">
                    <span class="card-name">${card.name}</span>
                </button>
            `;
        }).join('');

        container.innerHTML = `
            <div class="saved-cards-section">
                <strong>Select Card:</strong>
                <div class="cards-button-group">
                    ${cardsHTML}
                </div>
            </div>
        `;
    },

    updatePreview() {
        const preview = document.getElementById('healthCardPreview');
        if (!preview) return;

        const card = this.getActiveCard();
        if (!card) {
            preview.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem;">Store your medical info for emergencies</p>';
            return;
        }

        // Show ALL fields that have data
        let html = '<div style="text-align: left;">';
        html += `<p style="margin: 0.5rem 0; font-size: 1rem; font-weight: 600; color: var(--primary-color);">${card.name}</p>`;

        if (card.bloodGroup) html += `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Blood Group:</strong> ${card.bloodGroup}</p>`;
        if (card.allergies) html += `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Allergies:</strong> ${card.allergies}</p>`;
        if (card.conditions) html += `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Conditions:</strong> ${card.conditions}</p>`;
        if (card.medications) html += `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Medications:</strong> ${card.medications}</p>`;
        if (card.emergencyContact) html += `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Emergency Contact:</strong> ${card.emergencyContact}</p>`;
        if (card.doctorContact) html += `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Doctor:</strong> ${card.doctorContact}</p>`;

        html += '</div>';
        preview.innerHTML = html;
    }
};

// Global helper functions
function showHealthCard() {
    document.getElementById('healthCardModal').classList.add('active');
    HealthCardManager.updateCardsList();

    // Load active card if exists
    const activeCard = HealthCardManager.getActiveCard();
    if (activeCard) {
        loadHealthCardToForm(HealthCardManager.activeCardIndex);
    } else {
        // Clear form for new card
        document.getElementById('healthCardForm').reset();
    }
}

function loadHealthCardToForm(index) {
    const card = HealthCardManager.cards[index];
    if (!card) return;

    document.getElementById('cardName').value = card.name || '';
    document.getElementById('bloodGroup').value = card.bloodGroup || '';
    document.getElementById('allergies').value = card.allergies || '';
    document.getElementById('conditions').value = card.conditions || '';
    document.getElementById('medications').value = card.medications || '';
    document.getElementById('emergencyContact').value = card.emergencyContact || '';
    document.getElementById('doctorContact').value = card.doctorContact || '';
}

function saveHealthCard(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('cardName').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        allergies: document.getElementById('allergies').value,
        conditions: document.getElementById('conditions').value,
        medications: document.getElementById('medications').value,
        emergencyContact: document.getElementById('emergencyContact').value,
        doctorContact: document.getElementById('doctorContact').value
    };

    const success = HealthCardManager.save(formData);
    if (success) {
        alert(`Health Card saved for ${formData.name}!`);
        document.getElementById('healthCardForm').reset();
    }
}

function shareHealthCard() {
    const card = HealthCardManager.getActiveCard();

    if (!card || !card.name) {
        alert('Please save a health card first!');
        return;
    }

    let message = `🏥 EMERGENCY HEALTH CARD - ${card.name}\n\n`;
    if (card.bloodGroup) message += `Blood Group: ${card.bloodGroup}\n`;
    if (card.allergies) message += `Allergies: ${card.allergies}\n`;
    if (card.conditions) message += `Conditions: ${card.conditions}\n`;
    if (card.medications) message += `Medications: ${card.medications}\n`;
    if (card.emergencyContact) message += `Emergency Contact: ${card.emergencyContact}\n`;
    if (card.doctorContact) message += `Doctor: ${card.doctorContact}\n`;

    if (navigator.share) {
        navigator.share({
            title: `Health Card - ${card.name}`,
            text: message
        }).catch(() => {
            navigator.clipboard.writeText(message);
            alert('Health card copied to clipboard!');
        });
    } else {
        navigator.clipboard.writeText(message);
        alert('Health card copied to clipboard!');
    }
}

function closeHealthCard() {
    document.getElementById('healthCardModal').classList.remove('active');
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        HealthCardManager.init();
    });
} else {
    HealthCardManager.init();
}
