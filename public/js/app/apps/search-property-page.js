define(['jquery','app/views/property-map'],function($,PropertyMap){
	var propertyMap;
	var start = function(){
		propertyMap = new PropertyMap({el:"#search-map",center:{lng:center.lng,lat:center.lat},zoom:15});
	}

	return{
		start:start
	}
});