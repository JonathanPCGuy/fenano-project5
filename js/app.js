// later move into an "app" var?

var map;
var placeService;
var zoomState = -1;
// todo: move to a MVVM

function formatText(template, text) {
  return template.replace('%data%', text);
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	// todo: local storage to remember state
  //42.360698,-71.059783
    center: {lat: 42.360698, lng: -71.059783},
    zoom: 13,
    mapTypeControl: false,
	streetViewControl: false,
	panControlOptions: { position:  google.maps.ControlPosition.RIGHT_TOP },
	zoomControlOptions: { position:  google.maps.ControlPosition.RIGHT_CENTER}
  });
  addRemoveMapControls();
  $(window).resize(addRemoveMapControls);
  placeService =  new google.maps.places.PlacesService(map);
  
  ko.applyBindings(new JLamAppViewModel(Categories.getCategoryList()));
};


function addRemoveMapControls()
{
  if($('#media-check-div').css('float') == 'none') {
    // "responsive view"
    if(zoomState !== 0)
    {
      map.setOptions({
        zoomControl: false
      });
      zoomState = 0;
    }
  }
  else
  {
    if(zoomState !== 1)
    {
      map.setOptions({
        zoomControl: true
      });
      zoomState = 1;
    }
  }
  
    if($('.orientation-check-div').css('float') == 'left') {
      // portrait 
      $('.main-content-item').removeClass('col-xs-6');
      $('.main-content-item').addClass('col-xs-12');
    }
    else
    {
      // landscape
      $('.main-content-item').removeClass('col-xs-12');
      $('.main-content-item').addClass('col-xs-6');
    }
}







