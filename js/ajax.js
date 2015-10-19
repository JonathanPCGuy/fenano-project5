// starting code is the ajax code from the mini course on ajax

// function that provides a framework for third party apis to be queried
// when a location marker is activated
var LocationInfoAjax = function(sourceName, ajaxConfig, ajaxSuccess, targetDomId, containerClassName) {
    this.sourceName = sourceName;
    this.ajaxConfig = ajaxConfig;
    this.ajaxConfig.context = this;
    this.ajaxSuccess = ajaxSuccess; // rename and clean up all of this, get ready for knockout
    this.targetDomId = targetDomId;
    this.containerClassName = containerClassName;
    this.container = null;
    this.context = this;
};

LocationInfoAjax.prototype = {
	
    //self: this, <- this is not seen, probably more iffe stuff
    // not sure if specify here or in the ajax. probably here?
    attachContainer: function() {
        this.container = $('<div class="' + this.containerClassName +'"</div>');
         $(this.targetDomId).append(this.container);
        
    },
	beginQuery: function() {
        console.log('trying to make an ajax call');
                    // success /formatting function, tbd
            $.ajax(this.ajaxConfig)//.fail(function(x,t,m) {
       //     self.onErrorResult(); // to make this work i need to iffe. come back to this later
       // jquery docs says success will be deprecated, not sure if config sucess callback is still ok?
                .done(function(response) {
                           this.ajaxSuccess(response, this.context);
                            // finally attached it to the dom!
                });
    },
    onProcessing: function() {
        // todo: show spinner for dom
    },
	// format results
	onErrorResult: function() {
      // any way to go through viewmodel?
      //hmm couldn't see this function?
      $(this.targetDom).text('<p>Error trying to get data from datasource.</p>'); 
    }
};

var LocationAjaxCalls = function(title, location, targetDom)
{
    //var self = this;
    this.ajaxArray = [];
    // this will need to be moved to an init js of sorts
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
                // Tell nytimes what we want and that we want JSON
                "data": nyTimesData          
                };
            return ajaxConfig;
            })(), 
        function(response, context)
        {
                    // custom handler
                console.log('custom handler');
                //var articleListContainer = $('<div class="nytimes-articles"></div>');
                // ok this is not seeing the reference dom
                    response.response.docs.forEach(function(article) {
                        context.container.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                    });
                    console.log(response);
                // finally attached it to the dom!
                //$(this.targetDomId).append(articleListContainer)

        },
        targetDom,
        'nytimes-articles'));
      
      // future goal: make this all param somehow?
      this.ajaxArray.push(new LocationInfoAjax('Starbucks',
        (function() {
            //make ajax config function 
                var baseUrl = 'https://testhost.openapi.starbucks.com/location/v2/stores/nearby';
                var paramData = {
                    'latlng': location.lat+ ',' + location.lon,
                    'radius': 5
                };
            
            var ajaxConfig = {
                url: baseUrl,
                dataType: "json",
                timeout: 5000,
                // Tell nytimes what we want and that we want JSON
                "data": paramData          
                };
            return ajaxConfig;
            })(), 
        function(response, context)
        {
                    // custom handler
                console.log('custom handler - starbucks test api');
                //var nearbyStarbucksContainer = $('<div class="starbucks-nearby"></div>');
                    response.stores.forEach(function(singleStore) { // should sort by distance
                        context.container.append('<li>' + singleStore.store.name + ' - ' + singleStore.store.address.streetAddressLine1 + '</li>');
                    });
                    console.log(response);
                // finally attached it to the dom!
                //$(this.targetDomId).append(nearbyStarbucksContainer)

        },
        targetDom,
        'starbucks-nearby'));      
};

var LocationInfoBox = function(marker, location, targetDom)
{
    // todo: dom order
    // this marker doesn't work?
    this.marker = marker;
    this.locationAjaxCalls = new LocationAjaxCalls(marker.title, location, targetDom);
}

// this is kind of like a view model
// todo: move dom stuff to here
LocationInfoBox.prototype = {
  infoBoxOpened: function() {
      // start all the ajax calls, async (need to read up on workers)
      // for now just do sync
      // todo: wrap function
      this.locationAjaxCalls.ajaxArray.forEach(function(singleAjax) {
          singleAjax.attachContainer();
          singleAjax.beginQuery();
      });
  },
  
  infoBoxClosed: function() {
      // stop?! prevent writing? how to do...
  }  
};