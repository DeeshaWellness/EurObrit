// script.js
document.addEventListener("DOMContentLoaded", function() {
    loadCities();
    document.getElementById('city-selector').addEventListener('change', function() {
        const city = this.options[this.selectedIndex].dataset;
        fetchWeather(city.lat, city.lon);
    });
});

function loadCities() {
    fetch('city_coordinates.csv')
        .then(response => response.text())
        .then(data => {
            const selector = document.getElementById('city-selector');
            data.split('\n').slice(1).forEach(line => {
                const [city, lat, lon] = line.split(',');
                if (city && lat && lon) {
                    const option = new Option(city, city);
                    option.dataset.lat = lat.trim();
                    option.dataset.lon = lon.trim();
                    selector.appendChild(option);
                }
            });
            selector.dispatchEvent(new Event('change'));
        });
}

function fetchWeather(lat, lon) {
    const baseUrl = "https://www.7timer.info/bin/api.pl";
    fetch(`${baseUrl}?lon=${lon}&lat=${lat}&product=civillight&output=json`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('weather-container');
            container.innerHTML = '';
            data.dataseries.forEach(day => {
                const date = new Date(day.date * 1000);
                const weatherCard = document.createElement('div');
                weatherCard.className = 'weather-card';
                weatherCard.innerHTML = `<h2>${date.toDateString()}</h2>
                                         <img src="${getWeatherImage(day.weather)}" alt="${day.weather}">
                                         <p>${day.weather}</p>
                                         <p>High: ${day.temp2m.max}°C</p>
                                         <p>Low: ${day.temp2m.min}°C</p>`;
                container.appendChild(weatherCard);
            });
        });
}

        .catch(error => console.error('Error fetching weather data:', error));
}

function getWeatherImage(weatherType) {
    switch(weatherType) {
        case 'clear':
            return 'images/clear.png';
        case 'cloudy':
            return 'images/cloudy.png';
        case 'fog':
            return 'images/fog.png';
        case 'humid':
            return 'images/humid.png';
        case 'ishower':
            return 'images/ishower.png';
        case 'lightrain':
            return 'images/lightrain.png';
        case 'lightsnow':
            return 'images/lightsnow.png';
        case 'mcloudy':
            return 'images/mcloudy.png';
        case 'oshower':
            return 'images/oshower.png';
        case 'pcloudy':
            return 'images/pcloudy.png';
        default:
            return 'images/default.png'; // Ensure you have a default image
    }
}
