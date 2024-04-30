document.addEventListener("DOMContentLoaded", function() {
    loadCities();

    document.getElementById('city-selector').addEventListener('change', function() {
        const selectedIndex = this.selectedIndex;
        const city = this.options[selectedIndex].dataset;
        fetchWeather(city.lat, city.lon);
    });
});

function loadCities() {
    fetch('city_coordinates.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const selector = document.getElementById('city-selector');
            lines.forEach((line, index) => {
                if (index > 0 && line) {
                    const [city, lat, lon] = line.split(',');
                    const option = new Option(city, city);
                    option.dataset.lat = lat;
                    option.dataset.lon = lon;
                    selector.appendChild(option);
                }
            });
            selector.dispatchEvent(new Event('change'));  // Automatically load weather for the first city
        })
        .catch(error => console.error('Error loading cities:', error));
}

function fetchWeather(lat, lon) {
    const baseUrl = "https://www.7timer.info/bin/api.pl";
    fetch(`${baseUrl}?lon=${lon}&lat=${lat}&product=civillight&output=json`)
        .then(response => response.json())
        .then(data => {
            const weatherContainer = document.getElementById('weather-container');
            weatherContainer.innerHTML = ''; // Clear previous entries
            data.dataseries.forEach(day => {
                const weatherCard = document.createElement('div');
                weatherCard.className = 'weather-card';
                const weatherCondition = getWeatherImage(day.weather);
                weatherCard.innerHTML = `<h2>${new Date(day.date * 1000).toDateString()}</h2>
                                         <img src="${weatherCondition}" alt="${day.weather}">
                                         <p>${day.weather}</p>
                                         <p>High: ${day.temp2m.max}°C</p>
                                         <p>Low: ${day.temp2m.min}°C</p>`;
                weatherContainer.appendChild(weatherCard);
            });
        })
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
