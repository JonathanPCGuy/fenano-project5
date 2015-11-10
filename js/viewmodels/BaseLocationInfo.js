var BaseLocationInfo = function(parentContainer, dataSourceName, ajaxConfig) {
	this.dataLoaded = ko.observable(false);
	this.errorOccured = ko.observable(false);
	this.parentContainer = parentContainer;
	this.dataSourceName = dataSourceName;
	this.ajaxConfig = ajaxConfig;
};

BaseLocationInfo.prototype.attachTemplate = function() {
	var container = '<div class="datasource-container"><h2 data-bind="text: dataSourceName"></h2></div>';
	var loadingContainer = '<div class="datasource-loading" data-bind="if: showLoadingContainer()">Loading data...</div>';
	var errorContainer = '<div class="datasource-error" data-bind="if: errorOccured()">Error occured loading data.</div>';
	var dataContainer = '<div class="datasource-data" data-bind="if: dataLoaded()"></div>';
	
	// attach all the things
	this.containerElement = $(container);
	this.containerElement.append($(loadingContainer));
	this.containerElement.append($(errorContainer));
	var dataContainerDom = $(dataContainer);
	dataContainerDom.append(this.dataContainerContents());
	this.containerElement.append(dataContainerDom);
	this.parentContainer.append(this.containerElement);
};

// maybe i don't need this and I use with to bind directly?
BaseLocationInfo.prototype.applyBindings = function() {
	ko.applyBindings(this, this.containerElement.get(0));	
};

BaseLocationInfo.prototype.showLoadingContainer = function() {
	return ko.computed(function() {
	// will it pass in param? need to try out...
		return !(this.dataLoaded() || this.errorOccured());	
	}, this, {deferEvaluation: true});
};

BaseLocationInfo.prototype.startDataLoad = function() {
	// call the associated ajax function
	var self = this;
	 $.ajax(this.ajaxConfig)//.fail(function(x,t,m) {
		.done(function(response) {
			// pass into view model
			// error?
			self.dataReceived(response);
		})
		.error(function(x, status, error) {
			self.errorOccured(true);
		});
};