// later move into an "app" var?

var map;
var placeService;

// todo: move to a MVVM

var infoWindowContent = '<div class="my-info-window" id="infowindow-%data%"></div>';
var infoWindowId = '#infowindow-%data%';

function formatText(template, text) {
  return template.replace('%data%', text);
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	// todo: local storage to remember last location
    center: {lat: 29.7541581, lng: -95.360436},
    zoom: 12,
    mapTypeControl: false,
	streetViewControl: false,
	panControlOptions: { position:  google.maps.ControlPosition.RIGHT_TOP },
	zoomControlOptions: { position:  google.maps.ControlPosition.RIGHT_CENTER}
  });
  // why do i have to link it to a map?
  placeService =  new google.maps.places.PlacesService(map);
  
  // callback to add: on bounds change
  	
  ko.applyBindings(new PlacesViewModel(Categories.getCategoryList()));
};







