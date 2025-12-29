// Emergency Guides and Health Card - Phase 5

// Guide Content Data
const GUIDE_DATA = {
    heartAttack: {
        title: "❤️ Heart Attack",
        summary: "A heart attack occurs when blood flow to the heart is blocked. Quick action can save lives!",
        steps: [
            "Call 108 or 112 immediately",
            "Help the person sit down and rest",
            "Loosen any tight clothing",
            "If they have heart medication (like nitroglycerin), help them take it",
            "If they become unconscious and stop breathing, start CPR",
            "Stay with them until help arrives"
        ],
        warnings: [
            "DO NOT leave the person alone",
            "DO NOT let them deny symptoms",
            "DO NOT wait to see if symptoms go away"
        ]
    },
    cpr: {
        title: "🫁 CPR (Cardiopulmonary Resuscitation)",
        summary: "CPR can save a life when someone's heart stops beating. Follow these steps carefully.",
        steps: [
            "Check if the person is responsive - tap and shout",
            "Call 108/112 or ask someone else to call",
            "Place person on firm, flat surface",
            "Place heel of hand on center of chest",
            "Push hard and fast - 100-120 compressions per minute",
            "Push down at least 2 inches deep",
            "Continue until help arrives or person starts breathing"
        ],
        warnings: [
            "DO NOT stop compressions unless person starts breathing",
            "DO NOT be afraid to push hard",
            "If trained, give 2 rescue breaths after every 30 compressions"
        ]
    },
    bleeding: {
        title: "🩸 Severe Bleeding",
        summary: "Severe bleeding can be life-threatening. Act quickly to stop blood loss.",
        steps: [
            "Call 108/112 if bleeding is severe",
            "Wash your hands if possible",
            "Apply direct pressure with clean cloth",
            "Maintain pressure for 10-15 minutes",
            "If blood soaks through, add more cloth on top",
            "Elevate the injured area above heart level",
            "Once bleeding stops, bandage firmly"
        ],
        warnings: [
            "DO NOT remove cloth if blood soaks through",
            "DO NOT peek to see if bleeding has stopped",
            "DO NOT use tourniquet unless absolutely necessary"
        ]
    },
    burns: {
        title: "🔥 Burns",
        summary: "Burns can be serious. Cool the burn and protect the area from infection.",
        steps: [
            "Remove person from heat source",
            "Cool the burn with cool (not ice cold) water for 10-20 minutes",
            "Remove jewelry and tight clothing before swelling",
            "Cover with clean, dry cloth",
            "DO NOT apply ice, butter, or ointments",
            "For severe burns, call 108/112",
            "Keep person warm with blanket"
        ],
        warnings: [
            "DO NOT use ice - it can cause more damage",
            "DO NOT break blisters",
            "DO NOT apply butter, oil, or ointments"
        ]
    },
    choking: {
        title: "😮 Choking",
        summary: "When someone can't breathe due to blocked airway, act immediately!",
        steps: [
            "Ask 'Are you choking?' - if they can't speak, act immediately",
            "Stand behind the person",
            "Make a fist and place it above their navel",
            "Grasp fist with other hand",
            "Give quick, upward thrusts",
            "Repeat until object comes out",
            "If person becomes unconscious, start CPR and call 108/112"
        ],
        warnings: [
            "DO NOT slap the back if person is coughing",
            "DO NOT give water",
            "If pregnant or obese, place fist higher on chest"
        ]
    },
    snakeBite: {
        title: "🐍 Snake Bite",
        summary: "Snake bites can be dangerous. Keep calm and get medical help immediately.",
        steps: [
            "Call 108/112 immediately",
            "Keep the person calm and still",
            "Remove jewelry and tight clothing",
            "Keep bitten area below heart level",
            "Wash bite with soap and water if possible",
            "Cover with clean, dry bandage",
            "Note the snake's appearance if safe to do so"
        ],
        warnings: [
            "DO NOT try to catch or kill the snake",
            "DO NOT apply ice or tourniquet",
            "DO NOT cut the wound or try to suck out venom",
            "DO NOT give any medication or alcohol"
        ]
    }
};

// Health Card Manager
const HealthCardManager = {
    data: {},

    init() {
        this.loadHealthCard();
        this.updatePreview();
    },

    loadHealthCard() {
        const saved = localStorage.getItem('healthCard');
        this.data = saved ? JSON.parse(saved) : {};
    },

    save(formData) {
        this.data = formData;
        localStorage.setItem('healthCard', JSON.stringify(formData));
        this.updatePreview();
    },

    updatePreview() {
        const preview = document.getElementById('healthCardPreview');
        if (!preview) return;

        if (Object.keys(this.data).length === 0 || !this.data.bloodGroup) {
            preview.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem;">Store your medical info for emergencies</p>';
            return;
        }

        preview.innerHTML = `
            <div class="health-info-display">
                ${this.data.bloodGroup ? `<div class="health-info-item"><span class="health-label">Blood Group:</span><span class="health-value">${this.data.bloodGroup}</span></div>` : ''}
                ${this.data.allergies ? `<div class="health-info-item"><span class="health-label">Allergies:</span><span class="health-value">${this.data.allergies}</span></div>` : ''}
                ${this.data.conditions ? `<div class="health-info-item"><span class="health-label">Conditions:</span><span class="health-value">${this.data.conditions}</span></div>` : ''}
                ${this.data.medications ? `<div class="health-info-item"><span class="health-label">Medications:</span><span class="health-value">${this.data.medications}</span></div>` : ''}
                ${this.data.emergencyContact ? `<div class="health-info-item"><span class="health-label">Emergency Contact:</span><span class="health-value">${this.data.emergencyContact}</span></div>` : ''}
                ${this.data.doctorContact ? `<div class="health-info-item"><span class="health-label">Doctor:</span><span class="health-value">${this.data.doctorContact}</span></div>` : ''}
            </div>
        `;
    }
};

// Global Functions
function showGuide(guideId) {
    const guide = GUIDE_DATA[guideId];
    if (!guide) return;

    const modal = document.getElementById('guideModal');
    const title = document.getElementById('guideTitle');
    const content = document.getElementById('guideContent');

    title.textContent = guide.title;

    let html = `<div class="guide-summary">${guide.summary}</div>`;

    html += '<div class="guide-steps">';
    guide.steps.forEach((step, index) => {
        html += `
            <div class="guide-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step}</div>
            </div>
        `;
    });
    html += '</div>';

    if (guide.warnings && guide.warnings.length > 0) {
        html += '<div class="guide-warnings"><h4>⚠️ Important Warnings:</h4><ul>';
        guide.warnings.forEach(warning => {
            html += `<li>${warning}</li>`;
        });
        html += '</ul></div>';
    }

    content.innerHTML = html;
    modal.classList.add('active');
}

function closeGuide() {
    const modal = document.getElementById('guideModal');
    modal.classList.remove('active');
}

function showHealthCard() {
    const modal = document.getElementById('healthCardModal');

    // Load existing data
    const data = HealthCardManager.data;
    document.getElementById('bloodGroup').value = data.bloodGroup || '';
    document.getElementById('allergies').value = data.allergies || '';
    document.getElementById('conditions').value = data.conditions || '';
    document.getElementById('medications').value = data.medications || '';
    document.getElementById('emergencyContact').value = data.emergencyContact || '';
    document.getElementById('doctorContact').value = data.doctorContact || '';

    modal.classList.add('active');
}

function closeHealthCard() {
    const modal = document.getElementById('healthCardModal');
    modal.classList.remove('active');
}

function saveHealthCard(event) {
    event.preventDefault();

    const formData = {
        bloodGroup: document.getElementById('bloodGroup').value,
        allergies: document.getElementById('allergies').value,
        conditions: document.getElementById('conditions').value,
        medications: document.getElementById('medications').value,
        emergencyContact: document.getElementById('emergencyContact').value,
        doctorContact: document.getElementById('doctorContact').value
    };

    HealthCardManager.save(formData);
    closeHealthCard();

    alert('Health Card saved successfully!');
}

function shareHealthCard() {
    const data = HealthCardManager.data;

    if (!data.bloodGroup) {
        alert('Please save your health card first!');
        return;
    }

    let message = '🏥 EMERGENCY HEALTH CARD\n\n';
    if (data.bloodGroup) message += `Blood Group: ${data.bloodGroup}\n`;
    if (data.allergies) message += `Allergies: ${data.allergies}\n`;
    if (data.conditions) message += `Conditions: ${data.conditions}\n`;
    if (data.medications) message += `Medications: ${data.medications}\n`;
    if (data.emergencyContact) message += `Emergency Contact: ${data.emergencyContact}\n`;
    if (data.doctorContact) message += `Doctor: ${data.doctorContact}\n`;

    // Try Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Emergency Health Card',
            text: message
        }).catch(() => {
            // Fallback to SMS
            window.location.href = `sms:?body=${encodeURIComponent(message)}`;
        });
    } else {
        // Fallback to SMS
        window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    HealthCardManager.init();
});
