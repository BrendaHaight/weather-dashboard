document
  .getElementById("city-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cityName = document.getElementById("city-input").value.trim();
    if (cityName) {
      getWeather(cityName);
      addToHistory(cityName);
      saveHistory();
      document.getElementById("city-input").value = "";
    } else {
      alert("Please enter a city name.");
    }
  });

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
  const units = localStorage.getItem("units") || "imperial"; // Default to imperial units
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;

  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      console.log("City data:", data);
      updateCurrentWeather(data);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data: " + error.message);
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Forecast data:", data);
      updateForecast(data);
    })
    .catch(error => {
      console.error("Error fetching forecast data:", error);
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
      <p>Temperature: ${data.main.temp} ${getTemperatureUnit()}°</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function updateForecast(data) {
  const forecastDisplay = document
    .getElementById("forecast")
    .querySelector(".row");
  forecastDisplay.innerHTML = "";
  data.list.forEach((forecast, index) => {
    if (index % 8 === 0) {
      const forecastHTML = `
        <div class="col-md-2 forecast-item">
            <h4>${new Date(forecast.dt * 1000).toLocaleDateString()}</h4>
            <img src="http://openweathermap.org/img/w/${
              forecast.weather[0].icon
            }.png" alt="Weather icon" class="img-fluid">
            <p>Temp: ${forecast.main.temp} ${getTemperatureUnit()}</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        </div>
      `;
      forecastDisplay.innerHTML += forecastHTML;
    }
  });
}

function addToHistory(cityName) {
  let history = JSON.parse(
    localStorage.getItem("weatherSearchHistory") || "[]"
  );
  if (!history.includes(cityName)) {
    history.push(cityName);
    updateHistoryDisplay(history);
    saveHistory(history); // Pass history array to saveHistory function
  }
}

function saveHistory(history) {
  if (!Array.isArray(history)) {
    console.error("Invalid history data:", history);
    return;
  }
  localStorage.setItem("weatherSearchHistory", JSON.stringify(history));
}

function loadHistory() {
  let history = [];
  const storedHistory = localStorage.getItem("weatherSearchHistory");
  console.log("Stored history:", storedHistory); // Debugging
  if (storedHistory) {
    try {
      history = JSON.parse(storedHistory);
      if (!Array.isArray(history)) {
        throw new Error("History is not an array");
      }
    } catch (error) {
      console.error("Error parsing or invalid history in localStorage:", error);
      localStorage.removeItem("weatherSearchHistory");
    }
  }
  console.log("Loaded history:", history); // Debugging
  updateHistoryDisplay(history);
}

function updateHistoryDisplay(history) {
  const historyElement = document.getElementById("search-history");
  historyElement.innerHTML = "";
  if (Array.isArray(history)) {
    // Check if history is an array
    history.forEach(city => {
      const button = document.createElement("button");
      button.textContent = city;
      historyElement.appendChild(button);
    });
  } else {
    console.error("History is not an array:", history);
  }
}

function getTemperatureUnit() {
  return localStorage.getItem("units") === "metric" ? "°C" : "°F";
}
