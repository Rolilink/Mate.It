define(['jquery','backbone','underscore','app/models/picture','app/collections/pictures'],function($,Backbone,_,Picture,Pictures){
	return Backbone.View.extend({
		events:{
			'change #photo-input':'onFilesSelection',
			'click #photo-btn':'proxyClick'
		},
		initialize: function(opts){
			_.templateSettings.variable = "data";
			this.fileInput = this.$el.find('#photo-input');
			this.pictures = new (Pictures.extend({model:Picture}))();
			console.log(this.pictures.length);
			this.template = _.template("<div class='upload-pic' id='picture-<%- data.picture.id %>'><img src='<%- data.picture.readData %>' /></div>");
			this.photoList = this.$el.find('.photos-list');
		},
		bindToPropertyForm: function(view){
			view.bind('propertyCreated',this.upload,this);
		},
		upload: function(e){
			console.log(this.pictures.length);
			if(this.pictures.length > 0)
				this.pictures.upload(e.property).done(function(){
					console.log('finished');
				});
		},
		proxyClick: function(e){
			this.fileInput.trigger('click');
		},
		onFilesSelection: function(){
			this.photoList.html('');
			this.pictures.reset();
			var files = this.fileInput[0].files,
			self = this;
			_.forEach(files,function(file){
				if(file.type.match(/image.*/)){
					var picture = new Picture({file:file});
					picture.loadReadData().done(function(e){
						picture.set('readData',e.target.result);
						self.addPictureView({picture:picture});
					});
					self.pictures.add(picture);
				}
			}	);
		},
		addPictureView: function(e){
			this.photoList.append(this.template({picture:e.picture.toJSON()}));	
		}
	});
});