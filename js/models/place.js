// model defining a place displayed in the map
// data is a google places search result item

var Place = function (data, callback, iconPrefix) {
    var self = this;
    // name of the place
    this.title = data.name;
    // address of the location
    this.subtitle = data.vicinity;
    // the prefix for icon display purposes
    this.iconPrefix = iconPrefix;
    // google places unique place id
    this.place_id = data.place_id;

    // function to call when the place is clicked on or activated
    this.callback = callback;

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



    this.marker.addListener('click', function () {
        return self.callback.call(this, self);
    });
};