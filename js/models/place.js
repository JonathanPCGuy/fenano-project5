// data is a google places search result item
var Place = function(data, callback) {
	var self = this;
	this.title = data.name;
	this.place_id = data.place_id
	this.location = {
		lat: data.geometry.location.lat(),
		lon: data.geometry.location.lng()
	};
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(this.location.lat, this.location.lon),
			map: map,
			title: this.title,
			animation: google.maps.Animation.DROP	
		});		
	this.marker.addListener('click', function() {return callback.call(this, self);}); //, self.rawData
};