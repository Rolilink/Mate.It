define(['jquery','underscore','app/views/update-form','app/models/user'],function($,_,UpdateForm,User){
	var pubSub;
	var start = function(user){
		$(function(){
			setupView(user);
		});
	};

	var setupView = function(userJson){
		userJson.id = userJson._id;
		var user = new User(userJson);
		var updateForm = new UpdateForm({model:user,el:'form'});
		var pubSub = _.extend({},Backbone.Events);

		pubSub.listenTo(updateForm,"user_created",function(){
			window.location.href = "/login";
		});
	}


	return {
		start: start
	}
});