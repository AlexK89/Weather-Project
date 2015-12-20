// JavaScript File
$(function(){
    var city = $("#city").html();
    console.log(city);
   $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=8ce8d052973edd56b69fdc48d4309715', 
   function(data) {
      console.log(data);
      var setTimeUp = data.sys.sunrise*1000;
      var sunUp = moment(setTimeUp).format('h:mm a');
         $('#sunrise_data').html(sunUp)
      var setTimeDown = data.sys.sunset*1000;
      var sunDown = moment(setTimeDown).format('h:mm a');         
         $('#sunset_data').html(sunDown);
   });
});