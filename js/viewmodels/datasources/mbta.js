
var MBTADataSource = function (targetContainer, place) {
    this.dataSourceName = "Nearby MBTA Transit Stations"
    var ajaxConfig = (function () {
        var baseUrl = "http://realtime.mbta.com/developer/api/v2/stopsbylocation";
        var queryParams = {
            'lat': place.location.lat,
            'lon': place.location.lon,
            'api_key': 'MsAdhDdRBkqQMMw-PgjyDQ',
            'format': 'jsonp'
        };
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
    BaseDataSource.call(this, targetContainer, this.dataSourceName, ajaxConfig);
};

MBTADataSource.prototype = Object.create(BaseDataSource.prototype);
MBTADataSource.prototype.constructor = BaseDataSource;

// required implementation - creates template
MBTADataSource.prototype.dataContainerContents = function () {
    var template = '<ul class="mbta-list" data-bind="foreach: stationList"></ul>';
    // TODO: eventuallly i want to show the stations on the map, and when clicked on "draw a line" to it
    var station = '<li class="mbta-stop" data-bind="text: $parent.stationText($data)"></li>';

    var domToInsert = $(template);
    domToInsert.append($(station));
    return domToInsert;
};

// required implementation - data processing function
MBTADataSource.prototype.dataReceived = function (response) {
    console.log('processing MBTA response');
    try {
        var maxStops = response.stop.length > 5 ? 5 : response.stop.length;
        for (var i = 0; i < maxStops; i++) {
            this.stationList.push({
                stopName: response.stop[i].stop_name,
                distance: parseFloat(response.stop[i].distance).toFixed(2),
                location: {
                    lat: response.stop[i].stop_lat,
                    lon: response.stop[i].stop_lon
                }
            });
        };
        console.log(response);
        this.dataLoaded(true);
    }
    catch (err) {
        console.log(err);
        this.errorOccured(true);
    }
};

MBTADataSource.prototype.stationText = function (data) {
    return data.stopName + ' - ' + data.distance + ' miles away';
};