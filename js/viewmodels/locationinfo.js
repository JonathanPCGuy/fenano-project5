var LocationInfo = function(formatFunction)
{
	//this.formattedOutput '');
	this.response = ko.observable(null);
	this.formatFunction = formatFunction;
	this.formattedHtml = ko.computed(this.generateHtml, this);	
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
		// to do: better define errors
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