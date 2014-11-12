define(['jquery','app/views/property-form','app/views/file-uploader','app/models/property'],function($,PropertyForm,FileUploader,Property){
	var start = function(){
		$(function(){
			setupView();
		});
	};

	var setupView = function(){
		var property = new Property();
		var propertyForm = new PropertyForm({model:property,el:'form#property-form'});
		var fileUploader = new FileUploader({model:property,el:'div#upload-photos'});
		fileUploader.bindToPropertyForm(propertyForm);
	}


	return {
		start: start
	}
});