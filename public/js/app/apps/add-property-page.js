define(['jquery','app/views/property-form','app/views/file-uploader','app/models/property','app/views/map-picker'],function($,PropertyForm,FileUploader,Property,MapPicker){
	var start = function(){
		$(function(){
			setupView();
		});
	};

	var setupView = function(){
		var property = new Property();
		var propertyForm = new PropertyForm({model:property,el:'form#property-form'});
		var fileUploader = new FileUploader({model:property,el:'div#upload-photos'});
		var mapPicker = new MapPicker({el:'div#map-picker'});
		fileUploader.bindToPropertyForm(propertyForm);
	}


	return {
		start: start
	}
});