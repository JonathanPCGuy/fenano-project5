// starting code is the ajax code from the mini course on ajax


// function that provides a framework for third party apis to be queried
// when a location marker is activated
var LocationInfoAjax = function(sourceName, ajaxConfig, formatFunction, targetDomId, containerClassName) {
    this.sourceName = sourceName;
    this.ajaxConfig = ajaxConfig;
    this.ajaxConfig.context = this;
    this.formatFunction = formatFunction;
    this.targetDomId = targetDomId;
    this.containerClassName = containerClassName;
    this.context = this;
    this.bindings = null;

};

LocationInfoAjax.prototype = {
	
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
    this.ajaxArray.push(new LocationInfoAjax('New York Times',
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
                    htmlHolder.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                });
                console.log(response);
                return htmlHolder.html();
        },
        targetDom,
        'nytimes-articles'));
      
      // future goal: make this all param somehow?
      this.ajaxArray.push(new LocationInfoAjax('Starbucks',
        (function() {
            var baseUrl = 'https://testhost.openapi.starbucks.com/location/v2/stores/nearby';
            var paramData = {
                'latlng': location.lat+ ',' + location.lon,
                'radius': 5
            };
            
            var ajaxConfig = {
                url: baseUrl,
                dataType: "json",
                timeout: 5000,
                "data": paramData          
                };
            return ajaxConfig;
            })(), 
        function(response)
        {
                console.log('custom handler - starbucks test api');
                var htmlHolder = this.generateTempDivContainer();
                var maxStores = response.stores.length > 5 ? 5 : response.stores.length;
                for(var i = 0; i < maxStores; i++)
                {
                    htmlHolder.append('<li>' + response.stores[i].store.name + ' - ' + response.stores[i].store.address.streetAddressLine1 + '</li>');
                }
                console.log(response);
                return htmlHolder.html();
        },
        targetDom,
        'starbucks-nearby'));    
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