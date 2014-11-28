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
			
			});
		});
	});

}); */

define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.View.extend({
		events:{
			"submit":"stopSubmit"
		},
		initialize: function(params){
			if(google.maps && google.maps.places && google.maps.places.Autocomplete)
				return this.render();

			google.maps.event.addDomListener(window,'load',this.render);
		},
		render:function(){
			var self = this;
			this.defaultBounds = new google.maps.LatLngBounds( new google.maps.LatLng (-90,-180), new google.maps.LatLng(90,180));
			this.autocomplete = new google.maps.places.Autocomplete(this.$el.find("input")[0],{bounds:this.defaultBounds});

			google.maps.event.addListener(this.autocomplete,'place_changed',function(){
				self.onPlaceChanged();
			});
			
		},
		onPlaceChanged: function(){
			var place = this.autocomplete.getPlace();
			this.trigger("place_changed",{place:place});
		},
		stopSubmit: function(e){
			e.preventDefault();
			return false;
		}
	});
});