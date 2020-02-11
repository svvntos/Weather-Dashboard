    var APIkey = "33793265fe00edad75588f2d5de70b87";

    function savingStorage() {
        var city = $("#city-search").val().trim();
        localStorage.setItem("city", city);
        pastCities();
    };

    function pastCities() {
        var searchCities = localStorage.getItem("city");
        var htmlSearchCities = $("<p>").text(searchCities);
        htmlSearchCities.addClass("form-control d-block bg-white")
        $("#past-cities").append(htmlSearchCities);
    }
    
    $("#getWeather").click(function (event) {
        event.preventDefault();
        savingStorage();
        $(".city").empty();
        $(".wind").empty();
        $(".humidity").empty();
        $(".temp").empty();
        $(".badge").empty();

        var city = $("#city-search").val().trim();
        searchCityWeather(city);
        searchCityForecast(city);
        $(".forecast").empty();
        $(".display-4").text(moment().format("MM Do YY"));
    });
    function getUVindex(lat, lon) {
        var UVquertURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon + "&cnt=1";

        $.ajax({
            url: UVquertURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response[0].value);
            var uvSpan = $("<span>");
            uvSpan.addClass("badge");
            var uvi = response[0].value;
            uvSpan.removeClass("badge-success badge-warning badge-danger");
            uvSpan.text("UV index: " + uvi);

            if (uvi <= 2) {
                uvSpan.addClass("badge-success");
                $("#current-Weather").append(uvSpan);
            } else if (uvi > 2 && uvi < 7) {
                uvSpan.addClass("badge-warning");
                $("#current-Weather").append(uvSpan);
            } else if (uvi >= 8) {
                uvSpan.addClass("badge-danger");
                $("#current-Weather").append(uvSpan);
            }
        });
    };

    function searchCityWeather(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + APIkey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            $(".city").html("<h1>" + response.name + "</h1>");
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".temp").text("Temperature (F) " + response.main.temp);

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUVindex(lat, lon);
            // console.log(lat, lon);

        });
    };

    function searchCityForecast(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response.list[0].weather[0]);
            console.log(response);


            for (var i = 0; i < response.list.length;i++) {
      
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          
                  var realTime = response.list[i].dt;
                  // date= new Date(realTime *1000 )
                    var initialDiv = $("<div>")
                    var dayDiv = $("<div>")
                    var currentDay = $('<h5>')
                    var humidityP = $('<p>')
                    var tempP =$('<p>')
                    var icon =$("<img>")
                          initialDiv.addClass("card")
                          initialDiv.addClass("card1")
                          dayDiv.addClass("card-body")
                          currentDay.addClass("card-title")
                          currentDay.text(moment(realTime, "X").format("MMM Do YY"))
                          humidityP.text("Humidity :" + response.list[i].main.humidity + " %")
                          tempP.text(response.list[i].main.temp + "(F)")
                          icon.attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon +".png")
          
                          
          
                          dayDiv.append(currentDay,tempP, humidityP, icon)
                          initialDiv.append(dayDiv)
                          $(".forecast").prepend(initialDiv)
                  
                }   
            }
        });
    };

  
