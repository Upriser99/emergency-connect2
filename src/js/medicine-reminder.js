// Medicine Reminder Module
// Helps users track medications and get reminder notifications

const MedicineReminder = {
    medicines: [],
    db: null,

    // Initialize
    async init() {
        await this.loadMedicines();
        this.requestNotificationPermission();
        this.checkDueReminders();
        // Check every minute for due reminders
        setInterval(() => this.checkDueReminders(), 60000);
    },

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    },

    // Load medicines from localStorage
    async loadMedicines() {
        const stored = localStorage.getItem('medicines');
        this.medicines = stored ? JSON.parse(stored) : [];
        return this.medicines;
    },

    // Save medicines to localStorage
    saveMedicines() {
        localStorage.setItem('medicines', JSON.stringify(this.medicines));
    },

    // Add new medicine
    addMedicine(medicine) {
        const newMedicine = {
            id: Date.now(),
            name: medicine.name,
            dosage: medicine.dosage,
            times: medicine.times, // Array of times like ['09:00', '14:00', '21:00']
            frequency: medicine.frequency, // 'daily', 'weekly', 'as-needed'
            days: medicine.days || [], // For weekly: ['monday', 'tuesday']
            notes: medicine.notes || '',
            startDate: medicine.startDate || new Date().toISOString().split('T')[0],
            endDate: medicine.endDate || null,
            history: [], // Track when doses were taken
            createdAt: Date.now()
        };

        this.medicines.push(newMedicine);
        this.saveMedicines();
        this.showMedicinesList();
        return newMedicine;
    },

    // Update medicine
    updateMedicine(id, updates) {
        const index = this.medicines.findIndex(m => m.id === id);
        if (index !== -1) {
            this.medicines[index] = { ...this.medicines[index], ...updates };
            this.saveMedicines();
            this.showMedicinesList();
        }
    },

    // Delete medicine
    deleteMedicine(id) {
        this.medicines = this.medicines.filter(m => m.id !== id);
        this.saveMedicines();
        this.showMedicinesList();
    },

    // Mark dose as taken
    markDoseTaken(medicineId, timeSlot) {
        const medicine = this.medicines.find(m => m.id === medicineId);
        if (medicine) {
            const record = {
                timestamp: Date.now(),
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                scheduledTime: timeSlot
            };

            if (!medicine.history) {
                medicine.history = [];
            }
            medicine.history.push(record);

            this.saveMedicines();
            this.showMedicinesList();

            // Success feedback
            this.showToast(`✅ ${medicine.name} marked as taken`);
        }
    },

    // Check for due reminders
    checkDueReminders() {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
        const today = now.toISOString().split('T')[0];

        this.medicines.forEach(medicine => {
            // Check if medicine is active
            if (medicine.endDate && medicine.endDate < today) return;
            if (medicine.startDate > today) return;

            // Check frequency
            if (medicine.frequency === 'weekly') {
                if (!medicine.days.includes(currentDay)) return;
            }

            // Check each time slot
            medicine.times.forEach(timeSlot => {
                if (timeSlot === currentTime) {
                    // Check if already taken today at this time
                    const alreadyTaken = medicine.history?.some(h =>
                        h.date === today && h.scheduledTime === timeSlot
                    );

                    if (!alreadyTaken) {
                        this.sendNotification(medicine, timeSlot);
                    }
                }
            });
        });
    },

    // Send browser notification
    sendNotification(medicine, timeSlot) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('💊 Medicine Reminder', {
                body: `Time to take ${medicine.name} (${medicine.dosage})`,
                icon: '/public/icons/icon-192.png',
                badge: '/public/icons/icon-72.png',
                tag: `medicine-${medicine.id}-${timeSlot}`,
                requireInteraction: true,
                actions: [
                    { action: 'taken', title: 'Mark as Taken' },
                    { action: 'snooze', title: 'Snooze 15min' }
                ]
            });

            notification.onclick = () => {
                window.focus();
                showMedicineReminder();
                notification.close();
            };
        }

        // Also show in-app notification
        this.showInAppNotification(medicine, timeSlot);
    },

    // Show in-app notification banner
    showInAppNotification(medicine, timeSlot) {
        const banner = document.createElement('div');
        banner.className = 'medicine-notification-banner';
        banner.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">💊</div>
                <div class="notification-text">
                    <div class="notification-title">Medicine Reminder</div>
                    <div class="notification-medicine">${medicine.name} (${medicine.dosage})</div>
                    <div class="notification-time">Scheduled for ${timeSlot}</div>
                </div>
            </div>
            <div class="notification-actions">
                <button class="btn-taken" onclick="MedicineReminder.markDoseTaken(${medicine.id}, '${timeSlot}'); this.closest('.medicine-notification-banner').remove();">
                    ✅ Taken
                </button>
                <button class="btn-close" onclick="this.closest('.medicine-notification-banner').remove();">
                    ✕
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (banner.parentElement) {
                banner.remove();
            }
        }, 30000);
    },

    // Show medicines list modal
    async showMedicinesList() {
        await this.loadMedicines();

        const modal = document.getElementById('medicineReminderModal');
        const list = document.getElementById('medicinesList');

        list.innerHTML = '';

        if (this.medicines.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💊</div>
                    <p>No medicines added yet</p>
                    <small>Add your medications to get reminders</small>
                </div>
            `;
        } else {
            this.medicines.forEach(medicine => {
                const card = this.createMedicineCard(medicine);
                list.appendChild(card);
            });
        }

        // Update today's pending count
        this.updatePendingCount();

        modal.classList.add('active');
    },

    // Create medicine card
    createMedicineCard(medicine) {
        const div = document.createElement('div');
        div.className = 'medicine-card';

        const today = new Date().toISOString().split('T')[0];
        const todayDoses = medicine.times.length;
        const takenToday = medicine.history?.filter(h => h.date === today).length || 0;

        const frequencyText = medicine.frequency === 'daily'
            ? 'Daily'
            : medicine.frequency === 'weekly'
                ? `Weekly (${medicine.days.join(', ')})`
                : 'As needed';

        div.innerHTML = `
            <div class="medicine-header">
                <div class="medicine-info">
                    <div class="medicine-name">${medicine.name}</div>
                    <div class="medicine-dosage">${medicine.dosage}</div>
                </div>
                <div class="medicine-status">
                    <div class="doses-today">${takenToday}/${todayDoses} today</div>
                </div>
            </div>
            <div class="medicine-schedule">
                <div class="schedule-label">Times:</div>
                <div class="schedule-times">
                    ${medicine.times.map(time => {
            const taken = medicine.history?.some(h =>
                h.date === today && h.scheduledTime === time
            );
            return `
                            <span class="time-badge ${taken ? 'taken' : ''}">
                                ${time} ${taken ? '✓' : ''}
                            </span>
                        `;
        }).join('')}
                </div>
            </div>
            <div class="medicine-details">
                <div class="detail-item">📅 ${frequencyText}</div>
                ${medicine.notes ? `<div class="detail-item">📝 ${medicine.notes}</div>` : ''}
            </div>
            <div class="medicine-actions">
                <button class="btn-mark-taken" onclick="MedicineReminder.markDoseTaken(${medicine.id}, '${medicine.times[0]}')">
                    ✅ Mark Taken
                </button>
                <button class="btn-edit" onclick="MedicineReminder.editMedicine(${medicine.id})">
                    ✏️ Edit
                </button>
                <button class="btn-delete" onclick="MedicineReminder.confirmDelete(${medicine.id})">
                    🗑️ Delete
                </button>
            </div>
        `;

        return div;
    },

    // Update pending count on home screen
    updatePendingCount() {
        const today = new Date().toISOString().split('T')[0];
        let totalPending = 0;

        this.medicines.forEach(medicine => {
            const todayDoses = medicine.times.length;
            const takenToday = medicine.history?.filter(h => h.date === today).length || 0;
            totalPending += (todayDoses - takenToday);
        });

        // Update home screen badge if exists
        const badge = document.getElementById('medicinePendingBadge');
        if (badge && totalPending > 0) {
            badge.textContent = totalPending;
            badge.style.display = 'block';
        } else if (badge) {
            badge.style.display = 'none';
        }
    },

    // Edit medicine
    editMedicine(id) {
        const medicine = this.medicines.find(m => m.id === id);
        if (medicine) {
            // Populate form with medicine data
            document.getElementById('editMedicineId').value = id;
            document.getElementById('medicineName').value = medicine.name;
            document.getElementById('medicineDosage').value = medicine.dosage;
            document.getElementById('medicineFrequency').value = medicine.frequency;
            document.getElementById('medicineNotes').value = medicine.notes || '';

            // Populate times
            const timesContainer = document.getElementById('medicineTimesContainer');
            timesContainer.innerHTML = '';
            medicine.times.forEach(time => {
                this.addTimeSlot(time);
            });

            // Show add form
            document.getElementById('medicineFormSection').style.display = 'block';
            document.getElementById('medicinesList').style.display = 'none';
        }
    },

    // Confirm delete
    confirmDelete(id) {
        const medicine = this.medicines.find(m => m.id === id);
        if (medicine && confirm(`Delete "${medicine.name}"?`)) {
            this.deleteMedicine(id);
        }
    },

    // Add time slot input
    addTimeSlot(value = '') {
        const container = document.getElementById('medicineTimesContainer');
        const div = document.createElement('div');
        div.className = 'time-slot';
        div.innerHTML = `
            <input type="time" class="medicine-time-input" value="${value}" required>
            <button type="button" class="btn-remove-time" onclick="this.parentElement.remove()">✕</button>
        `;
        container.appendChild(div);
    },

    // Show toast message
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'medicine-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Global functions
function showMedicineReminder() {
    MedicineReminder.showMedicinesList();
}

function closeMedicineReminder() {
    document.getElementById('medicineReminderModal').classList.remove('active');
}

function showAddMedicineForm() {
    // Reset form
    document.getElementById('medicineForm').reset();
    document.getElementById('editMedicineId').value = '';
    document.getElementById('medicineTimesContainer').innerHTML = '';
    MedicineReminder.addTimeSlot();

    document.getElementById('medicineFormSection').style.display = 'block';
    document.getElementById('medicinesList').style.display = 'none';
}

function cancelMedicineForm() {
    document.getElementById('medicineFormSection').style.display = 'none';
    document.getElementById('medicinesList').style.display = 'block';
}

function saveMedicine(event) {
    event.preventDefault();

    const form = event.target;
    const editId = document.getElementById('editMedicineId').value;

    const times = Array.from(document.querySelectorAll('.medicine-time-input'))
        .map(input => input.value)
        .filter(time => time);

    const medicineData = {
        name: form.medicineName.value,
        dosage: form.medicineDosage.value,
        frequency: form.medicineFrequency.value,
        times: times,
        notes: form.medicineNotes.value
    };

    if (editId) {
        MedicineReminder.updateMedicine(parseInt(editId), medicineData);
    } else {
        MedicineReminder.addMedicine(medicineData);
    }

    cancelMedicineForm();
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MedicineReminder.init());
} else {
    MedicineReminder.init();
}
