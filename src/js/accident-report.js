// Accident Report Tool
// Create, save, and share accident/incident reports

const AccidentReport = {
    currentReport: null,
    photos: [],

    // Show accident report form
    showForm() {
        const modal = document.getElementById('accidentReportModal');
        if (modal) {
            modal.classList.add('active');
            this.initForm();
        }
    },

    // Initialize form with current data
    initForm() {
        // Auto-fill date/time
        const now = new Date();
        document.getElementById('reportDate').value = now.toISOString().split('T')[0];
        document.getElementById('reportTime').value = now.toTimeString().split(' ')[0].substring(0, 5);

        // Get current location
        this.getCurrentLocation();

        // Reset photos
        this.photos = [];
        this.updatePhotoPreview();
    },

    // Get current GPS location
    getCurrentLocation() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lon = position.coords.longitude.toFixed(6);
                document.getElementById('reportLocation').value = `${lat}, ${lon}`;
            },
            (error) => {
                console.error('Location error:', error);
            }
        );
    },

    // Handle photo upload
    async handlePhotoUpload(event) {
        const files = Array.from(event.target.files);

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                // Compress and convert to base64
                const compressed = await this.compressImage(file);
                this.photos.push({
                    data: compressed,
                    name: file.name,
                    timestamp: new Date().toISOString()
                });
            }
        }

        this.updatePhotoPreview();
    },

    // Compress image
    compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Max dimensions
                    const maxWidth = 800;
                    const maxHeight = 800;

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    // Update photo preview
    updatePhotoPreview() {
        const preview = document.getElementById('photoPreview');
        if (!preview) return;

        preview.innerHTML = this.photos.map((photo, index) => `
            <div class="photo-thumb" style="position: relative; display: inline-block; margin: 0.5rem;">
                <img src="${photo.data}" alt="Photo ${index + 1}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                <button onclick="AccidentReport.removePhoto(${index})" style="position: absolute; top: -8px; right: -8px; background: var(--color-fire); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">×</button>
            </div>
        `).join('');
    },

    // Remove photo
    removePhoto(index) {
        this.photos.splice(index, 1);
        this.updatePhotoPreview();
    },

    // Save report
    saveReport(event) {
        event.preventDefault();

        const report = {
            id: Date.now(),
            date: document.getElementById('reportDate').value,
            time: document.getElementById('reportTime').value,
            location: document.getElementById('reportLocation').value,
            type: document.getElementById('incidentType').value,
            description: document.getElementById('reportDescription').value,
            injuries: document.getElementById('reportInjuries').value,
            witnesses: document.getElementById('reportWitnesses').value,
            vehicleDetails: document.getElementById('vehicleDetails').value,
            photos: this.photos,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        const reports = JSON.parse(localStorage.getItem('accidentReports') || '[]');
        reports.push(report);
        localStorage.setItem('accidentReports', JSON.stringify(reports));

        alert('✅ Report saved successfully!');
        this.closeForm();

        // Ask if user wants to share
        if (confirm('Do you want to share this report?')) {
            this.shareReport(report);
        }
    },

    // Share report
    shareReport(report) {
        const text = this.generateReportText(report);

        if (navigator.share) {
            navigator.share({
                title: 'Accident Report',
                text: text
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Report copied to clipboard!');
            });
        }
    },

    // Generate report text
    generateReportText(report) {
        let text = `📋 ACCIDENT REPORT\n\n`;
        text += `Date: ${report.date}\n`;
        text += `Time: ${report.time}\n`;
        text += `Location: ${report.location}\n`;
        text += `Type: ${report.type}\n\n`;
        text += `Description:\n${report.description}\n\n`;

        if (report.injuries) {
            text += `Injuries: ${report.injuries}\n\n`;
        }

        if (report.witnesses) {
            text += `Witnesses: ${report.witnesses}\n\n`;
        }

        if (report.vehicleDetails) {
            text += `Vehicle Details: ${report.vehicleDetails}\n\n`;
        }

        text += `Photos: ${report.photos.length} attached\n`;
        text += `Report ID: ${report.id}\n`;
        text += `Generated: ${new Date(report.timestamp).toLocaleString()}`;

        return text;
    },

    // Close form
    closeForm() {
        const modal = document.getElementById('accidentReportModal');
        if (modal) {
            modal.classList.remove('active');
        }

        // Reset form
        document.getElementById('accidentReportForm').reset();
        this.photos = [];
        this.updatePhotoPreview();
    },

    // View saved reports
    viewReports() {
        const reports = JSON.parse(localStorage.getItem('accidentReports') || '[]');

        if (reports.length === 0) {
            alert('No saved reports');
            return;
        }

        // Show reports list (implement modal if needed)
        console.log('Saved reports:', reports);
        alert(`You have ${reports.length} saved report(s)`);
    }
};

// Global functions
function showAccidentReport() {
    AccidentReport.showForm();
}

function closeAccidentReport() {
    AccidentReport.closeForm();
}

function handlePhotoUpload(event) {
    AccidentReport.handlePhotoUpload(event);
}

function saveAccidentReport(event) {
    AccidentReport.saveReport(event);
}
