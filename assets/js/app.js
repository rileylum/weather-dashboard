// Secret Openweather API Key
var apiKey = '8d20771314feba21a1dc624717e99f62'

var searchBtn = document.querySelector('#citySearchBtn');
var searchInput = document.querySelector('#citySearch');
var savedSearchesDiv = document.querySelector('#savedSearches');

var savedSearches;
var storedSearches;

function getSearches() {
    storedSearches = JSON.parse(localStorage.getItem('searches'));
    if (!storedSearches) {
        savedSearches = [];
    } else {
        savedSearches = storedSearches;
        drawSavedSearches();
    }
}

function drawSavedSearches() {
    for (var i = 0; i < savedSearches.length; i++) {
        createSavedSearch(savedSearches[i]);
    }
}

async function getCityLatLong(city) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    const response = await fetch(requestUrl);
    const predict = await response.json();
    cityName = predict.name;
    // if the request is an error predict.cod will exist
    // so we don't return anything which breaks the getData chain
    // otherwise predict is returned and the getData function continues
    if (predict.cod === 200) {
        return predict;
    }
};

async function getWeatherData(coords) {

    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.coord.lat + "&lon=" + coords.coord.lon + "&units=metric&appid=" + apiKey;
    const response = await fetch(requestUrl);
    const predict = await response.json();
    return predict;
};

function getData(cityInput) {
    getCityLatLong(cityInput)
        .then(function (coords) {
            if (coords) {
                return getWeatherData(coords);
            }
        })
        .then(function (data) {
            if (data) {
                fillCurrentForecast(data);
                fillPredictForecast(data);
            }
        });
};

function createCurrentForecast() {
    var currentForecastElem = document.createElement('div');

    document.querySelector('#forecast').innerHTML = "";

    var headerElem = document.createElement('h2');
    var tempElem = document.createElement('p');
    var windElem = document.createElement('p');
    var humidityElem = document.createElement('p');
    var uvIndexElem = document.createElement('p');

    headerElem.innerHTML = "<span id='header-main'></span><img id='icon-main'>";
    tempElem.innerHTML = "Temp: <span id='temp-main'></span>&#8451;";
    windElem.innerHTML = "Wind: <span id='wind-main'></span> m/s";
    humidityElem.innerHTML = "Humidity: <span id='humidity-main'></span>%";
    uvIndexElem.innerHTML = "UV Index: <span id='uv-main'></span>";

    currentForecastElem.appendChild(headerElem);
    currentForecastElem.appendChild(tempElem);
    currentForecastElem.appendChild(windElem);
    currentForecastElem.appendChild(humidityElem);
    currentForecastElem.appendChild(uvIndexElem);

    document.querySelector('#forecast').appendChild(currentForecastElem);
};

function fillCurrentForecast(data) {

    var headerElem = document.querySelector('#header-main');
    var weatherImg = document.querySelector('#icon-main');
    var tempElem = document.querySelector('#temp-main');
    var windElem = document.querySelector('#wind-main');
    var humidityElem = document.querySelector('#humidity-main');
    var uvIndexElem = document.querySelector('#uv-main');

    headerElem.textContent += cityName + " (" + dayjs(data.current.dt * 1000).format('DD/MM/YYYY') + ") ";
    weatherImg.setAttribute('src', "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
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

function createPredictForecast() {
    var predictsDiv = document.createElement('div');
    predictsDiv.classList = 'row justify-content-between';
    predictsDiv.innerHTML = "<h3>5-Day Forecast:</h3>";

    for (var i = 1; i < 6; i++) {
        var predictElem = document.createElement('div');
        var headerElem = document.createElement('h4');
        var iconElem = document.createElement('img');
        var tempElem = document.createElement('p');
        var windElem = document.createElement('p');
        var humidityElem = document.createElement('p');

        predictElem.classList = "col-6 col-md-4 col-lg-2"

        headerElem.innerHTML = "<span id='header-" + i + "'></span>"
        iconElem.setAttribute('id', 'icon-' + i);
        tempElem.innerHTML = "Temp: <span id='temp-" + i + "'></span>&#8451;";
        windElem.innerHTML = "Wind: <span id='wind-" + i + "'></span> m/s";
        humidityElem.innerHTML = "Humidity: <span id='humidity-" + i + "'></span>%";

        predictElem.appendChild(headerElem);
        predictElem.appendChild(iconElem);
        predictElem.appendChild(tempElem);
        predictElem.appendChild(windElem);
        predictElem.appendChild(humidityElem);

        predictsDiv.appendChild(predictElem);
    }

    document.querySelector('#forecast').appendChild(predictsDiv);
}

function fillPredictForecast(data) {
    for (var i = 1; i < 6; i++) {
        var headerElem = document.querySelector('#header-' + i);
        var weatherImg = document.querySelector('#icon-' + i);
        var tempElem = document.querySelector('#temp-' + i);
        var windElem = document.querySelector('#wind-' + i);
        var humidityElem = document.querySelector('#humidity-' + i);

        headerElem.textContent += dayjs(data.daily[i].dt * 1000).format('DD/MM/YYYY')
        weatherImg.setAttribute('src', "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
        tempElem.textContent = data.daily[i].temp.day;
        windElem.textContent = data.daily[i].wind_speed;
        humidityElem.textContent = data.daily[i].humidity;
    }
};

function createSavedSearch(searchString) {
    var savedSearchBtn = document.createElement('button');
    savedSearchBtn.classList = "btn btn-secondary w-100 mb-3";
    savedSearchBtn.setAttribute('type', 'submit');
    savedSearchBtn.setAttribute('data-search', searchString);
    savedSearchBtn.textContent = searchString[0].toUpperCase() + searchString.substring(1);
    savedSearchesDiv.appendChild(savedSearchBtn);
}

searchBtn.addEventListener('click', function (e) {
    var searchVal = searchInput.value.toLowerCase();
    e.preventDefault();
    createCurrentForecast();
    createPredictForecast();
    if (!savedSearches.includes(searchVal)) {
        savedSearches.push(searchVal);
        localStorage.setItem('searches', JSON.stringify(savedSearches));
        createSavedSearch(searchVal);
    };
    getData(searchVal);
});

savedSearchesDiv.addEventListener('click', function (e) {
    e.preventDefault
    if (e.target.nodeName === "BUTTON") {
        console.log('hello');
        createCurrentForecast();
        createPredictForecast();
        getData(e.target.getAttribute('data-search'));
    };
})



getSearches();

