define(['jquery','backbone','underscore','backbone.validation'],function($,Backbone,_){
	return Backbone.Model.extend({
		defaults:{
			readData: undefined
		},
		loadReadData:function(){
			var deferred = new $.Deferred(),
			self = this,
			file = this.get('file'),
			reader = new FileReader();

			reader.onload = function(e){
				console.log(e);
				if(!e)
					return deferred.reject();
				return deferred.resolve(e);
			};

			reader.readAsDataURL(file);
			return deferred.promise();
		},
		uploadToServer: function(propertyId){
			console.log(propertyId);
			var deferred = new $.Deferred(),
		 	uri = "/api/properties/" + propertyId + '/photos',
    	xhr = new XMLHttpRequest(),
    	fd = new FormData();

      xhr.open("POST", uri, true);
			fd.append('picture', this.attributes.file);
			xhr.onreadystatechange = function() {
	      if (xhr.readyState == 4 && xhr.status == 200) {
	      	deferred.resolve(xhr);
	      }
	      else{
	      	deferred.reject(xhr);
	      }
      };
			xhr.send(fd);
			return deferred.promise();
		}
	});
});