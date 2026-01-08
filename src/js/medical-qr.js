// Medical ID QR Code Generator
// Generates scannable QR codes from health card data

const MedicalQR = {
    qrContainer: null,
    currentQRCode: null,

    // Show QR code modal
    showQRModal() {
        // Get active health card from HealthCardManager
        const cardData = HealthCardManager.getActiveCard();

        if (!cardData || !cardData.name) {
            alert('Please save a Health Card first before generating a QR code.');
            return;
        }

        // Create medical ID object with essentials
        const medicalID = {
            type: 'MEDICAL_ID',
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: {
                name: cardData.name || 'Not specified',
                bloodGroup: cardData.bloodGroup || 'Not specified',
                allergies: cardData.allergies || 'None',
                medications: cardData.medications || 'None',
                conditions: cardData.conditions || 'None',
                emergencyContact: cardData.emergencyContact || 'Not specified',
                doctorContact: cardData.doctorContact || 'Not specified'
            }
        };

        // Convert to JSON string
        const qrData = JSON.stringify(medicalID);

        // Show modal
        document.getElementById('qrCodeModal').classList.add('active');

        // Generate QR Code
        this.generateQR(qrData);

        // Update display info
        document.getElementById('qrPatientName').textContent = cardData.name || 'Not specified';
        document.getElementById('qrBloodGroup').textContent = cardData.bloodGroup || 'Not specified';
    },

    // Generate QR Code
    generateQR(data) {
        const container = document.getElementById('qrCodeContainer');

        //Clear previous QR code
        container.innerHTML = '';

        // Generate new QR code
        try {
            new QRCode(container, {
                text: data,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H // High error correction
            });
        } catch (error) {
            console.error('QR generation error:', error);
            container.innerHTML = '<p style="color: red;">Error generating QR code. Please try again.</p>';
        }
    },

    // Close modal
    closeQRModal() {
        document.getElementById('qrCodeModal').classList.remove('active');
    },

    // Print QR Code
    printQR() {
        const printWindow = window.open('', '', 'width=600,height=600');
        const healthCard = HealthCardManager.getActiveCard() || {};

        printWindow.document.write(`
            <html>
            <head>
                <title>Medical ID QR Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        text-align: center;
                    }
                    h1 { color: #DC2626; margin-bottom: 10px; }
                    .info { margin: 20px 0; }
                    .qr-container { margin: 20px auto; }
                    .instructions {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #666;
                        text-align: left;
                        max-width: 400px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                </style>
            </head>
            <body>
                <h1>🚨 MEDICAL ID</h1>
                <div class="info">
                    <strong>Name:</strong> ${healthCard.name || 'Not specified'}<br>
                    <strong>Blood Group:</strong> ${healthCard.bloodGroup || 'Not specified'}
                </div>
                <div class="qr-container">
                    ${document.getElementById('qrCodeContainer').innerHTML}
                </div>
                <div class="instructions">
                    <strong>Emergency Instructions:</strong><br>
                    Scan this QR code to access emergency medical information including blood group, allergies, medications, and emergency contacts.
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    },

    // Download QR as combined image with details
    downloadQR() {
        const qrCanvas = document.querySelector('#qrCodeContainer canvas');
        if (!qrCanvas) {
            alert('No QR code to download');
            return;
        }

        const card = HealthCardManager.getActiveCard() || {};

        // Create a new canvas with QR + text details
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');

        // Set canvas size (QR + text area)
        finalCanvas.width = 600;
        finalCanvas.height = 800;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Header
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚨 MEDICAL ID', 300, 50);

        // Draw QR code (centered)
        ctx.drawImage(qrCanvas, 172, 80, 256, 256);

        // Patient details
        let y = 370;
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(card.name || 'Not specified', 300, y);

        y += 40;
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';

        const details = [
            `Blood Group: ${card.bloodGroup || 'Not specified'}`,
            `Allergies: ${card.allergies || 'None'}`,
            `Conditions: ${card.conditions || 'None'}`,
            `Medications: ${card.medications || 'None'}`,
            `Emergency Contact: ${card.emergencyContact || 'Not specified'}`,
            `Doctor: ${card.doctorContact || 'Not specified'}`
        ];

        details.forEach(detail => {
            // Wrap long text
            const maxWidth = 540;
            const words = detail.split(' ');
            let line = '';

            words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && line !== '') {
                    ctx.fillText(line, 30, y);
                    line = word + ' ';
                    y += 25;
                } else {
                    line = testLine;
                }
            });
            ctx.fillText(line, 30, y);
            y += 30;
        });

        // Footer
        y += 20;
        ctx.font = 'italic 14px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.fillText('Scan QR code for quick access to medical information', 300, y);
        ctx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 300, y + 20);

        // Download
        const link = document.createElement('a');
        link.download = `medical-id-${card.name || 'emergency'}.png`;
        link.href = finalCanvas.toDataURL();
        link.click();
    }
};

// Global functions for HTML onclick
function showMedicalQR() {
    MedicalQR.showQRModal();
}

function closeMedicalQR() {
    MedicalQR.closeQRModal();
}

function printMedicalQR() {
    MedicalQR.printQR();
}

function downloadMedicalQR() {
    MedicalQR.downloadQR();
}
