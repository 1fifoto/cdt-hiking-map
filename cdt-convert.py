#! /usr/bin/env python
import xml.etree.ElementTree as ET
import re, sys, os
from math import radians, cos, sin, asin, sqrt

if len(sys.argv) <= 1:
    exit('Requires command line arguments: <list of filenames>')

print '$cdt_waypoints = array('
for filename in sys.argv[1:]:
	tree = ET.parse(filename)
	root = tree.getroot()
	file = '"'+os.path.basename(filename)+'"'
	for wpt in root.iter('{http://www.topografix.com/GPX/1/1}wpt'):
		latitude = wpt.attrib['lat']
		longitude = wpt.attrib['lon']
		name = wpt.find('{http://www.topografix.com/GPX/1/1}name')
		waypoint = '"'+name.text+'"'
		print 'array(', file, ',', waypoint, ',', latitude, ',', longitude, '),'
print ');'
