define(['jquery','underscore','backbone','jquery.map.picker'],function($,_,Backbone){
	return Backbone.View.extend({
		initialize: function(opts){	
			this.loc = opts.loc || [9.023416, -79.530843];	
			this.render();
		},
		render: function(){
			this.$el.find('.map-canvas').locationpicker({
				radius:0,
				location:{latitude: this.loc[0], longitude: this.loc[1]},
				onchanged: this.onchanged
			});
		},
		onchanged: function(currentLocation, radius, isMarkerDropped){
			if(!isMarkerDropped)
				return;
			$('#lat').val(currentLocation.latitude);
			$('#lon').val(currentLocation.longitude);
		}
	});
});