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
		},
		urlRoot: '/api/properties',
		url: function(){
			console.log(this.urlRoot);
			if(!this.attributes.id)
				return this.urlRoot + '/';
			else
				return this.urlRoot + '/' + this.attributes.sid;
		},
		amenitiesToArray: function(){
		  var amenities = [],
		  self = this;
		  _.each(this.attributes,function(value,key){
		  	if( /amenities/.test(key) && value === "on" ){
		  		amenities.push(/amenities\[(.+)\]/.exec(key)[1]);
		  		delete self.attributes[key];
		  	}
			});

			this.attributes.amenities = amenities;
		},
		isSaved: function(){
			return this.attributes.id != undefined;
		},
		addPhotos: function(photos){
			var self = this;
			if(!this.attributes.photos)
				this.attributes.photos = [];
			
			if(photos.length){
				this.attributes.photos = _.union(this.attributes.photos,photos);
				return this;
			}
			_.each(photos,function(photo){
				self.attributes.photos[photo.id] = photo;
			});	

			return this;

		},
		havePhotos: function(){
			return this.attributes.photos.length && this.attributes.photos.length > 0;
		},
		deletePhoto: function(id){
		 delete self.attributes.photos[id];
		}
	});
});