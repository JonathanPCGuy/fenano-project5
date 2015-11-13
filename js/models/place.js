// data is a google places search result item
//var defaultMarker = 'img/sight-marker.png';
//var selectedMarker = 'img/sight-selected.png';

var Place = function(data, callback, iconPrefix) {
	var self = this;
	this.title = data.name;
	this.subtitle = data.vicinity;
	this.iconPrefix = iconPrefix;
	
	this.place_id = data.place_id
	this.location = {
		lat: data.geometry.location.lat(),
		lon: data.geometry.location.lng()
	};
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(this.location.lat, this.location.lon),
			map: map,
			title: this.title,
			animation: google.maps.Animation.DROP,
			icon: 'img/' + iconPrefix + '-marker.png'	
		});
		
	this.marker.addListener('click', function() {return callback.call(this, self);}); //, self.rawData
};