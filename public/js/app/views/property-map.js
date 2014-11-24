define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.View.extend({
		initialize: function(params){
			var self = this;
			google.maps.event.addDomListener(window,'load',function(){
				if(params.center)
					self.setCenter(params.center.lat,params.center.lng);
				if(params.zoom)
					self.setZoom(params.zoom);

				self.markers = {};
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
		setupEvents:function(){
			var self = this;

			google.maps.event.addListener(self.map, "idle", function() {
  			self.trigger('idle',{bounds:self.getBounds()});
			});

		},
		getBounds: function(){
			var bounds = this.map.getBounds();
			var bottom_left = this.latlngToArray(bounds.getSouthWest());
			var upper_right = this.latlngToArray(bounds.getNorthEast());

			return [bottom_left,upper_right];
		},
		latlngToArray:function(latlng){
			var array = [];
			array[0] = latlng.lat();
			array[1] = latlng.lng();
			return array;
		},
		render: function(){
			this.map = new google.maps.Map(this.$el[0],{center:this.center,zoom:this.zoom});
			this.setupEvents();
			
		},
		renderMarkersLayer: function(properties){
			var self = this;

			_.each(self.markers,function(marker,key){
				marker.setMap(null);
				delete self.markers[key];
			});

			
			_.each(properties,function(property){
				var image = "";
				if(property.propertyType === "apartment")
					image = "/img/apt-marker.png"

				if(property.propertyType === "house")
					image = "/img/house-marker.png"

				var position = new google.maps.LatLng(property.loc[0],property.loc[1]);
				var marker = new google.maps.Marker({position:position,icon:image});
				marker.setMap(self.map);
				self.markers[property._id] = marker;
			});
		}
	});
});