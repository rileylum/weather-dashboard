
var cityName = 'canberra'
var apiKey = '8d20771314feba21a1dc624717e99f62'

async function getCityLatLong(city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    const response = await fetch(requestUrl);
    const predict = await response.json();
    cityName = predict.name;
    return predict;
};

async function getWeatherData(coords) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.coord.lat + "&lon=" + coords.coord.lon + "&units=metric&appid=" + apiKey;
    const response = await fetch(requestUrl);
    const predict = await response.json();
    return predict;
};

function getData() {
    getCityLatLong(cityName)
        .then(function (coords) {
            getWeatherData(coords)
                .then(function (data) {
                    console.log(data);
                    fillCurrentForecast(data);
                });
        });
};


// getData();

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
};

function fillCurrentForecast(data) {

    var headerElem = document.querySelector('#header');
    var tempElem = document.querySelector('#temp');
    var windElem = document.querySelector('#wind');
    var humidityElem = document.querySelector('#humidity');
    var uvIndexElem = document.querySelector('#uv');

    headerElem.textContent += cityName + " (" + dayjs(data.current.dt * 1000).format('DD/MM/YYYY') + ") " + data.current.weather[0].main;
    tempElem.textContent = data.current.temp;
    windElem.textContent = data.current.wind_speed;
    humidityElem.textContent = data.current.humidity;
    uvIndexElem.textContent = data.current.uvi;
    if (data.current.uvi <= 2) {
        uvIndexElem.classList = "rounded bg-success text-white px-2";
    } else if (data.current.ubi <= 5) {
        uvIndexElem.classList = "rounded bg-warning text-white px-2";
    } else {
        uvIndexElem.classList = "rounded bg-danger text-white px-2";
    };
};


createCurrentForecast();



