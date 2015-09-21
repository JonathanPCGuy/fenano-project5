// 1. look at prototype again
// 2. namespace

var Location = function(lat, lon) {
	this.lat = lat;
	this.lon = lon;	
};

var PlaceSource = function(title, subtitle, location) {
	this.title = title;
	this.subtitle = subtitle;
	this.location = location;
	
	// is this ok or not?
	this.PrettyPrintCoords = function() {
		return this.location.lat + ", " + this.location.lon;
	};	
	
	this.PrintListItem = function() {
		return this.title + " (" + 	this.PrettyPrintCoords() + ")";	
	};
	
	// computed observable?
	
};


var PlaceSourceArray = [];

for(var i = 0; i < 10; i++) {
	PlaceSourceArray.push(new PlaceSource("title" + i, "subtitle" + i, new Location(29.7604 + i/100, -95.3698 + i/100 )));
}