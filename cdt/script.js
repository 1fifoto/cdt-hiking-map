// helped me figure out how to pull data from google drive: https://www.youtube.com/watch?v=OS2Nj5G9cGs
var map;
var DATA_SERVICE_URL = "https://script.google.com/macros/s/AKfycbwjn948wW9AcS7MMf7rQFLeN8aQmP3lh_EWWufEllYr65ZBtCwI/exec?jsonp=plotDayPoints";
var dayPoints;
var markers = [];
var infowindow = new google.maps.InfoWindow({});
var zoomLevel = 9;

function initialize() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      zoom: 5,
      center: {lat: 40.836571, lng: -106.778603}, // midpoint of cdt at mile 1514
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });   

    // Borrowed from TrackLeaders website
    var kmlOptions = {
            clickable: false,
            map: map,
            preserveViewport: true,
            suppressInfoWindows: true
        };
        
    // look for an auxiliary file to show always along with base route kml
    // then load main file, so it's on top

    gx2 = new google.maps.KmlLayer("http://1fifoto.com/cdt/cdt2.kml",kmlOptions);     // look for a networked file, and if it exists, show that instead of the main prefix.kml

    gx = new google.maps.KmlLayer("http://1fifoto.com/cdt/cdt.kml",kmlOptions);

    var scriptElement = document.createElement('script');
    scriptElement.src = DATA_SERVICE_URL;
    document.getElementsByTagName('head')[0].appendChild(scriptElement);    
}

function plotDayPoints(dayPoints) {
	var path = []; // hiker path
    // start with i = 1 because first row has headers
    for (var i = 1; i < dayPoints.length; i++) {
        // only process rows that have a lat,lng
        if (!dayPoints[i][2]) {
            break;
        }
        var html = "";
        html += '<strong>' + dayPoints[0][0] + '</strong>: ' + dayPoints[i][0] + '<br/>'; // Day number
        var dateParts = dayPoints[i][1].split(" "); // e.g. Wed Apr 16 00:00:00 GMT-07:00 2014
        html += '<strong>' + dayPoints[0][1] + '</strong>: ' + dateParts[0] + ', ' + dateParts[1] + ' ' + dateParts[2] + ', ' + dateParts[5] + '<br/>'; // Date
        html += '<strong>' + dayPoints[0][2] + '</strong>: ' + dayPoints[i][2] + '<br/>'; // Latitude, longitude
        if (dayPoints[i][3]) {
        	html += '<strong>' + dayPoints[0][3] + '</strong>: ' + parseFloat(dayPoints[i][3]).toFixed(1) + '<br/>'; // Mileage
        }
        if (dayPoints[i][3]) {
        	html += '<strong>' + dayPoints[0][4] + '</strong>: ' + parseFloat(dayPoints[i][4]).toFixed(1) + '<br/>'; // Expected
        }
        if (dayPoints[i][3]) {
        	html += '<strong>' + dayPoints[0][5] + '</strong>: ' + parseFloat(dayPoints[i][5]).toFixed(1) + '<br/>'; // Banked
        }
        if (dayPoints[i][3]) {
        	html += '<strong>' + dayPoints[0][6] + '</strong>: ' + parseFloat(dayPoints[i][6]).toFixed(1) + '<br/>'; // Daily
        }
        if (dayPoints[i][3]) {
        	html += '<strong>' + dayPoints[0][7] + '</strong>: ' + parseFloat(dayPoints[i][7]).toFixed(1) + '<br/>'; // Average
        }
       	html += '<strong>' + dayPoints[0][8] + '</strong>: ' + dayPoints[i][8] // Comment
        var coords = dayPoints[i][2].split(",");
        var position = {lat: parseFloat(coords[0]), lng: parseFloat(coords[1])};
        path.push(position); // Add position to hiker path

        // display bubble with day number and shadow at position
        var icon = {
            url: 'http://chart.apis.google.com/chart?chst=d_bubble_text_small_withshadow&chld=bb|' + dayPoints[i][0] + '|FFFFFF|000000',
            anchor: new google.maps.Point(0, 42)
        };
        var marker = new google.maps.Marker({
            position: position,
            icon: icon,
            html: html
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.html);
            infowindow.open(map, this);
        });

        markers.push(marker);
    }

    // add hiker path to map
    var polyline = new google.maps.Polyline({
	    path: path,
	    geodesic: true,
	    strokeColor: '#CC00FF',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
    });

    polyline.setMap(map);

    // Select focus on first or last marker (enable one line or the other below)
    // focusMarker = 0; // first Marker
    focusMarker = markers.length-1; // last Marker

    // recenter map at first or last position
    var position = markers[focusMarker].getPosition();
    map.setCenter(position);
    map.setZoom(8); // default to every day

    // add markers to map
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }

    // automatically open the info window for the first or last marker
    google.maps.event.trigger(markers[focusMarker], 'click');

    google.maps.event.addListener(map, 'zoom_changed', function() {
        var mod;

        if (map.getZoom() >= 8) {
            mod = 1; // every day
        } else if (map.getZoom() == 7) {
            mod = 7; // every week
        } else if (map.getZoom() == 6) {
            mod = 7; // every week
        } else if (map.getZoom() == 5) {
            mod = 30; // every month
        } else if (map.getZoom() == 4) {
            mod = 30; // every month
        } else if (map.getZoom() <= 3) {
            mod = markers.length; // first and last days

        }

        for (i = 0; i < markers.length; i++) {
            if (i % mod == 0 || i == markers.length - 1) {
                markers[i].setMap(map);
            } else {
                markers[i].setMap(null);
            }
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

