    var APIkey = "33793265fe00edad75588f2d5de70b87";
    var cityHistory = [];


    searchCityForecast("orlando");
    searchCityWeather("orlando");
    pastCities();


    function savingStorage() {
        var city = $("#city-search").val().trim();
        cityHistory.push(city);
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        pastCities();
    };

    function pastCities() {
        var searchCities = JSON.parse(localStorage.getItem("cityHistory"));
        if (searchCities && searchCities.length > 0){
            $("#past-cities").empty();
            for(var i = 0; i< searchCities.length;i++){
                var htmlSearchCities = $("<button>").text(searchCities[i]);
                $("#past-cities").append(htmlSearchCities);
                htmlSearchCities.addClass("usedCities btn btn-secondary btn-lg btn-block")

            }
            cityHistory = searchCities;
            console.log(cityHistory);
        } else {
            cityHistory = [];
        }
    }
 $(document).on("click",".usedCities", function(){
     var value = $(this).text()
     $(".forecast").empty();
     console.log(value);
     searchCityWeather(value);
    searchCityForecast(value);

 })
    
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
            uvSpan.text("UV index: " + uvi);

            if (uvi <= 2) {
                uvSpan.addClass("badge-success");
            } else if (uvi > 2 && uvi < 7) {
                uvSpan.addClass("badge-warning");
            } else if (uvi >= 7) {
                uvSpan.addClass("badge-danger");
            }

            $('#current-Weather').find('.badge').remove();
            $("#current-Weather").append(uvSpan);
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
                    var containerCard = $("<div>").addClass("col-2")
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

  
