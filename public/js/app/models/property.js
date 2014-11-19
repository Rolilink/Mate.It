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
		url: function(method){
			var urlMap = {
    		    'create': this.urlRoot,
    		    'update': this.urlRoot + '/' + this.get('_id'),
    		    'delete': this.urlRoot + '/' + this.get('_id'),
    		    'read': this.urlRoot + '/' + this.get('_id')
    	};

    	return urlMap[method];
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
		locToArray: function(){
			this.attributes.loc = [];
			this.attributes.loc[0] = this.attributes["loc[0]"];
			this.attributes.loc[1] = this.attributes["loc[1]"];
			delete this.attributes["loc[0]"];
			delete this.attributes["loc[1]"];
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
		},
		 sync: function(method, model, options){
    	
    	var methodMap = {
    		    'create': 'POST',
    		    'update': 'POST',
    		    'delete': 'DELETE',
    		    'read': 'GET'
    	};
    	
    	var type = methodMap[method];
 
        // Default options, unless specified.
        options || (options = {});
 
        // Default JSON-request options.
        var params = {type: type, dataType: 'json', contentType:"application/json"};
 
        // Ensure that we have a URL.
        if (!options.url) {
          params.url = this.url(method) || urlError();
        }
    	
        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !Backbone.emulateJSON) {
          params.processData = false;
        }

        var json = {
        	property: model.toJSON()
        };

        params.data = JSON.stringify(json);
        
        // Make the request, allowing the user to override any Ajax options.
        return $.ajax(_.extend(params, options));        
    }
	});
});