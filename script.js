const weatherData = {};
function toggleMenu() {
    const menuItems = document.getElementById("menu-items");
    menuItems.classList.toggle("active");
}
function fetchWeatherData(location) {
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=YS5JY9PCBGA8DBQL48B2TAY3E&unitGroup=uk`;

    fetch(apiUrl)
        .then(response => {
            if (response.status != 200) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherData(data);
            console.log(document.getElementById("charts").childNodes);
            // After fetching data, draw charts for all elements
            var nodes = document.getElementById("charts").childNodes;
            nodes.forEach(
                (value) => {
                    document.getElementById("charts").removeChild(value);
                }
            )
            document.getElementById("title").innerHTML = `<h2>${data.resolvedAddress}</h2>`;
            document.getElementById("charts").innerHTML = `
                <div class="chart-container">
                <canvas id="tempChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="humidityChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="windgustChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="pressureChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="severeriskChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="dewChart"></canvas>
            </div>
                `;
            drawCharts();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeatherData(data) {
    for (var i = 0; i < data.days.length; i++) {
        var temp = [];
        var humidity = [];
        var windgust = [];
        var pressure = [];
        var severerisk = [];
        var dew = [];

        for (var j = 0; j < data.days[i].hours.length; j++) {
            var obj = data.days[i].hours[j];
            temp.push(obj.temp);
            humidity.push(obj.humidity);
            windgust.push(obj.windgust);
            pressure.push(obj.pressure);
            severerisk.push(obj.severerisk);
            dew.push(obj.dew);
        }

        var date = data.days[i].datetime;

        weatherData[String(date)] = {
            'temp': temp,
            'humidity': humidity,
            'windgust': windgust,
            'pressure': pressure,
            'severerisk': severerisk,
            'dew': dew,
        };
    }
}
function handleSearch() {
    const locationInput = document.getElementById("location-input");
    const location = locationInput.value;
    fetchWeatherData(location);
}
function drawCharts() {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const chartElements = ['temp', 'humidity', 'windgust', 'pressure', 'severerisk', 'dew'];

    chartElements.forEach(element => {
        const data = {
            labels: labels,
            datasets: [
                {
                    label: `${element} of today`,
                    data: weatherData[Object.keys(weatherData)[0]][element], // Change 'day1' as needed
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                },
            ],
        };

        const canvasId = `${element}Chart`;
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Hour of the Day',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: element,
                        },
                    },
                },
            },
        });
    });
}

// Initialize the chart
fetchWeatherData("mumbai");
