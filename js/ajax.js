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
         this.bindings = new LocationInfo(this.sourceName, this.targetDomId, this.containerClassName, this.formatFunction);
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
    
    this.ajaxArray.push(new LocationInfoDataSource('Wikipedia',
        (function() {
                var baseUrl = 'https://en.wikipedia.org/w/api.php';
                //var apiKey = 'AIzaSyBSymxDERhA6QPPPs38eaI2LR10r9i-Exs';
                var params = {
                    'action': 'opensearch',
                    'search': title,
                    'format': 'json',
                    'namespace': '0',
                    'limit': '1'
                };
            
            var ajaxConfig = {
                url: baseUrl,
                dataType: "jsonp",
                timeout: 5000,
                "data": params,
                headers: { 'Api-User-Agent': 'JLam FE Nano Degree/1.0; jonlam+dev@gmail.com' },          
                };
            return ajaxConfig;
            })(), 
        function(response)
        {
                console.log('Wikipedia handler');
                var htmlHolder = this.generateTempDivContainer();
                // verify there's ane entry in the search; need to get the title
                if(response[1].length > 0)
                {
                    htmlHolder.append($('<p></p>').text(response[2][0]));
                    //console.log(response);
                }
                else
                {
                    // no wiki article
                    htmlHolder.append($('<p></p>').text('No wiki article found.'));
                }
                return htmlHolder.html();
        },
        targetDom,
        'wikipedia-snippit'));

      this.ajaxArray.push(new LocationInfoDataSource('Boston MBTA',
        (function() {
            //http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=wX9NwuHnZU2ToO7GmGR9uw&lat=42.346961&lon=-71.076640&format=json
                var baseUrl = "http://realtime.mbta.com/developer/api/v2/stopsbylocation";
                var queryParams = {
                  'lat': location.lat,
                  'lon': location.lon,
                  'api_key': 'wX9NwuHnZU2ToO7GmGR9uw', //todo: replace with my real key
                  'format': 'jsonp'
                };
            // todo: put in real api key
            var ajaxConfig = {
                url: baseUrl,
                dataType: 'jsonp',
                jsonp: 'jsonpcallback',
                timeout: 5000,
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
        'mbta-stations'));    
};

// todo: move stuff out
var LocationInfoBox = function(title, location, targetDom)
{
    this.title = title;
    this.targetDom = targetDom;
    this.locationAjaxCalls = new LocationAjaxCalls(title, location, targetDom);
}

LocationInfoBox.prototype = {
  infoBoxOpened: function() {
      // for now i'll set it directly here, but i'll move to mvvm later
      // i think though i need to improve the ui and then come back to mvvm
      $(this.targetDom).append($('<h1>' + this.title + '</h1>'));
      this.locationAjaxCalls.ajaxArray.forEach(function(singleAjax) {
          singleAjax.attachContainer();
          singleAjax.beginQuery();
      });
  },
  
  infoBoxClosed: function() {
      // todo: implement cleanup
  }  
};