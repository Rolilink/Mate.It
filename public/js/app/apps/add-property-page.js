define(['jquery','underscore','backbone','app/views/property-form','app/views/file-uploader','app/models/property','app/views/map-picker'],function($,_,Backbone,PropertyForm,FileUploader,Property,MapPicker){
	var property,pubSub,propertyForm,fileUploader,mapPicker;
	var start = function(){
		$(function(){
			setupView();
		});
	};

	var setupView = function(){
		pubSub = _.extend({},Backbone.Events);
		property = new Property();
		propertyForm = new PropertyForm({model:property,el:'form#property-form'});
		fileUploader = new FileUploader({model:property,el:'div#upload-photos'});
		mapPicker = new MapPicker({el:'div#map-picker'});
		setupEvents();
	}

	var setupEvents = function(){
		pubSub.listenTo(propertyForm,"creating_property",startLoading);
		pubSub.listenTo(propertyForm,"property_created",startUpload);
		//pubSub.listenTo(fileUploader,"upload_started",onUploadStarted);
		pubSub.listenTo(fileUploader,"upload_finished",onUploadFinished);

	}

	var startUpload = function(rproperty){
		property = rproperty;
		fileUploader.upload(property);
	}

	var startLoading = function(){
		$("div.loading").show();
	}

	var onUploadFinished = function(rproperty){
		stopLoading();
		var lat = rproperty.get('loc')[0];
		var lng = rproperty.get('loc')[1];

		window.location.href = "/?lat=" + lat + "&lng=" + lng; 
	}

	var stopLoading = function(){
		$("div.loading").hide();
	}

	return {
		start: start
	}
});