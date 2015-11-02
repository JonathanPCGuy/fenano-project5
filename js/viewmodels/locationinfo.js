
var infoWindowContent = '<div class="my-info-window" id="infowindow-%data%"></div>';
var infoWindowId = '#infowindow-%data%';

var LocationInfo = function(parentNode, className, formatFunction)
{
	var template = '<div class="' + this.containerClassName +'" data-bind="html: formattedHtml"></div>';
	var targetNode = $(template);
	$(parentNode).append(targetNode);
	this.response = ko.observable();
	this.formatFunction = formatFunction;
	this.formattedHtml = ko.computed(this.generateHtml, this);
	ko.applyBindings(this, targetNode.get(0));
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