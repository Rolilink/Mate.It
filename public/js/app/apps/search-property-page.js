define(['jquery','underscore','backbone','app/views/property-map','app/collections/properties','app/views/google-autocomplete','app/views/property-list','app/views/advanced-search'],function($,_,Backbone,PropertyMap,Properties,GoogleAutocomplete,PropertyList,AdvancedSearch){
	var propertyMap,pubSub,properties,googleAutocomplete,propertyList,advancedSearch,searchOpts={};

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
		advancedSearch = new AdvancedSearch({el:"#as-modal"});
		setupEvents();
	}

	var setupEvents = function(){
		pubSub.listenTo(propertyMap,'idle',updateProperties);
		pubSub.listenTo(properties,'reset',renderProperties);
		pubSub.listenTo(propertyList,'hover_over',activateMarker);
		pubSub.listenTo(propertyList,'hover_out',clearActiveMarker);
		pubSub.listenTo(googleAutocomplete,'place_changed',searchProperties);
		pubSub.listenTo(advancedSearch,'options_changed',updateOptions)
	}

	var activateMarker = function(e){
		propertyMap.setActiveMarker(e);
	}

	var updateOptions = function(opts){
		searchOpts = opts || {};
		var bounds = propertyMap.getBounds();
		updateProperties({bounds:bounds});
	}

	var clearActiveMarker = function(e){
		propertyMap.clearActiveMarker(e);
	}

	var getQuery = function(params){
		var q = {
				loc:{
					"$geoWithin":{
						'$box':params.bounds
					}
				},
				available:true
		};

		if(searchOpts.genderAllowed && searchOpts.genderAllowed != "both")
			q.genderAllowed = searchOpts.genderAllowed

		if(searchOpts.propertyType && searchOpts.propertyType != "both")
			q.propertyType = searchOpts.propertyType

		if(searchOpts.roomType && searchOpts.roomType != "both")
			q.roomType = searchOpts.roomType

		if(searchOpts["price-range-max"] && searchOpts["price-range-min"])
			q.price = {"$gte":searchOpts["price-range-min"],"$lte":searchOpts["price-range-max"]}

		console.log(q);
		return q;
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