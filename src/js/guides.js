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
        title: "⛑️ CPR (Cardiopulmonary Resuscitation)",
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
    },
    stroke: {
        title: "🧠 Stroke (FAST Method)",
        summary: "A stroke is a medical emergency. Act FAST - every minute counts!",
        steps: [
            "Remember FAST: Face, Arms, Speech, Time",
            "Face: Ask person to smile - does one side droop?",
            "Arms: Ask to raise both arms - does one drift down?",
            "Speech: Ask to repeat a phrase - is speech slurred?",
            "Time: If YES to any, call 108/112 immediately",
            "Note the time symptoms started",
            "Keep person calm and comfortable",
            "Do NOT give food, water, or medication"
        ],
        warnings: [
            "DO NOT wait to see if symptoms improve",
            "DO NOT drive to hospital yourself - call ambulance",
            "Time is critical - brain cells die every minute"
        ]
    },
    seizure: {
        title: "⚡ Seizure",
        summary: "Stay calm and protect the person from injury during a seizure.",
        steps: [
            "Stay calm and time the seizure",
            "Clear area of hard or sharp objects",
            "Cushion head with something soft",
            "Turn person on their side",
            "Loosen tight clothing around neck",
            "Stay with them until fully conscious",
            "Call 108/112 if seizure lasts over 5 minutes"
        ],
        warnings: [
            "DO NOT hold person down or restrain",
            "DO NOT put anything in their mouth",
            "DO NOT give water or food until fully alert"
        ]
    },
    drowning: {
        title: "🌊 Drowning",
        summary: "Act quickly but safely when someone is drowning.",
        steps: [
            "Call 108/112 immediately",
            "Reach or throw - don't go in water unless trained",
            "If rescued, check breathing",
            "If not breathing, start CPR immediately",
            "Continue CPR until help arrives",
            "Keep person warm with blanket",
            "Monitor breathing even if conscious"
        ],
        warnings: [
            "DO NOT enter water unless you're a trained swimmer",
            "DO NOT assume person is fine if they cough up water",
            "Secondary drowning can occur hours later"
        ]
    },
    poisoning: {
        title: "☠️ Poisoning",
        summary: "Quick action is essential in poisoning cases.",
        steps: [
            "Call 108/112 or Poison Control immediately",
            "Identify the poison if possible",
            "If conscious, keep person calm",
            "If unconscious, turn on side",
            "Save poison container/label",
            "Do NOT induce vomiting unless told to",
            "Follow emergency operator's instructions"
        ],
        warnings: [
            "DO NOT give anything by mouth unless instructed",
            "DO NOT induce vomiting for corrosive poisons",
            "DO NOT wait for symptoms to appear"
        ]
    },
    fracture: {
        title: "🦴 Fractures",
        summary: "Immobilize the injured area and seek medical help.",
        steps: [
            "Call 108/112 for severe fractures",
            "Do NOT move the person unless necessary",
            "Immobilize the injured area",
            "Apply ice pack (wrapped in cloth)",
            "Treat for shock - keep warm",
            "Do NOT try to realign the bone",
            "Support the limb in position found"
        ],
        warnings: [
            "DO NOT move if spine or neck injury suspected",
            "DO NOT apply ice directly to skin",
            "DO NOT give food or water in case surgery needed"
        ]
    },
    electricShock: {
        title: "⚡ Electric Shock",
        summary: "Safety first! Do not touch the person until power is off.",
        steps: [
            "Turn off power source immediately",
            "If can't turn off, use dry non-conductive object to separate",
            "Call 108/112",
            "Check breathing and pulse",
            "Start CPR if needed",
            "Treat burns with cool water",
            "Cover burns with sterile bandage"
        ],
        warnings: [
            "DO NOT touch person while still in contact with electricity",
            "DO NOT use wet objects or stand in water",
            "Even low voltage can be dangerous"
        ]
    },
    heatStroke: {
        title: "🌡️ Heat Stroke",
        summary: "Heat stroke is life-threatening. Cool the person immediately.",
        steps: [
            "Call 108/112 immediately",
            "Move to cool, shaded area",
            "Remove excess clothing",
            "Cool with wet cloths or spray water",
            "Fan the person",
            "Apply ice packs to neck, armpits, groin",
            "Give water if conscious"
        ],
        warnings: [
            "DO NOT give aspirin or acetaminophen",
            "DO NOT give fluids if unconscious",
            "DO NOT apply rubbing alcohol"
        ]
    },
    hypothermia: {
        title: "❄️ Hypothermia",
        summary: "Warm the person gradually and gently.",
        steps: [
            "Call 108/112",
            "Move to warm, dry location",
            "Remove wet clothing",
            "Warm with blankets, dry clothes",
            "Give warm (not hot) drinks if conscious",
            "Warm center of body first (chest, neck, head)",
            "Stay with person until help arrives"
        ],
        warnings: [
            "DO NOT use direct heat (hot water, heating pad)",
            "DO NOT give alcohol",
            "DO NOT massage or rub the person"
        ]
    },
    allergicReaction: {
        title: "🤧 Severe Allergic Reaction",
        summary: "Anaphylaxis is life-threatening. Act immediately!",
        steps: [
            "Call 108/112 immediately",
            "Use epinephrine auto-injector if available",
            "Help person lie down",
            "Elevate legs if possible",
            "Loosen tight clothing",
            "Do NOT give anything by mouth",
            "Be prepared to do CPR"
        ],
        warnings: [
            "DO NOT wait to see if symptoms improve",
            "DO NOT assume one dose of epinephrine is enough",
            "Symptoms can return - monitor closely"
        ]
    },
    asthmaAttack: {
        title: "🫁 Asthma Attack",
        summary: "Help the person use their inhaler and stay calm.",
        steps: [
            "Help person sit upright",
            "Help them use their inhaler",
            "Loosen tight clothing",
            "Keep calm and reassure them",
            "If no improvement in 5-10 minutes, call 108/112",
            "Continue using inhaler every few minutes",
            "Stay with them until breathing improves"
        ],
        warnings: [
            "DO NOT lay person down",
            "DO NOT leave them alone",
            "Call 108/112 if lips turn blue or can't speak"
        ]
    },
    diabeticEmergency: {
        title: "🍬 Diabetic Emergency",
        summary: "Low blood sugar needs immediate sugar. High sugar needs medical help.",
        steps: [
            "If conscious and low sugar: give sugary drink/candy",
            "If unconscious: call 108/112 immediately",
            "Position on side if unconscious",
            "Do NOT give insulin unless you're trained",
            "Monitor breathing",
            "Stay with person",
            "If no improvement in 10 minutes, call 108/112"
        ],
        warnings: [
            "DO NOT give food/drink if unconscious",
            "DO NOT give insulin without medical training",
            "Both high and low sugar can be dangerous"
        ]
    },
    concussion: {
        title: "🤕 Concussion",
        summary: "Head injuries need careful monitoring.",
        steps: [
            "Call 108/112 if person lost consciousness",
            "Apply ice pack to injured area",
            "Keep person awake for first few hours",
            "Monitor for worsening symptoms",
            "Rest in quiet, dark room",
            "No sports or physical activity",
            "Seek medical evaluation"
        ],
        warnings: [
            "DO NOT give aspirin (may increase bleeding)",
            "DO NOT let person drive",
            "Watch for vomiting, confusion, severe headache"
        ]
    },
    nosebleed: {
        title: "🩸 Nosebleed",
        summary: "Most nosebleeds can be stopped with proper technique.",
        steps: [
            "Sit upright and lean slightly forward",
            "Pinch soft part of nose firmly",
            "Hold for 10-15 minutes without releasing",
            "Breathe through mouth",
            "Apply ice pack to nose bridge",
            "Do NOT tilt head back",
            "If bleeding continues after 20 minutes, seek medical help"
        ],
        warnings: [
            "DO NOT tilt head back (blood may go down throat)",
            "DO NOT pack nose with tissue",
            "DO NOT blow nose for several hours after"
        ]
    },
    eyeInjury: {
        title: "👁️ Eye Injury",
        summary: "Protect the eye and seek immediate medical help.",
        steps: [
            "Do NOT rub the eye",
            "For chemicals: flush with water for 15 minutes",
            "For objects: do NOT try to remove",
            "Cover eye with clean cloth",
            "Call 108/112 or go to emergency",
            "Keep person calm",
            "Cover both eyes to reduce movement"
        ],
        warnings: [
            "DO NOT apply pressure to eyeball",
            "DO NOT try to remove embedded objects",
            "DO NOT use eye drops unless instructed"
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
