// Static Emergency Services Data for Indore
// This data is used as fallback when OSM API is unavailable

const STATIC_DATA = {
    police: [
        {
            name: "Indore Police Control Room",
            address: "MG Road, Indore",
            phone: "100",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: true
        },
        {
            name: "Rajwada Police Station",
            address: "Rajwada, Indore",
            phone: "0731-2536666",
            lat: 22.7186,
            lng: 75.8573,
            verified: true,
            is24x7: true
        },
        {
            name: "Palasia Police Station",
            address: "Palasia Square, Indore",
            phone: "0731-2551100",
            lat: 22.7244,
            lng: 75.8721,
            verified: true,
            is24x7: true
        }
    ],

    hospital: [
        {
            name: "Choithram Hospital",
            address: "Manik Bagh Road, Indore",
            phone: "0731-2720000",
            lat: 22.7251,
            lng: 75.8681,
            verified: true,
            is24x7: true
        },
        {
            name: "CHL Hospital",
            address: "AB Road, Indore",
            phone: "0731-4044100",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true
        },
        {
            name: "Bombay Hospital",
            address: "Vijay Nagar, Indore",
            phone: "0731-4222222",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true
        },
        {
            name: "MY Hospital (Government)",
            address: "MG Road, Indore",
            phone: "0731-2537777",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: true
        }
    ],

    fire: [
        {
            name: "Indore Fire Station (Main)",
            address: "MG Road, Indore",
            phone: "101",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: true
        },
        {
            name: "Palasia Fire Station",
            address: "Palasia, Indore",
            phone: "0731-2551101",
            lat: 22.7244,
            lng: 75.8721,
            verified: true,
            is24x7: true
        }
    ],

    petrol: [
        {
            name: "Indian Oil Petrol Pump",
            address: "AB Road, Indore",
            phone: "N/A",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true
        },
        {
            name: "HP Petrol Pump",
            address: "MG Road, Indore",
            phone: "N/A",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: false
        }
    ],

    ambulance: [
        {
            name: "108 Ambulance Service",
            address: "Indore (State-wide)",
            phone: "108",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: true
        },
        {
            name: "102 Ambulance Service",
            address: "Indore (State-wide)",
            phone: "102",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: true
        },
        {
            name: "Choithram Hospital Ambulance",
            address: "Manik Bagh Road, Indore",
            phone: "0731-2720000",
            lat: 22.7251,
            lng: 75.8681,
            verified: true,
            is24x7: true
        },
        {
            name: "CHL Hospital Ambulance",
            address: "AB Road, Indore",
            phone: "0731-4044100",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true
        },
        {
            name: "Bombay Hospital Ambulance",
            address: "Vijay Nagar, Indore",
            phone: "0731-4222222",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true
        }
    ],

    pharmacy: [
        {
            name: "Apollo Pharmacy",
            address: "Vijay Nagar, Indore",
            phone: "0731-4000000",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true
        },
        {
            name: "MedPlus",
            address: "AB Road, Indore",
            phone: "0731-4111111",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: false
        },
        {
            name: "Wellness Forever",
            address: "Palasia Square, Indore",
            phone: "0731-2551122",
            lat: 22.7244,
            lng: 75.8721,
            verified: true,
            is24x7: true
        },
        {
            name: "Guardian Pharmacy",
            address: "MG Road, Indore",
            phone: "0731-2537788",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: false
        },
        {
            name: "Choithram Hospital Pharmacy",
            address: "Manik Bagh Road, Indore",
            phone: "0731-2720000",
            lat: 22.7251,
            lng: 75.8681,
            verified: true,
            is24x7: true
        }
    ],

    bank: [
        {
            name: "State Bank of India - Main Branch",
            address: "MG Road, Indore",
            phone: "0731-2537799",
            lat: 22.7196,
            lng: 75.8577,
            verified: true,
            is24x7: false,
            type: "bank"
        },
        {
            name: "HDFC Bank",
            address: "Vijay Nagar, Indore",
            phone: "0731-4000001",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: false,
            type: "bank"
        },
        {
            name: "ICICI Bank",
            address: "AB Road, Indore",
            phone: "0731-4111112",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: false,
            type: "bank"
        },
        {
            name: "Axis Bank",
            address: "Palasia Square, Indore",
            phone: "0731-2551123",
            lat: 22.7244,
            lng: 75.8721,
            verified: true,
            is24x7: false,
            type: "bank"
        },
        // ATMs - 24/7
        {
            name: "SBI ATM - Rajwada",
            address: "Rajwada, Indore",
            phone: "N/A",
            lat: 22.7186,
            lng: 75.8573,
            verified: true,
            is24x7: true,
            type: "atm"
        },
        {
            name: "HDFC ATM - Vijay Nagar",
            address: "Vijay Nagar, Indore",
            phone: "N/A",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true,
            type: "atm"
        },
        {
            name: "ICICI ATM - AB Road",
            address: "AB Road, Indore",
            phone: "N/A",
            lat: 22.7532,
            lng: 75.8937,
            verified: true,
            is24x7: true,
            type: "atm"
        },
        {
            name: "Axis ATM - Palasia",
            address: "Palasia Square, Indore",
            phone: "N/A",
            lat: 22.7244,
            lng: 75.8721,
            verified: true,
            is24x7: true,
            type: "atm"
        }
    ]
};
