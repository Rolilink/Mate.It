define(['jquery','underscore','backbone','app/views/property-map','app/collections/properties'],function($,_,Backbone,PropertyMap,Properties){
	var propertyMap,pubSub,properties;
	var start = function(){
		pubSub = _.extend({},Backbone.Events);
		propertyMap = new PropertyMap({el:"#search-map",center:{lng:center.lng,lat:center.lat},zoom:15});
		properties = new Properties();
		setupEvents();
	}

	var setupEvents = function(){
		pubSub.listenToOnce(propertyMap,'bounds_changed',updateProperties);
		pubSub.listenTo(propertyMap,'idle',updateProperties);
		pubSub.listenTo(properties,'reset',renderProperties);
	}

	var getQuery = function(params){
		return {
				loc:{
					"$geoWithin":{
						'$box':params.bounds
					}
				},
				available:true
		};
	}

	var updateProperties = function(bounds){
		$("div.loading").show();
		properties.search({query:getQuery(bounds)});
	};

	var renderProperties = function(data){
		setTimeout(function(){
			$("div.loading").hide();
		},1000);
		var json = data.map(function(obj){
			return obj.toJSON();
		});

		propertyMap.renderMarkersLayer(json);
	};

	return{
		start:start
	}
});