$(document).ready(function () {

    var APIkey = "33793265fe00edad75588f2d5de70b87";

    function getUVindex(lat, lon) {
        var UVquertURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon + "&cnt=1";

        $.ajax({
            url: UVquertURL,
            method: "GET"
        }).then(function (response) {
            console.log(response[0].value);
            $(".UVindex").text("UV-index: " + response[0].value);
        });
    };

    function searchCityWeather(city) {

        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $(".city").html("<h1>" + response.name + "</h1>");
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".temp").text("Temperature (F) " + response.main.temp);

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUVindex(lat, lon);
            console.log(lat, lon);
        });
    };

    $("#getWeather").on("click", function (event) {
        event.preventDefault();
        var city = $("#city-search").val().trim();
        searchCityWeather(city);
    })
});