var JLamAppViewModel = function(categoryList) {

	var self = this;
	this.map = map;
	
	this.placesList = ko.observableArray();
	this.filter = ko.observable("");
	
	// phase one - fixed category, then we'll make it observable
	this.categoryList = ko.observableArray(categoryList);
	
	// = categoryList;
	
	this.currentCategory = ko.observable(this.categoryList()[0]);
	
	this.categoryItemClick = function(selectedItem)	{
		self.currentCategory(selectedItem);
	}

	this.showRefreshButton = ko.observable(false);
	
	this.sideMenuVisible = ko.observable(false);
	
	// internal flag to allow initial search on load
	this.firstTimeSearch = true;
	
	this.filteredPlaces = ko.computed(function() {
		var filter = self.filter().toLowerCase();
		if(!filter) {
			// to study: context
			ko.utils.arrayForEach(self.placesList(), function(singlePlace){
				self.setMarkerVisibility(singlePlace, true);
			});
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
	
	this.toggleSideMenu = function() {
		this.sideMenuVisible(!this.sideMenuVisible());	
	};

	
	this.menuItemClick = function(singlePlace) {
		map.setCenter(singlePlace.marker.position);
		self.markerClick(singlePlace);
	};
	
	this.markerClick = function(placeItem) {
		
		// start an animation that times out fast
		placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
		placeItem.marker.setIcon(selectedMarker);
		// todo: onclose need to cancel timers
		setTimeout((function() {
			this.marker.setAnimation(null);
		}).bind(placeItem), 700);
		
		// infowindow... attach it to dom?!
		if(placeItem.infoWindowOpened == true)
		{
			return;
		}
		
		placeItem.infoWindowOpened = true;
		// seems the context when the thing is clicked is the marker itself?!?!
		var infoWindow = new google.maps.InfoWindow({content: formatText(infoWindowContent, placeItem.place_id)});
		infoWindow.addListener('domready', function() {return self.infoWindowDomReady.call(placeItem.marker, placeItem);});
		infoWindow.addListener('closeclick', (function(){
			this.infoWindowOpened = false;
			this.marker.setIcon(defaultMarker);
			}).bind(placeItem));
		infoWindow.open(map, placeItem.marker);	
	};
	
	// other functions
	
	this.setMarkerVisibility = function(singlePlace, visible) {
		// to do: optimize
		if(visible && singlePlace.marker.getMap() == null) {
			
			singlePlace.marker.setMap(map);
		}	
		else if (!visible && singlePlace.marker.getMap() != null) {
			singlePlace.marker.setMap(null);
		}
	}
	
	this.infoWindowDomReady = function(rawData) {
		// context is the infoWindow
		console.log("dom ready!");
		var targetDivId = formatText(infoWindowId, rawData.place_id);
		
		//var location = {'lat': rawData.location.lat, 'lon': rawData.location.lon};
		// now make the call to my new ajax functions to get the data
		try
		{
			var locationBox = new LocationInfoBox(rawData, $(targetDivId));
			locationBox.getData();
		}
		catch(err)
		{
			console.log(err);
		}
		// animation looks clunky, will need to optimize
	};
	
	this.placesResultCallback = function(results, status) {
		 
		 if (status == google.maps.places.PlacesServiceStatus.OK) {
			 // clear out existing, if any
			self.placesList.remove(function(place){
				// ok need to remove from the map itself
				// this works!
				place.marker.setMap(null);
				return true;
			});
		 	var limit = results.length;// > 10 ? 10 : results.length;
			 for(var i = 0; i < limit; i++) {
				 // todo: set entire array instead of doing one at a time
				 	var currentItem = results[i];
				 	var markerPlace = new Place(currentItem, self.markerClick);//function() {return self.markerClick(currentItem.place_id);});
					self.placesList.push(markerPlace);
			 }
		 }
	}
	
	this.getCurrentViewableMapArea = function() {
		// read map object and get viewable area
		// needs to fit into format for request
		// for now use NE corner. If bad UI we'll modify to use smaller radius
		var bounds = self.map.getBounds();
		var mapCenter = bounds.getCenter();
		var mapCorner = bounds.getNorthEast();	
		
		var radius = google.maps.geometry.spherical.computeDistanceBetween(mapCenter, mapCorner);
		
		return radius;
	};
	
	this.searchMap = ko.computed(function() {
		var searchRadius = self.getCurrentViewableMapArea();
		var mapCenter = self.map.getCenter();
		var request = {
			location: mapCenter,
			radius: searchRadius,
			types: [self.currentCategory().key]	
		};
		placeService.nearbySearch(request, self.placesResultCallback);	
	}, self, {deferEvaluation: true});
	
	map.addListener('bounds_changed', function() {
		// how to search on load once, and then when the button is clicked?
		if(self.firstTimeSearch == true)
		{
			self.firstTimeSearch = false;
			self.searchMap();
		}
		else
		{
			self.showRefreshButton(true);
			// later on when we click we'll hide the button
		}
	});
};