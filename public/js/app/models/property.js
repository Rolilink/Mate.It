define(['backbone','underscore','backbone.validation'],function(Backbone,_){
	return Backbone.Model.extend({
		// Validation Rules checkout backbone.validation https://github.com/thedersen/backbone.validation
		validation:{
			capacity: {
				required:true,
				min:1
			},
			price:{
				required: true,
				min:1
			},
			roomType:{
				required:true
			},
			propertyType:{
				required:true
			},
			title:{
				required:true,
				rangeLength: [20,120]
			},
			description:{
				required:true,
				rangeLength: [40,500]
			},
			address:{
				required: true,
				rangeLength: [10,70]
			}
		}
	});
});