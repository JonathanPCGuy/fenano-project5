// Defines the general VM for the infobox that is displayed when the marker is activated.
// Note that most of the heavy lifiting is done in the data sources classes.
var LocationInfoBox = function (place, parentNode) {

    var outerTemplate = '<div class="info-box-container-outer"><h2 class="datasource-title" data-bind="text:place.title"></h2>';
    var dataSourceContainer = '<div class="info-box-data-sources"></div>';	// this one holds all the data sources

    this.place = place;

    // build up the html elements to attach to the infobox div
    this.parentNode = parentNode;
    this.outerNode = $(outerTemplate);
    this.outerNode.append($('<!-- ko stopBinding: true -->'));
    this.dataSourceNode = $(dataSourceContainer);
    this.outerNode.append(this.dataSourceNode);
    this.outerNode.append($('<!-- /ko -->'));
    this.parentNode.append(this.outerNode);

    // attach all the data sources
    this.dataSource = [];
    this.dataSource.push(new WikipediaDataSource(this.dataSourceNode, this.place));
    this.dataSource.push(new MBTADataSource(this.dataSourceNode, this.place));
    ko.applyBindings(this, this.outerNode.get(0));
}

// adds the data source to the data source div, and starts the ajax calls to get data from data sources
LocationInfoBox.prototype.getData = function () {
    this.dataSource.forEach(function (singleDataSource) {
        singleDataSource.attachTemplate();
        singleDataSource.applyBindings();
    });

    this.dataSource.forEach(function (singleDataSource) {
        singleDataSource.startDataLoad();
    });
};