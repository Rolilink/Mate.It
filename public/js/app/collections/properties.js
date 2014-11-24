define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.Collection.extend({
		initialize:function(){

		},
		search: function(params){
			var self = this;
			return $.ajax({
			  type: "POST",
			  url: "/api/properties/list",
			  contentType: "application/json; charset=utf-8",
			  data: JSON.stringify({
			  	query:params.query,
					page:1,
					limit:20
			  }),
			  success: function(data){ return self.populateCollection(data.properties); },
			  dataType: 'json'
			});
		},
		populateCollection: function(properties){
			this.reset(properties);
		}
	});
});