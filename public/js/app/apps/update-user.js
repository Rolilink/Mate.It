define(['jquery','underscore','app/views/update-form','app/views/profile-pic-uploader','app/models/user'],function($,_,UpdateForm,ProfilePictureUploader,User){
	var pubSub;
	var start = function(user){
		$(function(){
			setupView(user);
		});
	};

	var setupView = function(userJson){
		userJson.id = userJson._id;
		var user = new User(userJson);
		var updateForm = new UpdateForm({model:user,el:'#update-user-form'});
		var picUploader = new ProfilePictureUploader({el:'#update-user-form'});
		var pubSub = _.extend({},Backbone.Events);

		pubSub.listenTo(updateForm,"user_updated",function(){
			picUploader.upload(userJson._id);
		});

		pubSub.listenTo(picUploader,"upload_finished",function(){
			console.log('wtf');
			window.location.href = "/";
		});


	}


	return {
		start: start
	}
});