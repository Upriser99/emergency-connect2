// Favorites and Quick Contacts Management

const FavoritesManager = {
    favorites: [],

    // Initialize favorites from localStorage
    init() {
        this.loadFavorites();
        this.displayFavorites();
    },

    // Load favorites from localStorage
    loadFavorites() {
        const saved = localStorage.getItem('favorites');
        this.favorites = saved ? JSON.parse(saved) : [];
    },

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },

    // Toggle favorite
    toggleFavorite(service) {
        const index = this.favorites.findIndex(f =>
            f.name === service.name && f.phone === service.phone
        );

        if (index > -1) {
            // Remove from favorites
            this.favorites.splice(index, 1);
        } else {
            // Add to favorites (max 8)
            if (this.favorites.length >= 8) {
                alert('Maximum 8 favorites allowed. Remove one to add more.');
                return false;
            }
            this.favorites.push(service);
        }

        this.saveFavorites();
        this.displayFavorites();
        return true;
    },

    // Check if service is favorited
    isFavorite(service) {
        return this.favorites.some(f =>
            f.name === service.name && f.phone === service.phone
        );
    },

    // Display favorites
    displayFavorites() {
        const section = document.getElementById('favoritesSection');
        const list = document.getElementById('favoritesList');
        const empty = document.getElementById('favoritesEmpty');

        if (this.favorites.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        list.innerHTML = '';
        empty.style.display = 'none';

        this.favorites.forEach(service => {
            const card = this.createFavoriteCard(service);
            list.appendChild(card);
        });
    },

    // Create favorite card
    createFavoriteCard(service) {
        const card = document.createElement('div');
        card.className = 'favorite-card';

        // Calculate distance if user location available
        let distanceText = '';
        if (App.userLocation) {
            const distance = DistanceCalculator.calculateDistance(
                App.userLocation.lat,
                App.userLocation.lng,
                service.lat,
                service.lng
            );
            distanceText = DistanceCalculator.formatDistance(distance);
        }

        // Determine category for badge
        const category = service.category || 'service';
        const categoryIcons = {
            police: '🚔',
            hospital: '🏥',
            fire: '🚒',
            petrol: '⛽'
        };
        const categoryNames = {
            police: 'Police',
            hospital: 'Hospital',
            fire: 'Fire',
            petrol: 'Petrol'
        };

        card.innerHTML = `
            <div class="favorite-category-badge ${category}">
                ${categoryIcons[category] || '📍'} ${categoryNames[category] || 'Service'}
            </div>
            <div class="favorite-header">
                <h4 class="favorite-name">${service.name}</h4>
                <button class="favorite-remove" onclick="FavoritesManager.toggleFavorite(${JSON.stringify(service).replace(/"/g, '&quot;')})">
                    ✕
                </button>
            </div>
            <p class="favorite-address">${service.address}</p>
            ${distanceText ? `<div class="favorite-distance">${distanceText}</div>` : ''}
            <div class="favorite-actions">
                <a href="tel:${service.phone}" class="favorite-btn favorite-call">📞 Call</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}" 
                   target="_blank" class="favorite-btn favorite-directions">🗺️ Go</a>
            </div>
        `;

        return card;
    }
};

const ContactsManager = {
    contacts: [],

    // Initialize contacts from localStorage
    init() {
        this.loadContacts();
        this.displayContacts();
    },

    // Load contacts from localStorage
    loadContacts() {
        const saved = localStorage.getItem('quickContacts');
        this.contacts = saved ? JSON.parse(saved) : [];
    },

    // Save contacts to localStorage
    saveContacts() {
        localStorage.setItem('quickContacts', JSON.stringify(this.contacts));
    },

    // Add or update contact
    addContact(contact) {
        if (contact.id) {
            // Update existing
            const index = this.contacts.findIndex(c => c.id === contact.id);
            if (index > -1) {
                this.contacts[index] = contact;
            }
        } else {
            // Add new (max 10)
            if (this.contacts.length >= 10) {
                alert('Maximum 10 contacts allowed. Remove one to add more.');
                return false;
            }
            contact.id = Date.now().toString();
            this.contacts.push(contact);
        }

        this.saveContacts();
        this.displayContacts();
        return true;
    },

    // Delete contact
    deleteContact(id) {
        if (confirm('Delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.saveContacts();
            this.displayContacts();
        }
    },

    // Get contact by ID
    getContact(id) {
        return this.contacts.find(c => c.id === id);
    },

    // Display contacts
    displayContacts() {
        const section = document.getElementById('contactsSection');
        const list = document.getElementById('contactsList');
        const empty = document.getElementById('contactsEmpty');

        // Always show the section
        section.style.display = 'block';

        if (this.contacts.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        list.innerHTML = '';
        empty.style.display = 'none';

        this.contacts.forEach(contact => {
            const card = this.createContactCard(contact);
            list.appendChild(card);
        });
    },

    // Create contact card
    createContactCard(contact) {
        const card = document.createElement('div');
        card.className = 'contact-card';

        // Get initials for avatar
        const initials = contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        card.innerHTML = `
            <button class="contact-edit" onclick="editContact('${contact.id}')" title="Edit">✏️</button>
            <button class="contact-delete" onclick="ContactsManager.deleteContact('${contact.id}')" title="Delete">🗑️</button>
            <div class="contact-avatar">${initials}</div>
            <div class="contact-name">${contact.name}</div>
            ${contact.relation ? `<div class="contact-relation">${contact.relation}</div>` : ''}
            <div class="contact-phone">${contact.phone}</div>
            <div class="contact-actions">
                <a href="tel:${contact.phone}" class="contact-btn">📞 Call</a>
            </div>
        `;

        return card;
    }
};

// Global functions for contact modal
function showAddContactModal() {
    const modal = document.getElementById('contactModal');
    const title = document.getElementById('contactModalTitle');
    const form = document.getElementById('contactForm');

    title.textContent = '👤 Add Contact';
    form.reset();
    document.getElementById('contactId').value = '';

    modal.classList.add('active');
}

function editContact(id) {
    const contact = ContactsManager.getContact(id);
    if (!contact) return;

    const modal = document.getElementById('contactModal');
    const title = document.getElementById('contactModalTitle');

    title.textContent = '✏️ Edit Contact';
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactRelation').value = contact.relation || '';
    document.getElementById('contactId').value = contact.id;

    modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
}

function saveContact(event) {
    event.preventDefault();

    const contact = {
        id: document.getElementById('contactId').value,
        name: document.getElementById('contactName').value,
        phone: document.getElementById('contactPhone').value,
        relation: document.getElementById('contactRelation').value
    };

    if (ContactsManager.addContact(contact)) {
        closeContactModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    FavoritesManager.init();
    ContactsManager.init();
});
