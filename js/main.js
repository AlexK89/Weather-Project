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
    $('#ex_forecast_link').click(function(e){
       e.preventDefault();
       window.location.href = $(this).prop('href') + "?q=" + $('#city').html();
    })  ;
//======================================

	$('#get_weather_btn').click(function(){
        getWeather($('#search_string').val());
    });

    function getWeather(search_string){
        $('#search_string').val('');
		$.getJSON( 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + search_string + '&APPID=8ce8d052973edd56b69fdc48d4309715&units=metric&cnt=5',
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
        var country = data.city.country;
        $('#city').html(city);
        $('#cloudness_data').html(data.list[0].clouds + ' %');
        $('#humidity_data').html(data.list[0].humidity + ' %');
        var pressure = data.list[0].pressure;
        $('#pressure_data').html(Math.round(pressure) + ' hpa');
        $('#wind_speed_data').html(data.list[0].speed + ' m/s');
        $('#degree').html(Math.round(data.list[0].temp.day) + '&deg;');
        $('#add_img').html('<img src="img/weather_ico/' + data.list[0].weather[0].icon + '.png" width = "20px" height = "20px" alt="weather_ico">');
        sunUp();
		var i = 1;
        $.each(data.list, function(){
            // "this" тримає об'єкт прогнозу звідси: http://openweathermap.org/forecast16
            var localTime = new Date(this.dt*1000 - offset); // конвертуємо час з UTC у локальний
            addWeather(
                this.weather[0].icon,
                moment(localTime).format('dddd'),	// Використовуємо moment.js для представлення дати
                this.weather[0].description,
                this.temp,
                data.city.country,

                i
            );
            i++;
        });
    }
	function addWeather(icon, day, condition, temp, country, count){
        var item = '.forecast_row_' + count;
		$(item + ' .day').html(day);
        $(item + ' .hi-c').html(Math.round(temp.max) + '&deg;');
        $(item + ' .lo-c').html(Math.round(temp.min) + '&deg;');
        $('#country').html(country);
        $(item).css('background-image', 'url(img/weather_ico/' + icon + '.png)');
     }

    function sunUp(Offset, data){
        if (typeof Offset != 'undefined' && typeof data != 'undefined') {

                var setTimeUp = new Date((data.sys.sunrise+Offset)*1000);
                var hours = setTimeUp.getUTCHours();
                var minutes = setTimeUp.getUTCMinutes();  
                hours<10 ? hour2display = "0"+hours : hour2display = hours;
                minutes<10 ? min2display = "0"+minutes : min2display = minutes;             
                $('#sunrise_data').html(hour2display + ':' + min2display);
                var setTimeDown = new Date((data.sys.sunset+Offset)*1000);
                var hours = setTimeDown.getUTCHours();
                var minutes = setTimeDown.getUTCMinutes();  
                hours<10 ? hour2display = "0"+hours : hour2display = hours;
                minutes<10 ? min2display = "0"+minutes : min2display = minutes;             
                $('#sunset_data').html(hour2display + ':' + min2display);                



        } else {
            var city = $("#city").html();
              $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8ce8d052973edd56b69fdc48d4309715', 
            function (data) {
                getOffSet(data);
            });
        }

       
    };
    function getOffSet (city_data) {
          $.getJSON('https://maps.googleapis.com/maps/api/timezone/json?location=' + city_data.coord.lat+', '+ city_data.coord.lon + '&timestamp=' + city_data.dt+'&key=AIzaSyCIu0iWwlorPy61Z7xykKq99QGqqZeS13o', 
            function (data) {
                console.log(data);
                sunUp(data.rawOffset, city_data);
            });
    }
});  



