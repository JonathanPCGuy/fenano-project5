 var MBTADataSource = function(targetContainer, place) {
	 this.dataSourceName = "Neary MBTA Transit Stations"
	 var ajaxConfig = (function() {
            //http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=wX9NwuHnZU2ToO7GmGR9uw&lat=42.346961&lon=-71.076640&format=json
			var baseUrl = "http://realtime.mbta.com/developer/api/v2/stopsbylocation";
			var queryParams = {
				'lat': place.location.lat,
				'lon': place.location.lon,
				'api_key': 'wX9NwuHnZU2ToO7GmGR9uw', //todo: replace with my real key
				'format': 'jsonp'
			};
            // todo: put in real api key
            var ajaxConfig = {
                url: baseUrl,
                dataType: 'jsonp',
                jsonp: 'jsonpcallback',
                timeout: 5000,
                data: queryParams,
                cache: true
                };
            return ajaxConfig;
            })();
	 this.stationList = ko.observableArray([]);
	 BaseLocationInfo.call(this, targetContainer, this.dataSourceName, ajaxConfig);
 };
 
 MBTADataSource.prototype = Object.create(BaseLocationInfo.prototype);
 MBTADataSource.prototype.constructor = BaseLocationInfo;
 
 // required implementation - creates template
 MBTADataSource.prototype.dataContainerContents = function() {
	 var template = '<ul class="mbta-list" data-bind="foreach: stationList"></ul>';
	 // eventuallly i want to show the stations on the map, and when clicked on "draw a line" to it
	 var station = '<li class="mbta-stop"><a href="#" data-bind="text: $parent.stationText($data)"></a></li>';
	 
	 var domToInsert = $(template);
	 domToInsert.append($(station));
	 return domToInsert;
 };
 
 MBTADataSource.prototype.dataReceived = function(response) {
	console.log('processing MBTA response');
	try
	{
		var maxStops = response.stop.length > 5 ? 5 : response.stop.length;
		for(var i = 0; i < maxStops; i++)
		{
			this.stationList.push({
				stopName: response.stop[i].stop_name, 
				distance: parseFloat(response.stop[i].distance).toFixed(2),
				location: 	{
							lat: response.stop[i].stop_lat,
							lon: response.stop[i].stop_lon
							} 
				});
		};
		console.log(response);
		this.dataLoaded(true);
	}
	catch(err)
	{
		console.log(err);
		this.errorOccured(true);
	}	 
 };
 
 MBTADataSource.prototype.stationText = function(data) {
	 return data.stopName + ' - ' + data.distance + ' miles away';
 };