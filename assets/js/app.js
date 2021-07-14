
var fakeData = {
    "lat": 33.44,
    "lon": -94.04,
    "timezone": "America/Chicago",
    "timezone_offset": -21600,
    "current": {
        "dt": 1618317040,
        "sunrise": 1618282134,
        "sunset": 1618333901,
        "temp": 284.07,
        "feels_like": 282.84,
        "pressure": 1019,
        "humidity": 62,
        "dew_point": 277.08,
        "uvi": 0.89,
        "clouds": 0,
        "visibility": 10000,
        "wind_speed": 6,
        "wind_deg": 300,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "light rain",
                "icon": "10d"
            }
        ]
    }
};

function createCurrentForecast() {
    var currentForecastElem = document.createElement('div');

    var headerElem = document.createElement('h2');
    var tempElem = document.createElement('p');
    var windElem = document.createElement('p');
    var humidityElem = document.createElement('p');
    var uvIndexElem = document.createElement('p');

    headerElem.innerHTML = "<span id='header'></span>";
    tempElem.innerHTML = "Temp: <span id='temp'></span>&#8451;";
    windElem.innerHTML = "Wind: <span id='wind'></span> m/s";
    humidityElem.innerHTML = "Humidity: <span id='humidity'></span>%";
    uvIndexElem.innerHTML = "UV Index: <span id='uv'></span>";

    currentForecastElem.appendChild(headerElem);
    currentForecastElem.appendChild(tempElem);
    currentForecastElem.appendChild(windElem);
    currentForecastElem.appendChild(humidityElem);
    currentForecastElem.appendChild(uvIndexElem);

    document.querySelector('#forecast').appendChild(currentForecastElem);
}

function fillCurrentForecast(cityName, data) {

    var headerElem = document.querySelector('#header');
    var tempElem = document.querySelector('#temp');
    var windElem = document.querySelector('#wind');
    var humidityElem = document.querySelector('#humidity');
    var uvIndexElem = document.querySelector('#uv');

    headerElem.textContent = cityName + data.current.dt + data.current.weather[0].main;
    tempElem.textContent = data.current.temp;
    windElem.textContent = data.current.wind_speed;
    humidityElem.textContent = data.current.humidity;
    uvIndexElem.textContent = data.current.uvi;
}


createCurrentForecast();
fillCurrentForecast('Texarkana', fakeData);
// example get request for adelaide weather
// fetch('https://api.openweathermap.org/data/2.5/weather?q=adelaide&appid=8d20771314feba21a1dc624717e99f62').then(function(response){return response.json();}).then(function(data){console.log(data);})

