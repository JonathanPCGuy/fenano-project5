var map;
var isClosed = false; // move to mvvm model later


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.7541581, lng: -95.360436},
    zoom: 12,
	streetViewControl: false,
	panControlOptions: { position:  google.maps.ControlPosition.RIGHT_TOP },
	zoomControlOptions: { position:  google.maps.ControlPosition.RIGHT_CENTER}
  });	
};

$('#clickhere').click(function() {
	// open it up
	// todo: keep in mind responsive view
	// todo: how to prevent weird resizing (ie how to do it in 1 transaction?)
	// todo: keep map centered when sidebar pops up
	// need to deal with corner cases
	// bootstrap transition, first keep it simple
	// is there a better way than changing class stuff?
	$('#map').toggleClass('col-md-12');
	$('#map').toggleClass('col-md-9');
	$('#sidebar').toggleClass('closed');
	$('#sidebar').toggleClass('col-md-3');
	$('.menu-content').toggleClass('visible');
});

var PlacesViewModel = function() {

	var that = this;
	this.placesList = ko.observableArray();
	Places.forEach(function(singlePlace) {
		that.placesList.push(singlePlace);
	});
	
};

var MapViewModel = function() {
	// we will take the places list (move out of view model?)
	// using knockout (?) generate markers based on what's in the array
	// eventually when we add/remove from the array the markers should add/remove
		
};




ko.applyBindings(new PlacesViewModel());