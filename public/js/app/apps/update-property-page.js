define(['jquery','underscore','backbone','app/views/property-update-form','app/views/file-uploader','app/models/property','app/views/map-picker','app/views/google-autocomplete'],function($,_,Backbone,PropertyForm,FileUploader,Property,MapPicker,GoogleAutocomplete){
	var property,pubSub,propertyForm,fileUploader,mapPicker,googleAutocomplete;
	var start = function(data){
		$(function(){
			data.id = data._id;
			setupView(data);
		});
	};

	var searchProperties = function(data){
		var place = data.place;
		var lat = place.geometry.location.lat();
	  var lng = place.geometry.location.lng();
	  window.location.href = "/?lat=" + lat + "&lng=" + lng;
	}

	var setupView = function(data){
		pubSub = _.extend({},Backbone.Events);
		property = new Property(data);
		
		propertyForm = new PropertyForm({model:property,el:'form#property-form'});
		fileUploader = new FileUploader({model:property,el:'div#upload-photos'});
		mapPicker = new MapPicker({el:'div#map-picker',loc: data.loc});
		googleAutocomplete = new GoogleAutocomplete({el:"#search-form"});
		setupEvents();
	}

	var setupEvents = function(){
		pubSub.listenTo(propertyForm,"creating_property",startLoading);
		//pubSub.listenTo(propertyForm.model,"sync",startUpload);
		//pubSub.listenTo(fileUploader,"upload_started",onUploadStarted);
		pubSub.listenTo(fileUploader,"upload_finished",onUploadFinished);
		pubSub.listenTo(googleAutocomplete,"place_changed",searchProperties);
	}

	var startUpload = function(rproperty){
		property = rproperty;
		fileUploader.upload(property);
	}

	var startLoading = function(){
		$("div.loading").show();
	}

	var onUploadFinished = function(){
		stopLoading();
		var lat = propertyForm.model.get('loc')[0];
		var lng = propertyForm.model.get('loc')[1];

		window.location.href = "/?lat=" + lat + "&lng=" + lng; 
	}

	var stopLoading = function(){
		$("div.loading").hide();
	}

	return {
		start: start
	}
});