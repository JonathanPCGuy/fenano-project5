var map;
var isClosed = false; // move to mvvm model later

var infoWindowContent = '<div class="my-info-window" id="infowindow-%data%"></div>';
var infoWindowId = '#infowindow-%data%';

function formatText(template, text) {
  return template.replace('%data%', text);
}

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

var Place = function(data, callback) {
	var self = this;
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.location.lat, data.location.lon),
			map: map,
			title: data.title,
			animation: google.maps.Animation.DROP	
		});		
	this.marker.addListener('click', callback);
};

var PlacesViewModel = function() {

	var self = this;
	this.placesList = ko.observableArray();
	this.filter = ko.observable("");
	
	
	this.filteredPlaces = ko.computed(function() {
		var filter = self.filter().toLowerCase();
		if(!filter) {
			// to study: context
			ko.utils.arrayForEach(self.placesList(), function(singlePlace){
			//self.placesList().forEach(function(singlePlace) {
				self.setMarkerVisibility(singlePlace, true);
			});
			//}, this);
			return self.placesList();
		}
		else {
			return ko.utils.arrayFilter(self.placesList(), function(place) {
				// to do: optimize
				if(place.marker.title.toLowerCase().indexOf(filter) >= 0) {
					self.setMarkerVisibility(place, true);
					return true;
				}
				else {
					self.setMarkerVisibility(place, false);
					return false;
				}
			});
		}
	});
	
	this.setMarkerVisibility = function(singlePlace, visible) {
		// to do: optimize
		if(visible && singlePlace.marker.getMap() == null) {
			
			singlePlace.marker.setMap(map);
		}
		else if (!visible && singlePlace.marker.getMap() != null) {
			singlePlace.marker.setMap(null);
		}
	}
	
	this.menuItemClick = function(singlePlace) {
		map.setCenter(singlePlace.marker.position);
		// zoom?
	};
	
	this.markerClick = function() {
		// seems the context when the thing is clicked is the marker itself?!?!
		var infoWindow = new google.maps.InfoWindow({content: formatText(infoWindowContent, this.getTitle())});
		infoWindow.addListener('domready', self.infoWindowDomReady);
		infoWindow.open(map, this);	
		
		// next steps: attaching a DOM
		
	};
	
	this.infoWindowDomReady = function() {
		// context is the infoWindow
		console.log("dom ready!");
		var targetDiv = formatText(infoWindowId, this.getAnchor().getTitle());
		// animation looks clunky, will need to optimize
		$(targetDiv).text("targetDiv" + this.getAnchor().getTitle() + 'testtestfjkfjdfjlsd');	
	};
	
	this.prettyPrint = function(singlePlace) {
		return singlePlace.marker.title;	
	};
	
	// moving this to bottom fixes issue
	// need to find way to not to have to this
	// thinking its the way i load my data within the view model at the time not all the functions are set
	// unless i define it another way?
	// init from our data source
	// later on we'll toss this in favor of dynamic places
	PlaceSourceArray.forEach(function(data) {
		var markerPlace = new Place(data, self.markerClick);
		self.placesList.push(markerPlace);
	});
	
};
