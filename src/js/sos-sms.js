// SOS SMS Blast - Send emergency SMS to all contacts
// Uses SMS protocol to send messages

const SOSSMSBlast = {

    // Send SOS to all quick contacts
    async sendToAll() {
        // Get quick contacts from localStorage
        const contacts = JSON.parse(localStorage.getItem('quickContacts') || '[]');

        if (contacts.length === 0) {
            alert('No quick contacts found. Please add contacts first.');
            return;
        }

        // Get current location
        const location = await this.getCurrentLocation();

        // Get health card info
        const healthCard = JSON.parse(localStorage.getItem('healthCard') || '{}');

        // Compose message
        const message = this.composeMessage(location, healthCard);

        // Show confirmation
        if (!confirm(`Send SOS to ${contacts.length} contact(s)?\n\n"${message}"`)) {
            return;
        }

        // Send to each contact
        this.sendSequentially(contacts, message);
    },

    // Get current GPS location
    async getCurrentLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
                    resolve({
                        lat,
                        lon,
                        link: googleMapsLink
                    });
                },
                (error) => {
                    console.error('Location error:', error);
                    resolve(null);
                }
            );
        });
    },

    // Compose emergency message
    composeMessage(location, healthCard) {
        let message = '🚨 EMERGENCY! I need help.';

        // Add location
        if (location) {
            message += `\n📍 Location: ${location.link}`;
        }

        // Add health info
        if (healthCard.bloodGroup) {
            message += `\n🩸 Blood: ${healthCard.bloodGroup}`;
        }

        if (healthCard.allergies) {
            message += `\n⚠️ Allergies: ${healthCard.allergies}`;
        }

        if (healthCard.emergencyContact) {
            message += `\n📞 Emergency Contact: ${healthCard.emergencyContact}`;
        }

        // Add timestamp
        const time = new Date().toLocaleString();
        message += `\n🕐 Time: ${time}`;

        message += '\n\nPlease call me or emergency services immediately!';

        return message;
    },

    // Send SMS sequentially to avoid overwhelming
    sendSequentially(contacts, message) {
        let index = 0;
        let successCount = 0;

        const sendNext = () => {
            if (index >= contacts.length) {
                alert(`✅ SOS sent to ${successCount}/${contacts.length} contact(s)`);
                return;
            }

            const contact = contacts[index];
            const phoneNumber = contact.phone.replace(/\D/g, ''); // Remove non-digits

            try {
                // Use SMS protocol
                window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
                successCount++;
            } catch (error) {
                console.error(`Failed to send to ${contact.name}:`, error);
            }

            index++;

            // Wait 2 seconds before next SMS to allow user to send
            setTimeout(sendNext, 2000);
        };

        sendNext();
    },

    // Send to specific contact
    sendToContact(contactId) {
        const contacts = JSON.parse(localStorage.getItem('quickContacts') || '[]');
        const contact = contacts.find(c => c.id === contactId);

        if (!contact) {
            alert('Contact not found');
            return;
        }

        this.getCurrentLocation().then(location => {
            const healthCard = JSON.parse(localStorage.getItem('healthCard') || '{}');
            const message = this.composeMessage(location, healthCard);

            const phoneNumber = contact.phone.replace(/\D/g, '');
            window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        });
    }
};

// Global function for button click
function sendSOSBlast() {
    SOSSMSBlast.sendToAll();
}

function sendSOSToContact(contactId) {
    SOSSMSBlast.sendToContact(contactId);
}
