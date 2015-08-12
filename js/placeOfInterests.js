// 1. look at prototype again
// 2. namespace

var Place = function(title, subtitle, location) {
	this.title = title;
	this.subtitle = subtitle;
	this.location = location;	
};

var Places = [];

for(var i = 0; i < 10; i++) {
	Places.push(new Place("title" + i, "subtitle" + i, "location" + i));
}