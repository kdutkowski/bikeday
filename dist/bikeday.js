/*! bikeday 10-05-2014 */
function geocode(a,b){var c=new google.maps.Geocoder;c.geocode({address:a,region:"PL"},function(c,d){d==google.maps.GeocoderStatus.OK&&c.length?b(c[0].geometry.location):alert("Location "+a+"not found")})}function obtainAndShowDirections(){var a,b,c,d;geocode($("#from").val(),function(e){a={location:e,lat:e.lat(),lng:e.lng()},$("#resultFrom").text(e),console.log("from",a),geocode($("#to").val(),function(e){c={location:e,lat:e.lat(),lng:e.lng()},$("#resultTo").text(e),console.log("to",c),findStations(function(e){b=findNearestStation(a,e),console.log("fromStation",b),$("#fromStation").text(b.name),$("#fromStationBikes").text(b.bikes),d=findNearestStation(c,e),console.log("toStation",d),$("#toStation").text(d.name),calcRoute(new google.maps.LatLng(a.lat,a.lng),new google.maps.LatLng(b.lat,b.lng),new google.maps.LatLng(d.lat,d.lng),new google.maps.LatLng(c.lat,c.lng))})})})}function initialize(){var a={zoom:12,center:new google.maps.LatLng(52.2324,21.0127),mapTypeId:google.maps.MapTypeId.ROADMAP,panControl:!0,panControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},scaleControl:!0,scaleControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},streetViewControl:!0,streetViewControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP}};map=new google.maps.Map(document.getElementById("map-canvas"),a),navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(a){var b=new google.maps.LatLng(a.coords.latitude,a.coords.longitude);markers=[new google.maps.Marker({map:map,position:b})],setMapBoundsToMarkers(),$("#from").val(a.coords.latitude+" , "+a.coords.longitude)},function(){console.log("No geolocation")});var b=new google.maps.Polyline({strokeColor:"#00FF00"}),c=new google.maps.Polyline({strokeColor:"#FF0000"}),d=new google.maps.Polyline({strokeColor:"#0000FF"});directionsService=new google.maps.DirectionsService,directionsDisplayWalkToStation=new google.maps.DirectionsRenderer({preserveViewport:!0,polylineOptions:b,markerOptions:{visible:!1}}),directionsDisplayWalkFromStation=new google.maps.DirectionsRenderer({preserveViewport:!0,polylineOptions:d,markerOptions:{visible:!1}}),directionsDisplayBike=new google.maps.DirectionsRenderer({preserveViewport:!0,polylineOptions:c,markerOptions:{visible:!1}})}function calcRoute(a,b,c,d){addDirectionsToMap(),addMarkersToMap(a,b,c,d),setMapBoundsToMarkers();var e={origin:a,destination:b,transitOptions:{departureTime:new Date},travelMode:google.maps.TravelMode.WALKING},f={origin:b,destination:c,transitOptions:{departureTime:new Date},travelMode:google.maps.TravelMode.BICYCLING},g={origin:c,destination:d,transitOptions:{departureTime:new Date},travelMode:google.maps.TravelMode.WALKING};directionsService.route(e,function(a,b){console.log("Status",b),b==google.maps.DirectionsStatus.OK?(console.log("Set directions"),directionsDisplayWalkToStation.setDirections(a)):console.error("Error",b);var c=a.routes[0].legs[0].duration.value;$("#toStationDuration").html(a.routes[0].legs[0].duration.text),console.log("Walk to station:",a.routes[0].legs[0].duration),directionsService.route(f,function(a,b){console.log("Status",b),b==google.maps.DirectionsStatus.OK?(console.log("Set bicycling directions"),directionsDisplayBike.setDirections(a)):console.error("Error",b),c+=a.routes[0].legs[0].duration.value,console.log("Biking duration:",a.routes[0].legs[0].duration),directionsService.route(g,function(a,b){console.log("Status",b),b==google.maps.DirectionsStatus.OK?(console.log("Set directions"),directionsDisplayWalkFromStation.setDirections(a)):console.error("Error",b),c+=a.routes[0].legs[0].duration.value,$("#toEndDuration").html(a.routes[0].legs[0].duration.text);var d=new Date;d.setSeconds(c),d.setMinutes(30),d.setMinutes(0);var e=d.getHours();$("#endTime").html(Math.ceil(e)),console.log("Total duration",c),console.log("Walk to end:",a.routes[0].legs[0].duration),d=new Date,d.setMinutes(d.getMinutes()+30),d.setMinutes(0),weather(d.getHours(),Math.ceil(c/3600),function(a){console.log("Result",a);var b=a.endHour,c=a.startHour;$("#weather").html(a.message+"<img src='"+a.icon+"'/>"),sunsetSunrise(b,function(a){$("#sunsetSunrise").html(""),$("#sunsetSunrise").html(c>a.sunsetHour&&24>c||c<a.sunsetHour&&c>=0&&c<a.sunriseHour?"You will be biking in the dark, after sunset at "+a.sunsetHour+":"+a.sunsetMinute:"You won't make it before sunset at "+a.sunsetHour+":"+a.sunsetMinute),$(".results").show(),$("html, body").animate({scrollTop:$(document).height()},"slow")})})})})})}function addDirectionsToMap(){directionsDisplayWalkToStation.setMap(map),directionsDisplayWalkFromStation.setMap(map),directionsDisplayBike.setMap(map)}function setMapBoundsToMarkers(){if(!markers.length)return!1;var a=new google.maps.LatLngBounds;markers.forEach(function(b){a.extend(b.position)}),map.panToBounds(a),map.fitBounds(a)}function addMarkersToMap(a,b,c,d){markers.forEach(function(a){a.setMap(null)}),markers=[new google.maps.Marker({position:a,map:map,icon:"img/start-walk.png"}),new google.maps.Marker({position:b,map:map,icon:"img/start-bike.png"}),new google.maps.Marker({position:c,map:map,icon:"img/stop-bike.png"}),new google.maps.Marker({position:d,map:map,icon:"img/stop-walk.png"})]}function findStations(a){$.ajax({type:"GET",url:"http://nextbike.net/maps/nextbike-official.xml?city=210",dataType:"xml",success:function(b){var c=[];$(b).find("place").each(function(){var a=$(this),b={name:a.attr("name"),lat:a.attr("lat"),lng:a.attr("lng"),bikes:a.attr("bikes"),racks:a.attr("bike_racks")};c.push(b)}),a(c)},error:function(){a([])}})}function distanceSquare(a,b){var c=a.lat-b.lat,d=a.lng-b.lng;return c*c+d*d}function findNearestStation(a,b){var c=null,d=1/0;return b.forEach(function(b){var e=distanceSquare(a,b);d>e&&"0"!=b.bikes&&(c=b,d=e)}),c}function weather(a,b,c){$.ajax({url:"http://api.wunderground.com/api/086afffe3fa8ba4d/hourly/q/Poland/Warsaw.json",dataType:"jsonp",success:function(d){var e=["Thunderstorms","Thunderstorm","Chance of Thunderstorms","Chance of Thunderstorm","Snow","Chance of Snow","Sleet","Chance of Sleet","Freezing Rain","Rain","Chance of Freezing Rain","Chance of Rain","Scattered Clouds","Overcast","Cloudy","Mostly Cloudy","Partly Cloudy","Flurries","Fog","Haze","Sunny","Mostly Sunny","Partly Sunny","Clear","Unknown"],f=1/0,g=0;d.hourly_forecast.forEach(function(a,b){e.forEach(function(c,d){a.condition===c&&f>d&&(f=d,g=b)})});var h=d.hourly_forecast[0].temp.metric;c({message:_getWeatherMessage(f,h),icon:d.hourly_forecast[g].icon_url,endHour:a+b,startHour:a})},error:function(){c({message:"The dark side clouds everything. Impossible to see the future is.",icon:"",endHour:a+b,startHour:a})}})}function sunsetSunrise(a,b){$.ajax({url:"http://api.wunderground.com/api/086afffe3fa8ba4d/astronomy/q/Poland/Warsaw.json",dataType:"jsonp",success:function(a){var c={sunriseHour:a.moon_phase.sunrise.hour,sunriseMinute:a.moon_phase.sunrise.minute,sunsetHour:a.moon_phase.sunset.hour,sunsetMinute:a.moon_phase.sunset.minute};b(c)},error:function(){var a={sunriseHour:Math.NaN,sunriseMinute:Math.NaN,sunsetHour:Math.NaN,sunsetMinute:Math.NaN};b(a)}})}function _getWeatherMessage(a,b){if(!$.isNumeric(a)||a-24===0||!$.isNumeric(b))return"The dark side clouds everything. Impossible to see the future is.";var c="Current temperature in Warsaw is ";return 2>a?c+b+".</br> There will be thunderstorms during your trip":a>=2&&4>a?c+b+".</br> There might be thunderstorms during your trip":a>=4&&5>a?c+b+".</br> It will be snowing during your trip":a>=6&&8>a?c+b+".</br> It might be sleeting during your trip":a>=8&&10>a?c+b+".</br> It will be raining during your trip":a>=9&&11>a?c+b+".</br> It might be raining during your trip":a>=11&&20>a?c+b+".</br> It will be cloudy during your trip":c+b+".</br> It will be great weather during your trip"}var displayWeather=function(a){console.log(a),endHour=a.endHour,startHour=a.startHour,$("#weather").html(a.message+"<img src='"+a.icon+"'/>"),sunsetSunrise(endHour,function(a){$("#sunsetSunrise").html(startHour>a.sunsetHour&&24>startHour||startHour<a.sunsetHour&&startHour>=0&&startHour<a.sunriseHour?"You will be biking in the dark, after sunset at "+a.sunsetHour+":"+a.sunsetMinute:"You won't make it before sunset at "+a.sunsetHour+":"+a.sunsetMinute),$(".results").show(),$("html, body").animate({scrollTop:$(document).height()},"slow")})};$(document).ready(function(){var a=new Date;a.setMinutes(a.getMinutes()+30),a.setMinutes(0),$("#searchButton").click(function(){return weather(a.getHours(),2,displayWeather),obtainAndShowDirections(),!1})});var map,directionsService,directionsDisplayWalkToStation,directionsDisplayWalkFromStation,directionsDisplayBike,markers=[];google.maps.event.addDomListener(window,"load",initialize);