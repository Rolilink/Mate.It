/* define(['jquery'],function($){
	google.maps.event.addDomListener(window, 'load', function(){
		console.log('map loaded');

		var defaultBounds = new google.maps.LatLngBounds(
		  new google.maps.LatLng (-90,-180),
		  new google.maps.LatLng(90,180)
	  );

		var input = $("#search-input input");
		console.log(input[0]);
		var autocomplete = new google.maps.places.Autocomplete(input[0],{bounds:defaultBounds});
		google.maps.event.addListener(autocomplete,'place_changed',function(){
		  $("#btn-search").removeAttr('disabled');
			$("#btn-search").click(function(e){
				var place = autocomplete.getPlace();
				var lat = place.geometry.location.lat();
			  var lng = place.geometry.location.lng();
			  window.location.href = "/?lat=" + lat + "&lng=" + lng;
			});
		});
	});

}); */

define(['jquery','app/views/google-autocomplete'],function($,GoogleAutocomplete){
	var googleAutocomplete;

	var start = function(cb){
		$(function(){
			
		});
	}

	return{
		start:start
	};
	
});