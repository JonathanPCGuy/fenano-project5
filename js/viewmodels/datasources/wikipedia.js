var WikipediaDataSource = function (targetContainer, place) {
    this.dataSourceName = "Wikipedia"
    this.articleSummary = ko.observable("");
    var ajaxConfig = (function () {
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
    BaseDataSource.call(this, targetContainer, this.dataSourceName, ajaxConfig);
};

WikipediaDataSource.prototype = Object.create(BaseDataSource.prototype);
WikipediaDataSource.prototype.constructor = BaseDataSource;

// required implementation - creates template
WikipediaDataSource.prototype.dataContainerContents = function () {
    var templateArticle = '<div data-bind="text: articleSummary"></div>';
    var domToInsert = $(templateArticle);
    return domToInsert;
};

// required implementation - data processing function
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