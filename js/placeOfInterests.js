// 1. look at prototype again
// 2. namespace

var Location = function(lat, lon) {
	this.lat = lat;
	this.lon = lon;	
};

var Place = function(title, subtitle, location) {
	this.title = title;
	this.subtitle = subtitle;
	this.location = location;
	
	this.PrettyPrintCoords = function() {
		return this.location.lat + ", " + this.location.lon;
	};	
};


var Places = [];

for(var i = 0; i < 10; i++) {
	Places.push(new Place("title" + i, "subtitle" + i, new Location(29.7604 + i/100, 95.3698 + i/100 )));
}