define(['jquery','app/views/property-form','app/models/property'],function($,PropertyForm,Property){
	var start = function(){
		$(function(){
			setupView();
		});
	};

	var setupView = function(){
		var property = new Property();
		var propertyForm = new PropertyForm({model:property,el:'form#property-form'});
		console.log(propertyForm);
	}


	return {
		start: start
	}
});