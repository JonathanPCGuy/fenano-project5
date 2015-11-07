
var infoWindowContent = '<div class="my-info-window" id="infowindow-%data%"></div>';
var infoWindowId = '#infowindow-%data%';

var LocationInfo = function(sourceName, parentNode, className, formatFunction)
{
	this.sourceName = ko.observable(sourceName);
	// need outer container so the source of info can be IDed
	var outerTemplate = '<div class="' + this.containerClassName +'-outer"><h2 class="datasource-title" data-bind="text:sourceName"></h2>';
	var template = '<div class="' + this.containerClassName +'" data-bind="html: formattedHtml"></div>';
	var outerNode = $(outerTemplate);
	var targetNode = $(template);
	outerNode.append(targetNode);
	$(parentNode).append(outerNode);
	this.response = ko.observable();
	this.formatFunction = formatFunction;
	this.formattedHtml = ko.computed(this.generateHtml, this);
	
	ko.applyBindings(this, outerNode.get(0));
	// if i want to move this in here then i need to attach it to the dom	
};

LocationInfo.prototype.generateHtml = function()
{
	if(this.response() == null)
	{
		return '<p>Loading data</p>';
	}
	var result = this.formatFunction(this.response());
	if(result == '')
	{
		// to do: better define & display errors
		return '<p>Error loading data</p>';
	}
	else
	{
		return result;
	}
};

LocationInfo.prototype.generateTempDivContainer = function() {
	return $('<div class="container"></div>');
};

LocationInfo.prototype.cleanup = function() {
	// detach and stop listening
};