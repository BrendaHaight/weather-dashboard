document
  .getElementById("city-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cityName = document.getElementById("city-input").value.trim();
    if (cityName) {
      getWeather(cityName);
      addToHistory(cityName);
      saveHistory();
    } else {
      alert("Please enter a city name.");
    }
  });

// Load history on page load
window.onload = function () {
  loadHistory();
  document
    .getElementById("search-history")
    .addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") {
        getWeather(event.target.textContent);
      }
    });
};

function getWeather(cityName) {
  const apiKey = "aaef97e879e28bc6c8fa39b6cae2ecc6";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

  // Fetch current weather data
  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      console.log("City data (Metric):", data);
      updateCurrentWeather(data);
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to fetch weather data: " + error.message);
    });

  // Fetch 5-day forecast data
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Forecast data (Metric):", data);
      updateForecast(data);
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Failed to fetch forecast data: " + error.message);
    });
}

function updateCurrentWeather(data) {
  const currentWeatherDisplay = document.getElementById("current-weather");
  currentWeatherDisplay.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
      <img src="http://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png" alt="Weather icon">
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function updateForecast(data) {
  const forecastDisplay = document.getElementById("forecast");
  forecastDisplay.innerHTML = "<h3>5-Day Forecast:</h3>";
  data.list.forEach((forecast, index) => {
    if (index % 8 === 0) {
      // Only use data every 8 hours
      forecastDisplay.innerHTML += `
              <div>
                  <h4>${new Date(forecast.dt * 1000).toLocaleDateString()}</h4>
                  <img src="http://openweathermap.org/img/w/${
                    forecast.weather[0].icon
                  }.png" alt="Weather icon">
                  <p>Temp: ${forecast.main.temp} °C</p>
                  <p>Wind: ${forecast.wind.speed} m/s</p>
                  <p>Humidity: ${forecast.main.humidity}%</p>
              </div>
          `;
    }
  });
}

function addToHistory(cityName) {
  const history = JSON.parse(
    localStorage.getItem("weatherSearchHistory") || "[]"
  );
  if (!history.includes(cityName)) {
    history.push(cityName);
    updateHistoryDisplay(history);
  }
}

function saveHistory() {
  localStorage.setItem("weatherSearchHistory", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(
    localStorage.getItem("weatherSearchHistory") || "[]"
  );
  updateHistoryDisplay(history);
}

function updateHistoryDisplay(history) {
  const historyElement = document.getElementById("search-history");
  historyElement.innerHTML = "";
  history.forEach(city => {
    const button = document.createElement("button");
    button.textContent = city;
    historyElement.appendChild(button);
  });
}
