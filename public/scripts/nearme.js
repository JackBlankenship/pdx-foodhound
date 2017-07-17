( function () {
'use strict';

$('#nearme').hide()
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
  			lat: position.coords.latitude,
  			lng: position.coords.longitude
		};
		var nearMeHTML = $('#nearme')[0].href + '/' + pos.lat + '/' + pos.lng;
		$('#nearme').attr('href', nearMeHTML);
		$('#nearme').show();
	}, function() {
		// handleLocationError(true, infoWindow, map.getCenter());
	});
}

}) ();