// starting code is the ajax code from the mini course on ajax


// function that provides a framework for third party apis to be queried
// when a location marker is activated
var LocationInfoDataSource = function(sourceName, ajaxConfig, formatFunction, targetDomId, containerClassName) {
    this.sourceName = sourceName;
    this.ajaxConfig = ajaxConfig;
    this.ajaxConfig.context = this;
    this.formatFunction = formatFunction;
    this.targetDomId = targetDomId;
    this.containerClassName = containerClassName;
    this.context = this;
    this.bindings = null;

};

LocationInfoDataSource.prototype = {
	
    //self: this, <- this is not seen, probably more iffe stuff
    // not sure if specify here or in the ajax. probably here?
    attachContainer: function() {
         this.bindings = new LocationInfo(this.targetDomId, this.containerClassName, this.formatFunction);
    },
    removeBindings: function() {
      // todo  
    },
	beginQuery: function() {
        console.log('trying to make an ajax call');
            $.ajax(this.ajaxConfig)//.fail(function(x,t,m) {
                .done(function(response) {
                    // pass into view model
                    this.bindings.response(response);
                });
    },
    onProcessing: function() {
        // todo: show spinner for dom
    }
	//onErrorResult: function() {
};

var LocationAjaxCalls = function(title, location, targetDom)
{
    this.ajaxArray = [];
    
    this.ajaxArray.push(new LocationInfoDataSource('Google StreetView',
        (function() {
                var baseUrl = 'https://maps.googleapis.com/maps/api/streetview';
                var apiKey = 'AIzaSyBSymxDERhA6QPPPs38eaI2LR10r9i-Exs';
                var params = {
                    'location': location.lat+ ',' + location.lon,
                    'key': apiKey,
                    'size': '300x200'
                };
            
            var ajaxConfig = {
                url: baseUrl,
                dataType: "image/jpg",
                timeout: 5000,
                "data": params          
                };
            return ajaxConfig;
            })(), 
        function(response)
        {
                console.log('Google StreetView Handler');
                var htmlHolder = this.generateTempDivContainer();
                htmlHolder.append($('<img>').attr('src',response));
                console.log(response);
                return htmlHolder.html();
        },
        targetDom,
        'nytimes-articles'));
    /*
    this.ajaxArray.push(new LocationInfoDataSource('New York Times',
        (function() {
                var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
                var nyTimesApiKey = 'e7f4cd39938925b5b8319e5054a24442:13:22689669';
                var nyTimesData = {
                    'q': title,
                    'api-key': nyTimesApiKey
                };
            
            var ajaxConfig = {
                url: nyTimesBaseUrl,
                dataType: "json",
                timeout: 5000,
                "data": nyTimesData          
                };
            return ajaxConfig;
            })(), 
        function(response)
        {
                console.log('custom handler');
                var htmlHolder = this.generateTempDivContainer();
                response.response.docs.forEach(function(article) {
                    htmlHolder.append('<li>' + article.headline.kicker + '</li>');
                });
                console.log(response);
                return htmlHolder.html();
        },
        targetDom,
        'nytimes-articles'));  */
     // eventually i'll add in nearby coffee shops via google places api
     
      this.ajaxArray.push(new LocationInfoDataSource('Boston MBTA',
        (function() {
            //http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=wX9NwuHnZU2ToO7GmGR9uw&lat=42.346961&lon=-71.076640&format=json
                var baseUrl = "http://realtime.mbta.com/developer/api/v2/stopsbylocation";
                var queryParams = {
                  'lat': location.lat,
                  'lon': location.lon,
                  'api_key': 'wX9NwuHnZU2ToO7GmGR9uw',
                  'format': 'jsonp'
                };
            
            var ajaxConfig = {
                url: baseUrl,
                dataType: 'jsonp',
                jsonp: 'jsonpcallback',
                timeout: 5000,
                //headers: myHeaders,
                data: queryParams,
                cache: true
                };
            return ajaxConfig;
            })(), 
        function(response)
        {
                // d/results[]/Name,DistanceFromCenter
                console.log('custom handler');
                var htmlHolder = this.generateTempDivContainer();
                var maxStops = response.stop.length > 5 ? 5 : response.stop.length;
                for(var i = 0; i < maxStops; i++)
                {
                    htmlHolder.append('<li>' + response.stop[i].stop_name +' - ' + parseFloat(response.stop[i].distance).toFixed(2) + ' miles away' + '</li>');
                };
                console.log(response);
                return htmlHolder.html();
        },
        targetDom,
        'nytimes-articles'));    
};

// todo: move stuff out
var LocationInfoBox = function(marker, location, targetDom)
{
    this.marker = marker;
    this.locationAjaxCalls = new LocationAjaxCalls(marker.title, location, targetDom);
}

LocationInfoBox.prototype = {
  infoBoxOpened: function() {
      this.locationAjaxCalls.ajaxArray.forEach(function(singleAjax) {
          singleAjax.attachContainer();
          singleAjax.beginQuery();
      });
  },
  
  infoBoxClosed: function() {
      // todo: implement cleanup
  }  
};