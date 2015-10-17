// 1. look at prototype again
// 2. namespace

var Location = function(lat, lon) {
	this.lat = lat;
	this.lon = lon;	
};

var PlaceItem = function(title, place_id, lat, lon ) {
	this.title = title;
	this.place_id = place_id;
	this.location = new Location(lat, lon);	
};