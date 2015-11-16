// global vars to support google maps and places services
var map;
var placeService;
var zoomState = -1;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.360698, lng: -71.059783 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        panControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER }
    });
    
    // set the initial bootstrap layout classes as needed
    responsiveEvent();
    $(window).resize(responsiveEvent);
    placeService = new google.maps.places.PlacesService(map);
    ko.applyBindings(new JLamAppViewModel(Categories.getCategoryList()));
};

// function to modify the layout/structure of the app depending on the screen size and orientation
function responsiveEvent() {
    // idea for using css state check pulled from a dev website, but i can't locate it at the moment...
    if ($('.media-check-div').css('float') == 'none') {
        // "responsive view"
        if (zoomState !== 0) {
            map.setOptions({
                zoomControl: false
            });
            zoomState = 0;
        }
    }
    else {
        if (zoomState !== 1) {
            map.setOptions({
                zoomControl: true
            });
            zoomState = 1;
        }
    }

    if ($('.orientation-check-div').css('float') == 'left') {
        // portrait
        $('.main-content-item').removeClass('col-xs-6');
        $('.main-content-item').addClass('col-xs-12');
    }
    else {
        // landscape
        $('.main-content-item').removeClass('col-xs-12');
        $('.main-content-item').addClass('col-xs-6');
    }
}







