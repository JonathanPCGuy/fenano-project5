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
	ko.applyBindings(new PlacesViewModel());
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
		var markerPlace = new google.maps.Marker({
			position: new google.maps.LatLng(singlePlace.location.lat, singlePlace.location.lon),
			map: map,
			title: singlePlace.title	
		});
				// we're duplicating data, but i'm not sure how to eliminate duplication
		// for now i'll do this until i can figure it out
		singlePlace.marker = markerPlace;
		that.placesList.push(singlePlace);	

	});
	
	this.toggleMarker = function(singlePlace) {
		if(singlePlace.marker.map == null)
		{
			singlePlace.marker.setMap(map);
		}
		else
		{
			singlePlace.marker.setMap(null);
		}	
	};
	
};
