var infoWindowContent = '<div class="my-info-window" id="infowindow-%data%"></div>';
var infoWindowId = '#infowindow-%data%';

var LocationInfoBox = function(place, parentNode)
{
	this.place = place;
	this.parentNode = parentNode;
	var outerTemplate = '<div class="info-box-container-outer"><h2 class="datasource-title" data-bind="text:place.title"></h2>';
	this.outerNode = $(outerTemplate);
	this.outerNode.append($('<!-- ko stopBinding: true -->'));
	var dataSourceContainer = '<div class="info-box-data-sources"></div>';	// this one holds all the data sources
	this.dataSourceNode = $(dataSourceContainer);
	this.outerNode.append(this.dataSourceNode);
	this.outerNode.append($('<!-- /ko -->'));
	this.parentNode.append(this.outerNode);
	this.dataSource = [];
	// attach all the data sources
	this.dataSource.push(new MBTADataSource(this.dataSourceNode, this.place));
	ko.applyBindings(this, this.outerNode.get(0));
}

LocationInfoBox.prototype.getData = function() {
	this.dataSource.forEach(function(singleDataSource) {
		singleDataSource.attachTemplate();
		singleDataSource.applyBindings();
	});	
	
	this.dataSource.forEach(function(singleDataSource) {
		singleDataSource.startDataLoad();
	});	
};