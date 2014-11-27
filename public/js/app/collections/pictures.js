define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.Collection.extend({
		upload: function(model){
			var petitionsMade = 0,
			petitionsCompleted = 0
			deferred = new $.Deferred(),
			id = model.get('id'),
			self = this;

			this.forEach(function(model){
				petitionsMade++;
				model.uploadToServer(id).always(function(xhr){
					petitionsCompleted++;

					if(xhr.status != 200)
						deferred.reject(xhr);

					if(petitionsCompleted === petitionsMade){
						deferred.resolve();
					}

				});
			});
			return deferred.promise();
		}
	});
});