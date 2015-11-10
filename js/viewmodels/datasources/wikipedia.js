var WikipediaDataSource = function (targetContainer, place) {
	this.dataSourceName = "Wikipedia"
	this.articleSummary = ko.observable("");
	var ajaxConfig = (function () {
		//http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=wX9NwuHnZU2ToO7GmGR9uw&lat=42.346961&lon=-71.076640&format=json
		var baseUrl = 'https://en.wikipedia.org/w/api.php';
		var params = {
			'action': 'opensearch',
			'search': place.title,
			'format': 'json',
			'namespace': '0',
			'limit': '1',
			'redirects': 'resolve'
		};

		var ajaxConfig = {
			url: baseUrl,
			dataType: "jsonp",
			timeout: 5000,
			"data": params,
			headers: { 'Api-User-Agent': 'JLam FE Nano Degree/1.0; jlampcguy+dev@gmail.com' },
		};
		return ajaxConfig;
	})();
	this.articleSummary = ko.observable();
	this.noSummaryAvailable = ko.observable(false);
	BaseLocationInfo.call(this, targetContainer, this.dataSourceName, ajaxConfig);
};

WikipediaDataSource.prototype = Object.create(BaseLocationInfo.prototype);
WikipediaDataSource.prototype.constructor = BaseLocationInfo;

// required implementation - creates template
WikipediaDataSource.prototype.dataContainerContents = function () {
	var templateArticle = '<div data-bind="text: articleSummary"></div>';
	// todo: figure this out!
	var domToInsert = $(templateArticle);
	return domToInsert;
};

WikipediaDataSource.prototype.dataReceived = function (response) {
	console.log('processing Wikipedia response');
	
	try {
		if (response[1].length > 0) {
			this.articleSummary(response[2][0]);

		}
		else {
			this.articleSummary("No Wikipedia article summary found.");
		}
		this.dataLoaded(true);
	}
	catch (err) {
		console.log(err);
		this.errorOccured(true);
	}
};