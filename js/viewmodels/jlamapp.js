var JLamAppViewModel = function (categoryList) {

    var infoWindowContent = '<div class="my-info-window" id="infowindow-%data%"></div>';
    var infoWindowId = '#infowindow-%data%';

    var self = this;
    this.map = map;
    // internal flag to allow initial search on load
    this.firstTimeSearch = true;
    this.placesList = ko.observableArray();
    this.filter = ko.observable("");
    this.showRefreshButton = ko.observable(false);
    this.sideMenuVisible = ko.observable(false);

    // observable used to trigger searches when the refresh/search button is clicked
    this.searchTrigger = ko.observable(0);
    this.categoryList = ko.observableArray(categoryList);
    // keeps track of any open info window, if any, so we can close it if another marker/place is activated
    this.currentOpenedPlaceItem = ko.observable(null);

    // used to format the drop down display text
    this.currentCategoryDisplayText = ko.computed(function () {
        return "Category - " + this.currentCategory().displayName;
    }, self, { deferEvaluation: true });

    this.currentCategory = ko.observable(this.categoryList()[0]);

    this.iconPrefix = ko.computed(function () {
        return self.currentCategory().iconPrefix;
    });

    this.categoryItemClick = function (selectedItem) {
        self.currentCategory(selectedItem);
    }

    // function is used to trigger a search by updating an observable
    // that is embedded in the search function
    this.searchTriggerFunction = function () {
        self.searchTrigger(self.searchTrigger() + 1);
    }

    // filtering function used to show/hide places as text is added to the filter field
    this.filteredPlaces = ko.computed(function () {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            ko.utils.arrayForEach(self.placesList(), function (singlePlace) {
                self.setMarkerVisibility(singlePlace, true);
            });
            return self.placesList();
        }
        else {
            return ko.utils.arrayFilter(self.placesList(), function (place) {
                if (place.marker.title.toLowerCase().indexOf(filter) >= 0) {
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

    // currently unused, but may be used in future iterations
    // would hide/show the list of places
    this.toggleSideMenu = function () {
        this.sideMenuVisible(!this.sideMenuVisible());
    };

    // function/callback that is invoked when an menu item is clicked on
    this.menuItemClick = function (singlePlace) {
        map.setCenter(singlePlace.marker.position);
        self.markerClick(singlePlace);
    };

    // event handler for when the marker is clicked
    this.markerClick = function (placeItem) {

        // start an animation that times out fast
        placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
        placeItem.marker.setIcon('img/' + self.iconPrefix() + '-selected.png');
        setTimeout((function () {
            this.marker.setAnimation(null);
        }).bind(placeItem), 700);

        // if the marker's window is already opened, don't open another window
        if (placeItem.infoWindowOpened == true) {
            return;
        }

        if (self.currentOpenedPlaceItem() !== null) {
            // close existing opened item
            self.closeOpenedMarker();
        }

        placeItem.infoWindowOpened = true;

        self.currentOpenedPlaceItem(placeItem);

        // finally create the info window
        var infoWindow = new google.maps.InfoWindow({ content: self.formatText(infoWindowContent, placeItem.place_id) });
        infoWindow.addListener('domready', function () { return self.infoWindowDomReady.call(placeItem.marker, placeItem); });
        infoWindow.addListener('closeclick', (function () {
            this.infoWindowOpened = false;
            this.marker.setIcon('img/' + self.iconPrefix() + '-marker.png');
            self.currentOpenedPlaceItem(null);
        }).bind(placeItem));
        infoWindow.open(map, placeItem.marker);
        placeItem.infoWindow = infoWindow;
        self.currentOpenedPlaceItem(placeItem);
    };

    this.formatText = function (template, text) {
        return template.replace('%data%', text);
    }

    this.closeOpenedMarker = function () {
        // close existing opened item
        self.setMarkerState(self.currentOpenedPlaceItem(), false);
        self.currentOpenedPlaceItem().infoWindow.close();
        self.currentOpenedPlaceItem(null);
    }

    // sets the appropriate icon for the marker depending on if it is active or not
    this.setMarkerState = function (placeItem, markerSelected) {
        if (markerSelected == true) {
            placeItem.infoWindowOpened = true;
            placeItem.marker.setIcon('img/' + self.iconPrefix() + '-selected.png');
        }
        else {
            placeItem.infoWindowOpened = false;
            placeItem.marker.setIcon('img/' + self.iconPrefix() + '-marker.png');
        }
    };

    // helper function to make a marker visible/not visible
    this.setMarkerVisibility = function (singlePlace, visible) {
        if (visible && singlePlace.marker.getMap() == null) {
            singlePlace.marker.setMap(map);
        }
        else if (!visible && singlePlace.marker.getMap() != null) {
            singlePlace.marker.setMap(null);
        }
    }

    // event handler for the info window. activated after the marker or menu item is clicked
    this.infoWindowDomReady = function (rawData) {
        console.log("dom ready!");
        var targetDivId = self.formatText(infoWindowId, rawData.place_id);

        try {
            var locationBox = new LocationInfoBox(rawData, $(targetDivId));
            locationBox.getData();
        }
        catch (err) {
            console.log(err);
        }
    };

    // handler for search results. invoked on page load, category change, or refresh button
    this.placesResultCallback = function (results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            // clear out existing results, if any
            self.placesList.remove(function (place) {
                place.marker.setMap(null);
                return true;
            });
            var limit = results.length;// > 10 ? 10 : results.length;
            for (var i = 0; i < limit; i++) {
                // todo: set entire array instead of doing one at a time?
                var currentItem = results[i];
                var markerPlace = new Place(currentItem, self.markerClick, self.iconPrefix());//function() {return self.markerClick(currentItem.place_id);});
                self.placesList.push(markerPlace);
            }
        }
    }

    // calculates the rough radius of the current viewable map area
    this.getCurrentViewableMapArea = function () {
        // read map object and get viewable area
        var bounds = self.map.getBounds();
        var mapCenter = bounds.getCenter();
        var mapCorner = bounds.getNorthEast();

        var radius = google.maps.geometry.spherical.computeDistanceBetween(mapCenter, mapCorner);

        return radius;
    };

    // search function to get list of places
    this.searchMap = ko.computed(function () {
        if (self.currentOpenedPlaceItem.peek() !== null) {
            self.closeOpenedMarker();
        }

        // adding a reference to a computed allows easy trigger of searching via the refresh button
        self.searchTrigger();
        var searchRadius = self.getCurrentViewableMapArea();
        var mapCenter = self.map.getCenter();
        var request = {
            location: mapCenter,
            radius: searchRadius,
            types: [self.currentCategory().key]
        };
        placeService.nearbySearch(request, self.placesResultCallback);
    }, self, { deferEvaluation: true });

    map.addListener('bounds_changed', function () {
        if (self.firstTimeSearch == true) {
            self.firstTimeSearch = false;
            self.searchMap();
        }
        else {
            // TODO: leverage this for auto-refresh of map in the future
            // self.showRefreshButton(true);
        }
    });
};