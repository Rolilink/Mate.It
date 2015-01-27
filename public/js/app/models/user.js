define(['backbone','underscore','backbone.validation'],function(Backbone,_){
	return Backbone.Model.extend({
		// Validation Rules checkout backbone.validation https://github.com/thedersen/backbone.validation
		validation:{
			name:{
				required:true,
				rangeLength: [2,100],
				pattern: /^[A-Za-z\ ]+$/
			},
			username: {
				required:true,
				rangeLength: [6,20],
				pattern: /^[a-z A-Z][a-zA-Z0-9_\-]+[a-zA-Z0-9]+$/
			},
			email:{
				required: true,
				pattern: 'email'
			},
			password:{
				required:true,
				minLength:6
			}
		},
		urlRoot: '/api/users',
		url: function(method){
			var urlMap = {
    		    'create': this.urlRoot,
    		    'update': this.urlRoot + '/' + this.get('_id'),
    		    'delete': this.urlRoot + '/' + this.get('_id'),
    		    'read': this.urlRoot + '/' + this.get('_id')
    	};

    	return urlMap[method];
		},
		isSaved: function(){
			return this.attributes.id != undefined;
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

        options.originalSuccess = options.success;

        options.success = function(res){
        	return options.originalSuccess(res.user);
        }
 
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
        	user: model.toJSON()
        };

        params.data = JSON.stringify(json);
        
        // Make the request, allowing the user to override any Ajax options.
        return $.ajax(_.extend(params, options));        
    }
	});
});