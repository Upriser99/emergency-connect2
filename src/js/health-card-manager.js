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
        return true;
    },

    getActiveCard() {
        return this.cards[this.activeCardIndex] || null;
    },

    setActiveCard(index) {
        if (index >= 0 && index < this.cards.length) {
            this.activeCardIndex = index;
            this.updatePreview();
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
        }
    },

    updateCardsList() {
        const container = document.getElementById('healthCardsList');
        if (!container) return;

        if (this.cards.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Saved Health Cards:</strong>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                    ${this.cards.map((card, index) => `
                        <button type="button" 
                                onclick="HealthCardManager.setActiveCard(${index}); loadHealthCardToForm(${index});"
                                style="padding: 0.5rem 1rem; 
                                       background: ${index === this.activeCardIndex ? 'var(--primary-color)' : '#f3f4f6'}; 
                                       color: ${index === this.activeCardIndex ? 'white' : '#374151'};
                                       border: 1px solid #d1d5db;
                                       border-radius: 6px;
                                       cursor: pointer;
                                       font-size: 0.875rem;
                                       display: flex;
                                       align-items: center;
                                       gap: 0.5rem;">
                            ${card.name}
                            <span onclick="event.stopPropagation(); HealthCardManager.deleteCard(${index});" 
                                  style="color: ${index === this.activeCardIndex ? 'white' : '#ef4444'}; 
                                         font-weight: bold; 
                                         cursor: pointer;">×</span>
                        </button>
                    `).join('')}
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

        preview.innerHTML = `
            <div style="text-align: left;">
                <p style="margin: 0.25rem 0; font-size: 0.9375rem;"><strong>Name:</strong> ${card.name}</p>
                ${card.bloodGroup ? `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Blood:</strong> ${card.bloodGroup}</p>` : ''}
                ${card.allergies ? `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Allergies:</strong> ${card.allergies}</p>` : ''}
            </div>
        `;
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
