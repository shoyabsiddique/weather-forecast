// document.addEventListener("DOMContentLoaded", function () {
//     const burgerMenu = document.getElementById("burger-menu");
//     const navContainer = document.getElementById("nav-container");

//     burgerMenu.addEventListener("click", function () {
//         // Toggle the "active" class to show/hide the navigation menu
//         navContainer.classList.toggle("active");
//     });
// });
function toggleMenu() {
    const menuItems = document.getElementById("menu-items");
    menuItems.classList.toggle("active");
}
function fetchWeatherData(location) {
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=YS5JY9PCBGA8DBQL48B2TAY3E`;
    console.log(apiUrl);
    fetch(apiUrl)
        .then(response => {
            console.log(response.status);
            if (response.status != 200) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
var days;
function updateWeatherUI(data) {
    const currentWeather = data.current_weather;
    const hourlyData = data.hourly;
    this.days = data.days;
    document.getElementById("title").innerText = `Current Weather (${data.resolvedAddress})`;
    document.getElementById("temperature").innerText = `${((parseInt(days[0].temp) - 32) * 5 / 9).toFixed(2)} °C`;
    document.getElementById("condition").innerText = `${days[0].conditions}`;
    document.getElementById("sunrise").innerText = `${days[0].sunrise}`;
    document.getElementById("sunset").innerText = `${days[0].sunset}`;
    const timestamps = data.days[0].hours.map(item => moment(item.datetime, "HH:mm:ss").format());
    const temperatures = data.days[0].hours.map(item => ((parseInt(item.temp) - 32) * 5 / 9).toFixed(2));
    var canvas = document.getElementById('myCanvas');

    if (canvas) {
        canvas.parentNode.removeChild(canvas);
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'myCanvas';
    newCanvas.width = 400;
    newCanvas.height = 200;

    const container = document.getElementById('container');
    container.appendChild(newCanvas);
    canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: 'My Chart',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = '';

    days.forEach((dayData, index) => {
        const dayName = `Day ${index + 1}`;
        const { tempmax, tempmin, datetime, humidity, windgust, windspeed, pressure, solarradiation, solarenergy } = dayData;

        const forecastDayDiv = document.createElement('div');
        forecastDayDiv.classList.add('forecast-day');

        const dayNameDiv = document.createElement('div');
        dayNameDiv.classList.add('day');
        dayNameDiv.textContent = dayName;

        const iconDiv = document.createElement('div');
        iconDiv.classList.add('icon');
        iconDiv.innerHTML = `Date: ${datetime}`;
        const humidityDiv = document.createElement('div');
        humidityDiv.classList.add('humidity');
        humidityDiv.innerHTML = `Humidity: ${humidity} %`;
        const windgDiv = document.createElement('div');
        windgDiv.classList.add('windgust');
        windgDiv.innerHTML = `Windgust: ${windgust} km/hr`;
        const windsDiv = document.createElement('div');
        windsDiv.classList.add('windspeed');
        windsDiv.innerHTML = `Wind Speed: ${windspeed} km/hr`;
        const pressureDiv = document.createElement('div');
        pressureDiv.classList.add('pressure');
        pressureDiv.innerHTML = `Pressure: ${pressure} psi`;
        const solarrDiv = document.createElement('div');
        solarrDiv.classList.add('solarR');
        solarrDiv.innerHTML = `Solar Radiation: ${solarradiation} W/m<sup>2</sup>`;
        const solareDiv = document.createElement('div');
        solareDiv.classList.add('solarenergy');
        solareDiv.innerHTML = `Solar Energy: ${solarenergy} J/m<sup>2</sup>`;

        const temperatureDiv = document.createElement('div');
        temperatureDiv.classList.add('temperature');
        temperatureDiv.innerHTML = `High: ${((parseInt(days[0].tempmax) - 32) * 5 / 9).toFixed(2)} °C | Low: ${((parseInt(days[0].tempmin) - 32) * 5 / 9).toFixed(2)} °C`;

        forecastDayDiv.appendChild(dayNameDiv);
        forecastDayDiv.appendChild(iconDiv);
        forecastDayDiv.appendChild(temperatureDiv);
        forecastDayDiv.appendChild(humidityDiv);
        forecastDayDiv.appendChild(windgDiv);
        forecastDayDiv.appendChild(windsDiv);
        forecastDayDiv.appendChild(pressureDiv);
        forecastDayDiv.appendChild(solarrDiv);
        forecastDayDiv.appendChild(solareDiv);

        forecastContainer.appendChild(forecastDayDiv);
    });
    createCarousel(".forecast", "#prevBtn", "#nextBtn");
}

function handleSearch() {
    const locationInput = document.getElementById("location-input");
    const location = locationInput.value;
    fetchWeatherData(location);
}

function createCarousel(containerSelector, prevButtonSelector, nextButtonSelector) {
    const container = document.querySelector(containerSelector);
    const prevButton = document.querySelector(prevButtonSelector);
    const nextButton = document.querySelector(nextButtonSelector);
    const items = Array.from(container.children);
    let currentIndex = 0;

    function showItem(index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.style.display = "block";
                document.getElementById("desc").innerText = `${days[i].description}`;
            } else {
                item.style.display = "none";
            }
        });
    }

    prevButton.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    });

    nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    });

    showItem(currentIndex);
}