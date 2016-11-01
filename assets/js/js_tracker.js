	if (!getCookie('lat')) {
		if (!getCookie('loc_perm')) {
			var tryLoc=confirm('In order to provide you with the best possible experience, we require your location, which will be used with strict adherence to all local and federal laws. Continue?')
		}
		if ((tryLoc===true)||(getCookie('loc_perm'))) {
			setCookie('loc_perm','1')
			var x_loc = navigator.geolocation.getCurrentPosition(displayPosition,showError,{ enableHighAccuracy: true, timeout: 3000, maximumAge: 0 });
		} else {
			setTimeout('getLocation()',100)
		}
		var full_address
	}
	var retry
	
	function showError(error) {
		setTimeout('getLocation()',100)
	}

	function setCookie(cname,cvalue,exdays)	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	 }

	function getCookie(cname)	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
		  var c = ca[i].trim();
		  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}

	function error() {}

	function displayPosition(position) {
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				formatted_address = results[0].formatted_address
				var address = "", city = "", state = "", zip = "", country = "";
				for (var i = 0; i < results[0].address_components.length; i++) {
					var addr = results[0].address_components[i];
					if (addr.types[0] == 'country')
						country = addr.long_name;
					else if (addr.types[0] == 'street_address') // address 1
						address = address + addr.long_name;
					else if (addr.types[0] == 'establishment')
						address = address + addr.long_name;
					else if (addr.types[0] == 'route')  // address 2
						address = address + addr.long_name;
					else if (addr.types[0] == 'postal_code')       // Zip
						zip = addr.short_name;
					else if (addr.types[0] == ['administrative_area_level_1'])       // State
						state = addr.short_name;
					else if (addr.types[0] == ['locality'])       // City
						city = addr.long_name;
				}
				street_no=results[0].address_components[0].short_name
				street=results[0].address_components[1].short_name
				full_address = formatted_address
				full_address=street_no + ', ' + street + ' ' + city + ' ' + state + ' ' + zip + ' '  + country
				console.log('STREET NO: ' + street_no)
				console.log('STREET: '+street)
				console.log('CITY: '+city)
				console.log('STATE: '+state)
				console.log('ZIP: '+zip)
				console.log('COUNTRY: '+country)
				console.log('LOCATION: ' + city + ', ' + state + ' ' + zip)
				console.log('FULL ADDRESS: ' + formatted_address)
				setCookie('location', city + ', ' + state + ' ' + zip, 7)
				setCookie('street_no',street_no,7)
				setCookie('street',street,7)
				setCookie('city',city,7)
				setCookie('state',state,7)
				setCookie('zip',zip,7)
				setCookie('lat',position.coords.latitude,7)
				setCookie('lng',position.coords.longitude,7)
			  }
		  }
	  });
	}