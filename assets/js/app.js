// Secret Openweather API Key
var apiKey = '8d20771314feba21a1dc624717e99f62'
// get DOM elements
var searchBtn = document.querySelector('#citySearchBtn');
var searchInput = document.querySelector('#citySearch');
var savedSearchesDiv = document.querySelector('#savedSearches');
var resetSaves = document.querySelector('#resetSaved')
// variables to enable localStorage
var savedSearches;
var storedSearches;
// gets search info from localStorage if it exists
function getSearches() {
    storedSearches = JSON.parse(localStorage.getItem('searches'));
    if (!storedSearches) {
        savedSearches = [];
    } else {
        savedSearches = storedSearches;
        drawSavedSearches();
    }
};
// adds saved searches to the DOM as buttons
function drawSavedSearches() {
    for (var i = 0; i < savedSearches.length; i++) {
        createSavedSearch(savedSearches[i]);
    }
};
// gets lat and long values for a city name to be used in another API to get weather predict
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
    } else {
        showError(predict.cod);
    }
};
// get weather predict based on lat long information
async function getWeatherData(coords) {

    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.coord.lat + "&lon=" + coords.coord.lon + "&units=metric&appid=" + apiKey;
    const response = await fetch(requestUrl);
    const predict = await response.json();
    return predict;
};
// calls functions in order, waiting for each to finish before executing the next
// gets weather data and then displays it on the DOM, also creates saved search data
function getData(cityInput) {
    getCityLatLong(cityInput)
        .then(function (coords) {
            if (coords) {
                return getWeatherData(coords);
            }
        })
        .then(function (data) {
            if (data) {
                createCurrentForecast();
                createPredictForecast();
                if (!savedSearches.includes(cityInput)) {
                    savedSearches.push(cityInput);
                    localStorage.setItem('searches', JSON.stringify(savedSearches));
                    createSavedSearch(cityInput);
                };
                fillCurrentForecast(data);
                fillPredictForecast(data);
            }
        });
};

// creates an error message for incorrect user input
function showError(errorCode) {
    console.log(errorCode);
    if (errorCode === '400' || errorCode === '404') {
        window.alert("Error Code: " + errorCode + ". User Input is incorrect, please make sure you enter a correct City Name.")
    } else {
        window.alert("Error Code: " + errorCode + ". Unknown Error, please try again later.")
    }
}

// creates elements needed to house current weather data
function createCurrentForecast() {
    var currentForecastElem = document.createElement('div');

    currentForecastElem.classList = "border border-primary border-1 px-3 mb-3"

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
// fills HTML DOM elements with the current weather from search
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
// creates HTML DOM elements to house 5day weather predict data
function createPredictForecast() {
    var predictsDiv = document.createElement('div');
    predictsDiv.classList = 'row justify-content-evenly px-3';
    predictsDiv.innerHTML = "<h3>5-Day Forecast:</h3>";

    for (var i = 1; i < 6; i++) {
        var predictElem = document.createElement('div');
        var headerElem = document.createElement('h4');
        var iconElem = document.createElement('img');
        var tempElem = document.createElement('p');
        var windElem = document.createElement('p');
        var humidityElem = document.createElement('p');

        predictElem.classList = "col-6 col-lg-3 col-xl-2 bg-dark text-white rounded-3 m-2 p-2"

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
// fills HTML DOM elements with 5day weather predict data
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
// creates a button for each previous unique search, either from local storage on load or
// as the user searches
function createSavedSearch(searchString) {
    var savedSearchBtn = document.createElement('button');
    savedSearchBtn.classList = "btn btn-secondary w-100 mb-3";
    savedSearchBtn.setAttribute('type', 'submit');
    savedSearchBtn.setAttribute('data-search', searchString);
    savedSearchBtn.textContent = searchString[0].toUpperCase() + searchString.substring(1);
    savedSearchesDiv.appendChild(savedSearchBtn);
}
// when the user clicks the search button call getData function with the user input as parameter
searchBtn.addEventListener('click', function (e) {
    var searchVal = searchInput.value.toLowerCase();
    e.preventDefault();

    getData(searchVal);
});
// when the user clicks a button from the saved searches call the getData function with the 
// original user input as parameter
savedSearchesDiv.addEventListener('click', function (e) {
    e.preventDefault
    if (e.target.nodeName === "BUTTON") {
        getData(e.target.getAttribute('data-search'));
    };
})
// when the user clicks the reset save button, clears existing saved searches
resetSaves.addEventListener('click', function () {
    localStorage.removeItem('searches');
    savedSearches = [];
    savedSearchesDiv.innerHTML = "";
})


// get saved searches from localStorage on page load
getSearches();

