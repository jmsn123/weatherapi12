var apikey = keys.apiKey;
var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${apikey}&cnt=4&units=imperial`;
var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=new york&appid=${apikey}&units=imperial`;
let locationHistory = JSON.parse(localStorage.getItem("location")) || [];
let clearbtn = document.querySelector(".clear-btn");
var icons = document.querySelector(".icon");
var temp = document.querySelector(".temp");
var cityName = document.querySelector(".name");
var cardBody = document.querySelectorAll(".card-body");
var cityInput = document.getElementById("city");
var cityForm = document.getElementById("city-form");
var deck = document.querySelector(".hide");
// const icons = document.querySelector("icon");
// const temp = document.querySelector("temp")
const iconImg = document.createElement("img");
const listUl = document.querySelector(".list-group");
const desc = document.getElementById("description");
const high = document.getElementById("high");
const low = document.getElementById("low");
const searchList = document.getElementById("searches");
// iconImg.src = "#";
// const locationHistory = [];
console.log(locationHistory);

function saveItems(item) {
    localStorage.setItem("location", JSON.stringify(item));
}

// function getItems() {
//     return JSON.parse(localStorage.getItem("location"));
// }
document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    historyList();
});

function historyList() {
    let items = locationHistory;
    searchList.innerHTML = "";
    if (items) {
        items.map((item, i) => {
            const li = document.createElement("li");
            li.innerHTML = `${item}<i data-index="${i}"class="bi bi-x-circle"/>`;
            li.setAttribute("class", "searchItem");
            // listUl.appendChild(li);
            listUl.insertAdjacentElement("beforeend", li);
            const exitbtn = document.querySelectorAll(`[data-index='${i}']`);
            exitbtn.forEach((item) => {
                item.addEventListener("click", (e) => {
                    e.stopImmediatePropagation();

                    const removed = locationHistory.indexOf(
                        item.parentElement.textContent
                    );
                    const updated = locationHistory.slice(removed);
                    saveItems(updated);
                    item.parentElement.remove();
                });
            });
            li.addEventListener("click", function(e) {
                // console.log(li.parentElement);
                currentWeather(li.textContent);
                fiveDay(li.textContent, cardBody);
            });
            // exitbtn[item].addEventListener("click", () => {
            //     console.log("object");
            // });
        });
    } else {
        console.log("we dont");
    }
}

function fiveDay(value, cardBody) {
    var fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${apikey}&cnt=5&units=imperial`;
    var fiveDayResponse = fetch(fiveDayUrl);
    fiveDayResponse
        .then((response) => response.json())
        .then((data) => {
            const temps = document.createElement("p");
            // deck.innerHTML = " ";

            deck.classList.remove("hide");
            deck.classList.add("show");
            const { list, city } = data;
            const status = data.cod;
            const count = list.length;
            for (let i = 0; i < count; i++) {
                const { main, weather, wind } = list[i];
                console.log(list[i]);
                const iconImg = document.createElement("img");
                const card = cardBody[i];
                // prefroms cleanup .innerHTML also will work
                card.innerHTML = "";
                const forecast = document.createElement("li");
                const sunrise = document.createElement("li");
                const sunset = document.createElement("li");
                // console.log(main);
                let rise = new Date(city.sunrise * 1000)
                    .toTimeString()
                    .split(" ")
                    .slice(0, 1);
                let set = new Date(city.sunset * 1000)
                    .toTimeString()
                    .split(" ")
                    .slice(0, 1);
                // items = date.toString();
                // items.toStr.split(" ")
                sunrise.innerText = `Sunrise: ${rise}`;
                sunset.innerText = `Sunset: ${set}`;
                sunrise.style.listStyleType = "none";
                sunset.style.listStyleType = "none";

                forecast.style.listStyleType = "none";
                forecast.innerText = weather[0].description;
                const icon = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
                iconImg.setAttribute("src", icon);

                // li.textContent = updateLocal().split;
                // for (let i = 0; i < split.length; i++) {
                //     console.log(split[i]);
                // }

                var temp = Math.floor(main.temp);

                card.append(iconImg);
                card.append(temp);
                card.append(forecast);
                card.append(sunrise);
                card.append(sunset);
            }
        })
        .catch((err) => console.log(err));
}

function currentWeather(location) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}&units=imperial`;

    var response = fetch(apiUrl);
    response
        .then((response) => response.json())
        .then((data) => {
            // grab info from the data object
            const { weather, clouds, main, name, lat, lon } = data;
            const newlocation = document.createElement("li");

            listUl.append(newlocation);
            value = " ";
            const icon = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
            cityName.textContent = name;
            iconImg.src = icon;
            var cityTemp = Math.floor(main.temp);
            temp.textContent = cityTemp;
            icons.append(iconImg);
        })
        .catch((err) => console.log(err));
    return response;
}

// (locationHistory[locationHistory.length - 1] === value &&
//     locationHistory.length > 4) ||
// value === "";
cityForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var value = cityInput.value;
    console.log(
        locationHistory[locationHistory.length - 1] === value ||
        value === "" ||
        locationHistory.length > 4
    );
    if (
        locationHistory[locationHistory.length - 1] === value ||
        value === "" ||
        locationHistory.length > 4
    ) {
        console.log("OUR LAST VALUE INPUTED IS EQUAL TO THE VALUE WE INPUT ");
    } else {
        locationHistory.push(value);
        saveItems(locationHistory);
        currentWeather(value).then((data) => {
            data.ok;
        });
        fiveDay(value, cardBody);
        historyList();
    }
});

clearbtn.addEventListener("click", (e) => {
    e.preventDefault();
    locationHistory = [];
    localStorage.setItem("location", JSON.stringify(locationHistory));
    historyList();
});