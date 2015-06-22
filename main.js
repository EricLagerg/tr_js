// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/maps/google_maps_api_v3_11.js
// ==/ClosureCompiler==

var map;
function initialize() {
	var mapOptions = {
		zoom: 13, // something like 8 for entire state.
		// center: {lat: 47.2500, lng: -120.1000} // WA coords.
		center: {lat: 47.7717, lng: -122.2044}
  	};

  	map = new google.maps.Map(document.getElementById('map-canvas'),
  		mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);

window.onload = function() {
	'use strict';

	/**
	 * NewData does stuff.
	 * @constructor
	 */
	function NewData(data, map) {
		if (typeof data === 'undefined' ||
			typeof map === 'undefined') {
			throw "No data object or map given.";
		}

		/* Having the JSON response give us a length would be sooo
			much better than having to get it ourselves... */
		var len = data["StateVoterID"].length,
			index = 0;

		/**
		 * get_lat_lng retrieves the latitude and longitude for the next
		 * index in the list list of people.
		 *
		 * @param  {Number}      i the index of the latitude and longitude
		 *                         in the data object.
		 * @return {Object|null}   a generic object holding the latitude
		 *					       and longitude of a person's residence.
		 */
		var get_lat_lng = function(i) {
			if (i >= len) {
				return null;
			}

			var lat = data["Latitude"][i],
				lng = data["Longitude"][i];

			if (!lat || !lng) {
				return null;
			}

			return {
				lat: lat,
				lng: lng
			};
		};

		/**
		 * get_full_name retrieves the full name for the next index in the
		 * list of people.
		 *
		 * @param  {Number}      i the index of the person in the data object.
		 * @return {String|null}   a person's name.
		 */
		var get_full_name = function(i) {
			if (i >= len) {
				return null;
			}

			return data["FullName"][i];
		};

		/**
		 * new_marker creates a new marker for the given map.
		 *
		 * @return {Object|Number|null} a google.maps.Marker{} object.
		 */
		this.new_marker = function() {

			if (index >= len) {

				// TODO: I don't like this.
				return -1;
			}

			index++;

			var pos = get_lat_lng(index),
				name = get_full_name(index);

			if (!pos || !name) {
				return null;
			}

			return new google.maps.Marker({
				position: pos,
				map:      map,
				title:    name
			});
		};
	}

	/**
	 * ajax returns the JSON object from the given URL.
	 *
	 * @param  {String} url the url to retrieve the object from.
	 * @return {Object}     a valid JSON object or null if the object
	 *					    doesn't exist or isn't well-formed JSON.
	 */
	function ajax(url) {
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.send(null);

		return JSON.parse(req.responseText);
	}

	// Secret gist with the data. Too lazy to do anything else right now.
	var gist_url = "https://gist.githubusercontent.com/EricLagerg/c8068a2ebfe678e258d4/raw/2b0a4d795a46843744d357c594de61c1fbe28ee0/gistfile1.txt",
		gist_data = ajax(gist_url),
		data = new NewData(gist_data, map);

	while(data.new_marker() !== -1) {};
}

window.onunload = function() { /* disable caching */ };