define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.View.extend({
		events:{
			
		},
		initialize: function(params){
			var self = this;
			if(params.properties)
				self.setProperties(params.properties);
			google.maps.event.addDomListener(window,'load',function(){
				if(params.center)
					self.setCenter(params.center.lat,params.center.lng);
				if(params.zoom)
					self.setZoom(params.zoom);
				console.log('about to render map');
				self.render();
			});
		},
		setCenter: function(lat,lng){
			if(!this.map)
				this.center = new google.maps.LatLng(lat,lng);
		},
		setZoom: function(zoom){
			if(!this.map)
				this.zoom = zoom;
		},
		setProperties: function(properties){

		},
		render: function(){
			this.map = new google.maps.Map(this.$el[0],{center:this.center,zoom:this.zoom});
		},
		renderMarkersLayer: function(){

		}
	});
});