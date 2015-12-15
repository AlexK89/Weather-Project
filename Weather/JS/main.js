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

	$('#second_form').submit(function(e){
		getWeather($('#search_string').val());
		e.preventDefault();
	})
     $('#main_form').submit(function(e){
        $('#weather_btn').trigger('click');
        e.preventDefault();
    })
    $('#weather_btn').click(function(e){
       e.preventDefault();
       if($('.search input').val()==''){
            return false;
       }
       window.location.href = $(this).prop('href') + "?q=" + $('.search input').val();
    })

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
        $("#weatherTable tr:not(:first)").remove();
        $('#city').html(city);
		var i = 1;
        $.each(data.list, function(){
            // "this" тримає об'єкт прогнозу звідси: http://openweathermap.org/forecast16
            var localTime = new Date(this.dt*1000 - offset); // конвертуємо час з UTC у локальний
            addWeather(
                this.weather[0].icon,
                moment(localTime).format('dddd'),	// Використовуємо moment.js для представлення дати
                this.weather[0].description,
                this.temp,
                i
            );
            i++;
        });
    }	
	function addWeather(icon, day, condition, temp, count){
		var item = '.forecast_row_' + count;
		$(item + ' .day').html(day);
        $(item + ' .hi-c').html(Math.round(temp.max) + '&deg;');
        $(item + ' .lo-c').html(Math.round(temp.min) + '&deg;');
    }
});


