// later move into an "app" var?

var map;
var placeService;

// todo: move to a MVVM

function formatText(template, text) {
  return template.replace('%data%', text);
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	// todo: local storage to remember state
  //42.360698,-71.059783
    center: {lat: 42.360698, lng: -71.059783},
    zoom: 13,
    mapTypeControl: false,
	streetViewControl: false,
	panControlOptions: { position:  google.maps.ControlPosition.RIGHT_TOP },
	zoomControlOptions: { position:  google.maps.ControlPosition.RIGHT_CENTER}
  });
  // why do i have to link it to a map?
  placeService =  new google.maps.places.PlacesService(map);
  
  // callback to add: on bounds change
  	
  ko.applyBindings(new JLamAppViewModel(Categories.getCategoryList()));
};







