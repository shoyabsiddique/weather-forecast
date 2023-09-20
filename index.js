// Function to fetch weather data from the Open Meteo API
function fetchWeatherData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Once you receive the JSON response, you can update the UI
            updateWeatherUI(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Handle the error, show a message to the user, etc.
        });
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    // Extract and display the relevant weather information
    const currentWeather = data.current_weather;
    const hourlyData = data.hourly;

    // Update the temperature, humidity, and wind speed elements in your HTML
    document.getElementById("temperature").textContent = `${currentWeather.temperature_2m} °C`;
    document.getElementById("humidity").textContent = `${currentWeather.relativehumidity_2m}%`;
    document.getElementById("windspeed").textContent = `${currentWeather.windspeed_10m} m/s`;

    // You can also use hourlyData for additional data if needed
    // For example, hourly temperature data: hourlyData.temperature_2m

    // Update forecast elements similarly
}

// Function to handle the search button click
function handleSearch() {
    const locationInput = document.getElementById("location-input");
    const location = locationInput.value;

    // Call the fetchWeatherData function with the user's input location
    // You need to convert the location input to latitude and longitude
    // or use a geocoding service to get the coordinates based on the location name.
    // Example: fetchWeatherData(latitude, longitude);
}

// Event listeners for user interactions
document.getElementById("search-button").addEventListener("click", handleSearch);

// Initial data fetch (you may want to fetch data for a default location or based on the user's location)
// Example: fetchWeatherData(52.52, 13.41); // Berlin coordinates
