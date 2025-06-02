// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
});

function initializeMap() {
    // Initialize Leaflet map
    map = L.map('cleanup-map').setView([1.3521, 103.8198], 11); // Default to Singapore coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Sample cleanup events - Replace with actual data from backend
    const sampleEvents = [
        { lat: 1.3099, lng: 103.9177, title: "East Coast Beach Cleanup" },
        { lat: 1.2494, lng: 103.8303, title: "Sentosa Beach Cleanup" }
    ];

    // Add markers for each cleanup event
    sampleEvents.forEach(event => {
        addCleanupMarker(event);
    });
}

function addCleanupMarker(event) {
    const marker = L.marker([event.lat, event.lng])
        .bindPopup(`
            <h3>${event.title}</h3>
            <button onclick="joinCleanup('${event.title}')">Join Event</button>
        `)
        .addTo(map);
    markers.push(marker);
}

function setupEventListeners() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            map.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Add smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function joinCleanup(eventTitle) {
    alert(`Thanks for joining ${eventTitle}! We'll contact you with more details.`);
    // Add actual registration logic here
}

// Weather widget functionality - To be implemented with actual weather API
async function fetchWeather() {
    try {
        // Replace with actual weather API call
        const response = await fetch('https://api.weatherapi.com/v1/forecast.json');
        const data = await response.json();
        updateWeatherWidget(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherWidget(data) {
    const weatherWidget = document.getElementById('weather-widget');
    // Update weather information once API is integrated
}
