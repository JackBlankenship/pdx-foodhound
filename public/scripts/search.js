'use strict';
//( function () {
	//constant section. changed to var for backwards compatability
var $buttonSearchCity = $('#searchCity');
var domCity = document.getElementById('city');
var $errorID = $('#errors');							// set the errors element id.
//var baseApi = 'http://localhost:5000/api/';
var baseApi = 'http://pdx-foodhound.herokuapp.com/api/';
var classSelect = '.select';
var classMessage = '.message';
var classError  = '.error';
var processArray = ['#locations', '#filter', '#refine', '#restaurants'];
var locationProperties = ['location_suggestions', 'city_id', 'title'];
var cuisineProperties = ['cuisines', 'cuisine', 'cuisine_id', 'cuisine_name'];
var establishmentProperties = ['establishments', 'establishment', 'id', 'name'];
var categoryProperties = ['categories', 'categories', 'id', 'name'];
var restaurantProperties = ['restaurants', 'restaurant', 'id', 'name', 'location', 'address', 'latitude', 'longitude', 'locality_verbose'];
var filterProperties = ['filters', 'id', 'name', 'n/a'];
var searchProperties = ['restaurants', 'restaurant', 'name', 'location', 'address', 'latitude', 'lonigute'];
var filterData = { 'filters': [ {'id': 1, 'name': 'cuisines'}, {'id': 2, 'name': 'establishments'}, {'id': 3, 'name': 'categories'} ] };
var $details = $('#details');

var processIndex = 0;
var $select = [];
var cityData = [];
var classArray = [];
var cityID = 0;
var cityName = '';
var cityLat = 0;
var cityLon = 0;
var cuisineID = 0;
var cuisineName = '';
var establishmentID = 0;
var establishmentName = '';
var categoryID = 0;
var categoryName = '';
var thisClass= '';
var filterID = 0;
var filterName = '';
var jqxhr = '';
var callApi = '';
var restaurantQuery = '';
var Latitude = 0.0;
var Longitude = 0.0;
var LatLng = { lat: 0.0, lng: 0.0 };
var map;
$details.hide();

// callback function for Google maps
function initMap() {
	LatLng.lat = parseFloat(Latitude);
	LatLng.lng = parseFloat(Longitude);
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

//* --------------------- *//
//*  Functions  section   *//
//* --------------------- *//
function setBaseURL () {
	var tempIndex = window.location.href.indexOf('search')
	var tempURL = window.location.href.substring(0, tempIndex);
	baseApi = tempURL + 'api/';
}

function callFoodHoundAPI (type, searchValue, messageHTML, errorHTML, propertyName1, propertyName2, propertyName3, propertyName4) {
	//TODO make searchValues array capable. same with all the propertyName values.
	callApi = baseApi + type + '/' + searchValue;  // removed the escape(searchValue)

	$(classError).remove();		// should remove all individual error
	$(classMessage).remove();	// messages
	$details.hide();

	jqxhr = $.getJSON(callApi, {
		//
	})
	.done( function (data) {
//		console.log("search return:" + Object.getOwnPropertyNames(data) );
//		console.log("array length:" + data[propertyName1].length);
		buildSelectHtml(data, type, messageHTML, errorHTML, propertyName1, propertyName2, propertyName3, propertyName4);
	});
}

function buildSelectHtml (data, type, messageHTML, errorHTML, propertyName1, propertyName2, propertyName3, propertyName4) {
//	console.log('buildSelectHtml of type:' + type);
	var selHTML = '';
	if (type == 'search') {
		type = 'restaurants';
	}
	if (data[propertyName1].length > 1) {
		cityData = data;
		//  '<label class="' + type +'" for="' + type + '">' + type + '</label>''
		selHTML = '<select class="' + type + '">';
		selHTML += '<option>Select ' + type + '</option>'; 
		for (var i=0; i< data[propertyName1].length; i++) {

			if ((type === 'locations') || (type == 'filter')){
				selHTML  += '<option value="' + data[propertyName1][i][propertyName2] + '">';
				selHTML  += data[propertyName1][i][propertyName3] + '</option>'; 
			} else {
				selHTML  += '<option value="' + data[propertyName1][i][propertyName2][propertyName3] + '">';
				selHTML  += data[propertyName1][i][propertyName2][propertyName4] + '</option>' ;
			}
		}
		selHTML  += '</select>';

		$(processArray[processIndex]).append(selHTML);

		thisClass = '.' + type;
		classArray.push(thisClass);											// add class to array in case user 'backtracks'
		$(thisClass).change(function () {									// bind change event
			var thisID = '#' + $(this).parent().get(0).id;					// get the id of the change.
			var tempIndex = $.inArray(thisID, processArray);
			removeDropDowns(tempIndex);

			processIndex = tempIndex;										// allow you to backtrack up the decision tree.
			var thisIndex = parseInt($(this)[0].selectedIndex - 1); 		// need the -1 because the first selection is blank.
			if (type == 'restaurants') {
				buildDetail(cityData, thisIndex);
			} else {
				getObjectProperties(data, thisIndex, type, propertyName1, propertyName2, propertyName3, propertyName4);
				nextPhase();
			}
		});

	} else if (data[propertyName1].length == 0) {
		//console.log('Propertyname:' + propertyName1 + ' TYPE:' + type);
		$errorID.append(errorHTML);
	} else {
		cityData = data;
		thisClass = '.' + type;
		classArray.push(thisClass);
		if (type == 'restaurants') {
			buildDetail(cityData, 0);
		} else {
		// console.log(Object.getOwnPropertyNames(data[propertyName1][0]));
			getObjectProperties(data, 0, type, propertyName1, propertyName2, propertyName3, propertyName4);
			nextPhase();
		}
	}
}

function buildDetail(data, index) {
	// .featured_image same level as .name
	// .id is the restaurant id
	setDomHTML('restaurantName', cityData.restaurants[index].restaurant.name);
	setDomHTML('restaurantAddress', cityData.restaurants[index].restaurant.location.address);
	Latitude = cityData.restaurants[index].restaurant.location.latitude;
	Longitude = cityData.restaurants[index].restaurant.location.longitude;
	//if ($('.btn-info')[0].innerText == "LOG OUT"
	// we could xray the cityData.restaurants[index].restaurant.url for span .tel for the telephone.
	$details.show();
	initMap();
}

function setDomHTML(element, text) {
	var tempElement = document.getElementById(element);
	tempElement.innerText = text;
}

function nextPhase() {

	processIndex++;

	if (processIndex == 1) {
		buildSelectHtml(filterData, 'filter', null, null, filterProperties[0], filterProperties[1], filterProperties[2], filterProperties[3]);
	} else if (processIndex == 2) {
		//console.log("call next callFoodHoundAPI:" + filterName)
		switch (filterName) {
			case 'cuisines':
				callFoodHoundAPI(filterName, cityID,
					'<p class="message">Filter by Cuisine, category or establishment type?</p>',
					'<p class="error">No matching city name found for ' + domCity.value + '</p>',
					cuisineProperties[0],
					cuisineProperties[1],
					cuisineProperties[2],
					cuisineProperties[3]);
				break;
			case 'establishments':
				callFoodHoundAPI(filterName, cityID,
					'<p class="message">Filter by Cuisine, category or establishment type?</p>',
					'<p class="error">No matching city name found for ' + domCity.value + '</p>',
					establishmentProperties[0],
					establishmentProperties[1],
					establishmentProperties[2],
					establishmentProperties[3]);
				break;
			case 'categories':
				callFoodHoundAPI(filterName, cityID,
					'<p class="message">Filter by Cuisine, category or establishment type?</p>',
					'<p class="error">No matching city name found for ' + domCity.value + '</p>',
					categoryProperties[0],
					categoryProperties[1],
					categoryProperties[2],
					categoryProperties[3]);
				break;
			default:
				console.log('defaulted filterName:' + filterName);
		}

	} else {
		callFoodHoundAPI('search' , restaurantQuery,
			'<p class="message">Filter by Cuisine, category or establishment type?</p>',
			'<p class="error">No matching restaurants</p>',
			restaurantProperties[0],
			restaurantProperties[1],
			restaurantProperties[2],
			restaurantProperties[3]);
	}
}

function getObjectProperties (data, index, processType, propertyName1, propertyName2, propertyName3, propertyName4) {
	//console.log(Object.getOwnPropertyNames(data[propertyName1][index]));
	switch (processType) {
		case  'locations':
			cityID   = data[propertyName1][index][propertyName2];
			cityName = data[propertyName1][index][propertyName3];
			cityLat  = data[propertyName1][index].latitude;
			cityLon  = data[propertyName1][index].lonigute;
			break;
		case  'filter':
			filterID   = data[propertyName1][index][propertyName2];
			filterName = data[propertyName1][index][propertyName3];			// option select of cuisines, establishments or categories
			break;
		case 'cuisines':
			cuisineID   = data[propertyName1][index][propertyName2][propertyName3];
			cuisineName = data[propertyName1][index][propertyName2][propertyName4];
			restaurantQuery = 'entity_id=' + cityID + '&entity_type=city&cuisines=' + cuisineID + '&sort=rating';
			break;
		case 'establishments':
			establishmentID   = data[propertyName1][index][propertyName2][propertyName3];
			establishmentName = data[propertyName1][index][propertyName2][propertyName4];
			restaurantQuery = 'entity_id=' + cityID + '&entity_type=city&establishment_type=' + establishmentID + '&sort=rating';
			break;
		case 'categories':
			categoryID   = data[propertyName1][index][propertyName2][propertyName3];
			categoryName = data[propertyName1][index][propertyName2][propertyName4];
			restaurantQuery = 'entity_id=' + cityID + '&entity_type=city&category=' + categoryID + '&sort=rating';
			break;
		default:
			console.log("unknown type:"+ processType);
		/*case  'city'key: "value", 						// removed due to problems with the data feed. using locations instead.
			cityID   = data[propertyName1][index][propertyName2];
			cityName = data[propertyName1][index][propertyName3];
			break
		*/
	}
}

function removeDropDowns(myIndex) {
	if (myIndex < processIndex) {
		for (var k=processIndex; k> myIndex; k--) {
			//console.log("remove attempt for:"+ classArray[k] + ' at index:' + k);
			$(classArray[k]).remove();
			classArray.pop();
		}
	}	
}
setBaseURL();
domCity.focus();
//* --------------------- *//
//*  Events  section      *//
//* --------------------- *//

$buttonSearchCity.click( function () {
	//$('.filter').remove();
	if (domCity.value.length > 2) {
		removeDropDowns(-1);						// remove all dropdowns

		cityName = domCity.value;					// character escape is done by $.getJSON.
		console.log("city:" + cityName);
		processIndex = 0;							// set the processIndex to the beginning.
		callFoodHoundAPI('locations', cityName,
			'<p class="message">Filter by Cuisine, category or establishment type?</p>',
			'<p class="error">No matching city name found for ' + domCity.value + '</p>',
			'location_suggestions',
			'city_id',
			'title',
			'n/a');
	} else {					// html5 error should set border 1px solid red.
		$errorID.append('<p class="error">Please enter a city</p>');
		domCity.focus();
	}
});

$('form').submit( function(e) {
	e.preventDefault();
});
//}) ();