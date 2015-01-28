define(['jquery','backbone','underscore','app/models/profile-picture'],function($,Backbone,_,Picture,Pictures){
	return Backbone.View.extend({
		events:{
			'change #photo-input':'onFilesSelection'
		},
		initialize: function(opts){
			_.templateSettings.variable = "data";
			this.fileInput = this.$el.find('#photo-input');
			this.template = _.template("<div class='upload-pic' id='picture-<%- data.picture.id %>'><img src='<%- data.picture.readData %>' /></div>");
			this.picture = null;
		},
		upload: function(userId){
			var self = this;
			if(this.picture){
				self.trigger('upload_started');
				  this.picture.uploadToServer(userId).always(function(){
				  	console.log('upload_finished');
						self.trigger('upload_finished');
				});
			}else{
				self.trigger('upload_finished');
			}
		},
		onFilesSelection: function(){
			if(this.picture)
				this.picture = null;

			var files = this.fileInput[0].files,
			self = this;
			_.forEach(files,function(file){
				if(file.type.match(/image.*/)){
					var picture = new Picture({file:file});
					picture.loadReadData().done(function(e){
						picture.set('readData',e.target.result);
						self.changePhoto({picture:picture});
					});
					self.picture = picture;
				}
			}	);
		},
		changePhoto: function(e){
			var pictureData = e.picture.get('readData');
			this.$el.find("img").attr('src',pictureData);	
		}
	});
});