$(document).ready(function(){

        try {
            var result = QueryString("q");
            if ( typeof result !== "undefined"){
                getWeather(result);
            }
        }
        catch (e){
            if (e.name == "TypeError") {
                console.log("error function 'QueryString'!");
            } else {
                throw e;
            }
        }

    function QueryString(variable){
        try{
            q = location.search.substring(1);
            v = q.split("&");
            for(var i = 0; i < v.length; i++){
                p = v[i].split("=", 2);
                if( p.length != 1 && p[0] == variable ){
                    if( p[1].indexOf('%20') != -1 ){
                        return decodeURIComponent(p[1].replace(/\+/g, " "));
                    } else {
                        return p[1].replace(/\+/g, " ");
                    }
                }
            }
        }
        catch (e){
            console.log(e);
        }
    }

    $('#second_form').submit(function(){
        getWeather($('#search_string').val());
        return false;
    })
     $('#main_form').submit(function(){
        $('#weather_btn').trigger('click');
        return false;
    })
   
//============ Button next page
   $('#weather_btn').click(function(){
       if($('.search input').val()==''){
            return false;
       }
       window.location.href = $(this).prop('href') + "?q=" + $('.search input').val();
       return false;
    });
   $('#hourly_weather').click(function(e){
       e.preventDefault();
       window.location.href = $(this).prop('href') + "?q=" + $('#city').html();
    });
    $('#5_days').click(function(e){
       e.preventDefault();
       window.location.href = $(this).prop('href') + "?q=" + $('#city').html();
    });
    $('#10_days').click(function(e){
       e.preventDefault();
       window.location.href = $(this).prop('href') + "?q=" + $('#city').html();
    });
    $('#month').click(function(e){
       e.preventDefault();
       window.location.href = $(this).prop('href') + "?q=" + $('#city').html();
    });
//======================================

    $('#get_weather_btn').click(function(){
        getWeather($('#search_string').val());
    });

    function getWeather(search_string){
        $('#search_string').val('');
        $.getJSON( 'http://api.openweathermap.org/data/2.5/forecast?q=' + search_string + '&appid=8ce8d052973edd56b69fdc48d4309715&units=metric&cnt=8',
            function (data) {
                console.log(data);
                fill_form(data);
            }
    );
        console.log(search_string);
    };
    function fill_form(data) {
        var offset = (new Date()).getTimezoneOffset()*1000; // Відхилення від UTC в секундах
        var city = data.city.name;
        console.log(city);
        var country = data.city.country;
        $('#city').html(city);
        $('#country').html(country);
        $('#degree').html(Math.round(data.list[0].main.temp) + '&deg;');
        $('#add_img').html('<img src="img/weather_ico/' + data.list[0].weather[0].icon + '.png" width = "20px" height = "20px" alt="weather_ico">');
        var i = 1;

        $.each(data.list, function(){
            // "this" тримає об'єкт прогнозу звідси: http://openweathermap.org/forecast16
            var localTime = new Date(this.dt*1000 - offset); // конвертуємо час з UTC у локальний
            var superDay = moment(localTime).format('h:mm a');
            addWeather(
                this.weather[0].icon,
                superDay,  // Використовуємо moment.js для представлення дати
                data.city.country,
                this.main.temp,
                this.main.pressure,
                this.wind.speed,
                this.main.humidity,
                i
            );
            i++;
        });
    };
    function addWeather(icon, day, country, temperature, pressure, wind_speed, humidity, count){
        var item = '.forecast_row_' + count;
        $(item + ' .condition').html('<img src="img/weather_ico/' + icon + '.png" width = "20px" height = "20px" alt="weather_ico">');
        $(item + ' .time').html(day);
        $(item + ' .temp').html(Math.round(temperature) + '&deg;');
        $(item + ' .pressure').html(Math.round(pressure) + ' hpa');
        $(item + ' .wind').html(wind_speed + ' m/s');
        $(item + ' .humidity').html(humidity + ' %');
        // $(item + ' .hi-c').html(Math.round(temp.max) + '&deg;');
        // $(item + ' .lo-c').html(Math.round(temp.min) + '&deg;');
       
     }
});  



