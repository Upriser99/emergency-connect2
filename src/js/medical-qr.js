// Medical ID QR Code Generator
// Generates scannable QR codes from health card data

const MedicalQR = {
    qrContainer: null,
    currentQRCode: null,

    // Show QR code modal
    showQRModal() {
        const healthCard = localStorage.getItem('healthCard');

        if (!healthCard) {
            alert('Please fill out your Health Card first before generating a QR code.');
            return;
        }

        // Parse health card data
        const cardData = JSON.parse(healthCard);

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
                emergencyPhone: cardData.emergencyPhone || 'Not specified'
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
        const healthCard = JSON.parse(localStorage.getItem('healthCard') || '{}');

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

    // Download QR as image
    downloadQR() {
        const canvas = document.querySelector('#qrCodeContainer canvas');
        if (!canvas) {
            alert('No QR code to download');
            return;
        }

        const healthCard = JSON.parse(localStorage.getItem('healthCard') || '{}');
        const link = document.createElement('a');
        link.download = `medical-id-qr-${healthCard.name || 'emergency'}.png`;
        link.href = canvas.toDataURL();
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
