define(['jquery','underscore','backbone','app/views/property-map','app/collections/properties','app/views/google-autocomplete','app/views/property-list'],function($,_,Backbone,PropertyMap,Properties,GoogleAutocomplete,PropertyList){
	var propertyMap,pubSub,properties,googleAutocomplete,propertyList;

	var searchProperties = function(data){
		var place = data.place;
		var lat = place.geometry.location.lat();
	  var lng = place.geometry.location.lng();

	  propertyMap.setCenter(lat,lng);
	}

	var start = function(){
		pubSub = _.extend({},Backbone.Events);
		propertyMap = new PropertyMap({el:"#search-map",center:{lng:center.lng,lat:center.lat},zoom:15});
		properties = new Properties();
		propertyList = new PropertyList({el:"#search-list"});
		googleAutocomplete = new GoogleAutocomplete({el:"#search-form"});
		setupEvents();
	}

	var setupEvents = function(){
		pubSub.listenToOnce(propertyMap,'bounds_changed',updateProperties);
		pubSub.listenTo(propertyMap,'idle',updateProperties);
		pubSub.listenTo(properties,'reset',renderProperties);
		pubSub.listenTo(propertyList,'hover_over',activateMarker);
		pubSub.listenTo(propertyList,'hover_out',clearActiveMarker);
		pubSub.listenTo(googleAutocomplete,'place_changed',searchProperties);
	}

	var activateMarker = function(e){
		propertyMap.setActiveMarker(e);
	}


	var clearActiveMarker = function(e){
		propertyMap.clearActiveMarker(e);
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
		propertyList.render(json);
	};

	var onAutoComplete = function(){

	}

	return{
		start:start,
		pubSub:pubSub
	}
});