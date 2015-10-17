var Place = function(data, callback) {
	var self = this;
	//this.rawData = data;
	this.title = data.title;
	this.place_id = data.place_id
	this.location = {
		lat: data.lat,
		lon: data.lon
	};
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(this.location.lat, this.location.lon),
			map: map,
			title: this.title,
			animation: google.maps.Animation.DROP	
		});		
	this.marker.addListener('click', function() {return callback.call(this, self);}); //, self.rawData
};