// starting code is the ajax code from the mini course on ajax

// to research: how to load in ajax options without invoking it immediately
// so what we'll do is wrap up a common object that we plug in ajax config and callbacks on
// how to process the response. errors will be supplied
// this should make it easier to add new sources of data since they'll only deal
// with certain APIs
var LocationInfoAjax = function(sourceName, ajaxConfig, ajaxSuccess, targetDomId) {
    this.sourceName = sourceName;
    this.ajaxConfig = ajaxConfig;
    this.ajaxConfig.context = this;
    this.ajaxSuccess = ajaxSuccess;
    //this.onSuccess = onSuccess;
    this.targetDomId = targetDomId;	
};

LocationInfoAjax.prototype = {
	
    //self: this, <- this is not seen, probably more iffe stuff
    // not sure if specify here or in the ajax. probably here?
	beginQuery: function() {
        console.log('trying to make an ajax call');
                    // success /formatting function, tbd
            $.ajax(this.ajaxConfig)//.fail(function(x,t,m) {
       //     self.onErrorResult(); // to make this work i need to iffe. come back to this later
       // jquery docs says success will be deprecated, not sure if config sucess callback is still ok?
                .done(function(response) {
                           this.ajaxSuccess(response);
                            // finally attached it to the dom!
                });
    },
    
    //internalBeginQuery: {},
    
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


// JSONP sucks!
// simple solution: wrap into func and point to instance
// jsonp is annoying
// need to look at bind stuff later
/*
var svc_search_v2_articlesearch = function (response) {
                    console.log("in global callback");
                    var articleListContainer = $.create('<div id="#nytimes-articles"></div>');
                    response.response.docs.forEach(function(article) {
                        articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                    });
                    console.log(response);
                    this.targetDom.append(articleListContainer);
                }*/

var LocationAjaxCalls = function(title, targetDom)
{
    //var self = this;
    this.ajaxArray = [];
    // this will need to be moved to an init js of sorts
    this.ajaxArray.push(new LocationInfoAjax('New York Times',
        (function() {
            //make ajax config function 
                var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
                var nyTimesApiKey = 'e7f4cd39938925b5b8319e5054a24442:13:22689669';
                var callbackTarget = "svc_search_v2_articlesearch";
                /*
                ,
                    'callback': callbackTarget
                */
                var nyTimesData = {
                    'q': title,
                    'api-key': nyTimesApiKey
                };
                //var self = this;
            //http://stackoverflow.com/questions/12864096/can-i-make-a-jquery-jsonp-request-without-adding-the-callback-parameter-in-u
            //var svc_search_v2_articlesearch = function () {
                /*
                    console.log("in specified callback (not sure which one is actually needed)");
                    var articleListContainer = $('<div id="#nytimes-articles"></div>');
                    response.response.docs.forEach(function(article) {
                        articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                    });
                    console.log(response);
                    this.targetDom.append(articleListContainer);*/
                //}
            
            var ajaxConfig = {
                url: nyTimesBaseUrl,
            
                // The name of the callback parameter, as specified by the nytimes service
                // todo: better understand this
                //jsonp: false,//"svc_search_v2_articlesearch",
                //jsonpCallback: callbackTarget,
                //context:self,
                //context:this,
                // Tell jQuery we're expecting JSONP
                dataType: "json",
                timeout: 5000,
                // Tell nytimes what we want and that we want JSON
                "data": nyTimesData/*,
                
                'success': function(response) {
                                        console.log("in ajax config callback (not sure which one is actually needed)");
                    var articleListContainer = $('<div id="#nytimes-articles"></div>');
                    response.response.docs.forEach(function(article) {
                        articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                    });
                    console.log(response);
                    this.targetDom.append(articleListContainer);
                }*/
                
                
                
                //,
                /*
                error: function(x, t, m) {
                    if(t==="timeout") {
                        this.onError(); // context? only just timeout? other errors to cover?
                    }
                },*//*
                'success': function(response) {
                    console.log('from the ajax callback');
                    var articleListContainer = $.create('<div id="#nytimes-articles"></div>');
                        response.response.docs.forEach(function(article) {
                            articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                        });
                        console.log(response);
                    // finally attached it to the dom!
                    $(self.targetDom).append(articleListContainer);*/
                //}               
                };
            return ajaxConfig;
            })(), 
        function(response)
        {
                    // custom handler
                console.log('custom handler');
                var articleListContainer = $('<div id="#nytimes-articles"></div>');
                    response.response.docs.forEach(function(article) {
                        articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                    });
                    console.log(response);
                // finally attached it to the dom!
                $(this.targetDomId).append(articleListContainer)

        },
        targetDom));
 /*
this.ajaxArray.push(new LocationInfoAjax('Wikipedia',null, 
        function() {
            //ajax function    
        },
        function()
        {
            // success /formatting function
        },
        targetDom));  
        */
};

var LocationInfoBox = function(marker, targetDom)
{
    // todo: dom order
    this.marker = marker;
    this.locationAjaxCalls = new LocationAjaxCalls(marker.title, targetDom);
}

LocationInfoBox.prototype = {
  infoBoxOpened: function() {
      // start all the ajax calls, async (need to read up on workers)
      // for now just do sync
      // todo: wrap function
      this.locationAjaxCalls.ajaxArray.forEach(function(singleAjax) {
          singleAjax.beginQuery();
      });
  },
  
  infoBoxClosed: function() {
      // stop?! prevent writing? how to do...
  }  
};
// phase 1 - hardcode to Houston, TX as query string, don't go through mvvm. no pretty loading
// phase 2 - use location marker title as query string, don't go through mvvm. pretty loading?
// phase 3 - go through mvvm


// one object for everything
/*
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetviewKey = "AIzaSyBSymxDERhA6QPPPs38eaI2LR10r9i-Exs";
    // YOUR CODE GOES HERE!
    var baseUrl = "https://maps.googleapis.com/maps/api/streetview";
    var city = $('#city').val();
    var location = $('#street').val() + "," + $('#city').val();
    var data = {
      "location": location,
      "size": "640x480",
      key: streetviewKey  
    };
    
    var targetUrl = baseUrl + '?' + $.param(data);
    
    var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.jsonp';
    var nyTimesApiKey = 'e7f4cd39938925b5b8319e5054a24442:13:22689669';
    var callbackTarget = "svc_search_v2_articlesearch";
    var nyTimesData = {
        'q': location,
        'api-key': nyTimesApiKey,
        'callback': callbackTarget
    };
    
    var targetNyTimesUrl = nyTimesBaseUrl;// + '?' + $.param(nyTimesData);
    // Using YQL and JSONP
    $.ajax({
        url: nyTimesBaseUrl,
     
        // The name of the callback parameter, as specified by the nytimes service
        // todo: better understand this
        jsonp: callbackTarget,
     
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        timeout: 5000,
        // Tell nytimes what we want and that we want JSON
        "data": nyTimesData,
        
        error: function(x, t, m) {
            if(t==="timeout") {
                $nytElem.append('<p>Unable to get articles from NYTimes.</p>');
            }
        },
         'success': function(response) {
             console.log('from the ajax callback');
               var articleListContainer = $('#nytimes-articles');
                response.response.docs.forEach(function(article) {
                    articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
                });
                console.log(response);
         }
    });
    
    var wikiBaseUrl = 'http://en.wikipfjeiwofjewiofjewiofjiweofjiweojfowiedia.org/w/api.php';
    var wikiParams = {
      'action': 'query',
      'prop': 'info',
      'format': 'json',
      'inprop': 'url',
      'titles': city   
    };
    
    //TODO: understand jsonp better
    

    
    $.ajax({
        'url': wikiBaseUrl,
        //'jsonp': wikiCallback,
        dataType: 'jsonp',
        'data': wikiParams,
        'success': function(response) {
            console.log(response);
            console.log("in wiki success");
            Object.keys(response.query.pages).forEach(function(wikiPage) {
                $wikiElem.append('<li><a href="' + response.query.pages[wikiPage].fullurl + '">' +response.query.pages[wikiPage].title + '</a></li>'); 
            });
        }
    });
    /*
    $.ajax({
       "url": baseUrl,
       'method': "GET",
       "data": data,
       success: function() {
           // get string to image from response
           
           $body.
       } 
    });
    // set background
    $body.append('<img class="bgimg" src="' + targetUrl + '">');
    return false;
};


function svc_search_v2_articlesearch(response) {
    console.log("in callback");
    var articleListContainer = $('#nytimes-articles');
    response.response.docs.forEach(function(article) {
        articleListContainer.append('<li>' + article.headline.kicker + ' - ' + article.headline.main + '</li>');
    });
    console.log(response);
};


$('#form-container').submit(loadData);
*/