//( function () {
'use strict';
var map;
// callback function for Google maps
function initMap() {
	var LatLng = { lat: 0.0, lng: 0.0 };
	LatLng.lat = parseFloat( $('#lat')[0].innerText );
	LatLng.lng = parseFloat( $('#lng')[0].innerText );
    map = new google.maps.Map(document.getElementById('map'), {
          center: LatLng,
          zoom: 14				// 0 = world level 21 = street detail.
    });
    var marker = new google.maps.Marker({
    position: LatLng,
    map: map
 	//   title: 'Hello World!'
  });
}

//}) ();