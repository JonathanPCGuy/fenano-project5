// base class for data sources in the info box
// all data sources derive from the class and implement necessary functions
// see dervived classes (mbta.js, wikipedia.js) for examples
var BaseDataSource = function (parentContainer, dataSourceName, ajaxConfig) {
    this.dataLoaded = ko.observable(false);
    this.errorOccured = ko.observable(false);
    this.parentContainer = parentContainer;
    this.dataSourceName = dataSourceName;
    this.ajaxConfig = ajaxConfig;
};

// attaches the data source's template to the parent dom so loading, formatted data, or errors can be displayed
BaseDataSource.prototype.attachTemplate = function () {
    var container = '<div class="datasource-container"><h2 data-bind="text: dataSourceName"></h2></div>';
    var loadingContainer = '<div class="datasource-loading" data-bind="if: showLoadingContainer()">Loading data...</div>';
    var errorContainer = '<div class="datasource-error" data-bind="if: errorOccured()">Error occured loading data.</div>';
    var dataContainer = '<div class="datasource-data" data-bind="if: dataLoaded()"></div>';

    this.containerElement = $(container);
    this.containerElement.append($(loadingContainer));
    this.containerElement.append($(errorContainer));
    var dataContainerDom = $(dataContainer);
    dataContainerDom.append(this.dataContainerContents());
    this.containerElement.append(dataContainerDom);
    this.parentContainer.append(this.containerElement);
};

BaseDataSource.prototype.applyBindings = function () {
    ko.applyBindings(this, this.containerElement.get(0));
};

// determines whether to show the loading data message or not
BaseDataSource.prototype.showLoadingContainer = function () {
    return ko.computed(function () {
        return !(this.dataLoaded() || this.errorOccured());
    }, this, { deferEvaluation: true });
};

BaseDataSource.prototype.startDataLoad = function () {
    // call the associated ajax function
    var self = this;
    $.ajax(this.ajaxConfig)
        .done(function (response) {
            self.dataReceived(response);
        })
        .error(function (x, status, error) {
            self.errorOccured(true);
        });
};