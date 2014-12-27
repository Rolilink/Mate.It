define(['jquery','underscore','backbone','app/views/image-zoomer','app/views/property-map'],function($,_,Backbone,ImageZoomer,PropertyMap){
	var imageZoomer,locationMap,pubSub,property;

	var setupView = function(rproperty){
		pubSub = _.extend({},Backbone.Events);
		property = rproperty;
		imageZoomer = new ImageZoomer({el:'#image-zoomer'});
		locationMap = new PropertyMap({el:'#localizacion',center:{lat:property.loc[0],lng:property.loc[1]},zoom:13});

		pubSub.listenToOnce(locationMap,'tiles_loaded',renderMarker);
	};	

	var renderMarker = function(){
		locationMap.renderMarker(property);
	}

	var start = function(rproperty){
		$(function(){
			setupView(rproperty);
		});
	};

	return {
		start: start
	}
});