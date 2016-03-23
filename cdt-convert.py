#! /usr/bin/env python
import xml.etree.ElementTree as ET
import re, sys
from math import radians, cos, sin, asin, sqrt

if len(sys.argv) == 3:
    current_latitude = float(sys.argv[1])
    current_longitude = float(sys.argv[2])
elif len(sys.argv) == 2:
    current_latitude, current_longitude = [float(x) for x in sys.argv[1].split(',')]
else:
    exit('Requires command line arguments: <latitude> <longitude> or <latitude,longitude>')

# from http://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points
def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2.)**2 + cos(lat1) * cos(lat2) * sin(dlon/2.)**2
    c = 2. * asin(sqrt(a)) 

    # 3963.1676 mi is the radius of the Earth
    mi = 3963.1676 * c
    return mi

tree = ET.parse('doc.kml')
root = tree.getroot()

shortest_distance = None
shortest_waypoint = None
shortest_longitude = None
shortest_latitude = None

# Enable following line for output of cdt_waypoints in index.php
# print '$cdt_waypoints = array('
for placemark in root.iter('{http://www.opengis.net/kml/2.2}Placemark'):
    name = placemark.find('{http://www.opengis.net/kml/2.2}name')
    # there are other placemarks, we only want the ones that look like mile markers, e.g. 0156, 2668-5
    if name is not None and re.match('\d{4}(\-5)?', name.text) is not None:
        waypoint = name.text
        coordinates = placemark.find('{http://www.opengis.net/kml/2.2}Point/{http://www.opengis.net/kml/2.2}coordinates')
        if coordinates is not None:
            # coordinates have the following format: "longitude,latitude,0", e.g. -119.558163,37.727157,0
            longitude, latitude = [float(x) for x in coordinates.text.split(',')][:2]
            # Enable following line for output of cdt_waypoints in index.php
            # print 'array(' , waypoint.replace("-",".") , ',', latitude, ',', longitude, '),'
            distance = haversine(current_longitude, current_latitude, longitude, latitude)
            if shortest_distance is None or distance < shortest_distance:
                shortest_distance = distance
                shortest_waypoint = waypoint
                shortest_latitude = latitude
                shortest_longitude = longitude
# Enable following line for output of cdt_waypoints in index.php
# print ');'

print shortest_waypoint, str(shortest_latitude) + ',' + str(shortest_longitude), str(round(shortest_distance,1)) + 'mi'
