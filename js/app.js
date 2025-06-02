// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    setupEventListeners();
    fetchWeather(); // Initial weather fetch
    // Update weather every 30 minutes
    setInterval(fetchWeather, 1800000);
});

function initializeMap() {
    // Initialize Leaflet map
    map = L.map('cleanup-map').setView([1.381497, 103.955574], 16); // Pasir Ris coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for Pasir Ris cleanup location
    const nextCleanup = {
        lat: 1.381497,
        lng: 103.955574,
        title: "Next Cleanup: Pasir Ris Beach",
        date: "June 2, 2025"
    };

    // Create a custom icon for the cleanup marker
    const cleanupIcon = L.divIcon({
        className: 'cleanup-marker',
        html: '🧹',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });

    // Add marker with custom icon
    L.marker([nextCleanup.lat, nextCleanup.lng], { icon: cleanupIcon })
        .bindPopup(`
            <h3>${nextCleanup.title}</h3>
            <p>Date: ${nextCleanup.date}</p>
            <button onclick="joinCleanup('${nextCleanup.title}')">Join Event</button>
        `)
        .addTo(map);
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

// Weather widget functionality using NEA data
async function fetchWeather() {
    try {
        // Fetch both 24-hour and 4-day forecasts
        const [forecast24hrResponse, forecast4DayResponse] = await Promise.all([
            fetch('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast'),
            fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast')
        ]);

        const forecast24hr = await forecast24hrResponse.json();
        const forecast4Day = await forecast4DayResponse.json();

        updateWeatherWidget(forecast24hr, forecast4Day);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        const weatherWidget = document.getElementById('weather-widget');
        if (weatherWidget) {
            weatherWidget.innerHTML = '<div class="weather-error">Unable to load weather data. Please try again later.</div>';
        }
    }
}

function updateWeatherWidget(forecast24hr, forecast4Day) {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    const current24hr = forecast24hr.items[0];
    const forecast = forecast4Day.items[0].forecasts;
    
    // Get the general forecast
    const generalForecast = current24hr.general.forecast;
    const temperature = current24hr.general.temperature;
    const humidity = current24hr.general.relative_humidity;
    const wind = current24hr.general.wind;

    // Create weather icon based on forecast
    const weatherIcon = getWeatherIcon(generalForecast);

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    weatherWidget.innerHTML = `
        <div class="weather-content">
            <h3>Weather Forecast</h3>
            <div class="current-weather">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-details">
                    <p class="forecast-main">${generalForecast}</p>
                    <p>🌡️ Temperature: ${temperature.low}°C - ${temperature.high}°C</p>
                    <p>💧 Humidity: ${humidity.low}% - ${humidity.high}%</p>
                    <p>💨 Wind: ${wind.speed.low} - ${wind.speed.high} km/h ${wind.direction}</p>
                </div>
            </div>
            <div class="forecast-grid">
                ${forecast.map(day => `
                    <div class="forecast-day">
                        <h4>${formatDate(day.date)}</h4>
                        <div class="forecast-icon">${getWeatherIcon(day.forecast)}</div>
                        <p class="forecast-temp">${day.temperature.low}°C - ${day.temperature.high}°C</p>
                        <p class="forecast-desc">${day.forecast}</p>
                    </div>
                `).join('')}
            </div>
            <p class="weather-update">Last updated: ${new Date(forecast24hr.items[0].timestamp).toLocaleString('en-SG')}</p>
        </div>
    `;
}

function getWeatherIcon(forecast) {
    const lowercaseForecast = forecast.toLowerCase();
    if (lowercaseForecast.includes('thundery')) return '⛈️';
    if (lowercaseForecast.includes('rain')) return '🌧️';
    if (lowercaseForecast.includes('showers')) return '🌦️';
    if (lowercaseForecast.includes('cloudy')) return '☁️';
    if (lowercaseForecast.includes('overcast')) return '🌥️';
    if (lowercaseForecast.includes('sunny')) return '☀️';
    if (lowercaseForecast.includes('fair')) return '🌤️';
    return '🌈';
}
