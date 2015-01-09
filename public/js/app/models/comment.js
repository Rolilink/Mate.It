define(['backbone','underscore','backbone.validation'],function(Backbone,_){
	return Backbone.Model.extend({
		// Validation Rules checkout backbone.validation https://github.com/thedersen/backbone.validation
		validation:{
			content:{
				required:true,
			},
			rating: {
				required:true,
			}
		},
		urlRoot: '/api/comments',
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
        	console.log(res);
        	return options.originalSuccess(res.comment);
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
        	comment: model.toJSON()
        };

        params.data = JSON.stringify(json);
        
        // Make the request, allowing the user to override any Ajax options.
        return $.ajax(_.extend(params, options));        
    }
	});
});