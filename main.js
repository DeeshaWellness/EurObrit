// script.js
document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = "https://www.7timer.info/bin/api.pl";
    const coords = { lat: 37.9838, lon: 23.7275 }; // Example for Athens, Greece

    fetch(`${baseUrl}?lon=${coords.lon}&lat=${coords.lat}&product=civillight&output=json`)
        .then(response => response.json())
        .then(data => {
            const weatherContainer = document.getElementById('weather-container');
            data.dataseries.forEach(day => {
                const weatherCard = document.createElement('div');
                weatherCard.className = 'weather-card';
                weatherCard.innerHTML = `<h2>${new Date(day.date).toDateString()}</h2>
                                         <p>${day.weather}</p>
                                         <p>High: ${day.temp2m.max}°C</p>
                                         <p>Low: ${day.temp2m.min}°C</p>`;
                weatherContainer.appendChild(weatherCard);
            });
        })
        .catch(error => console.error('Error fetching weather data:', error));
});
