define(['jquery','app/views/signup-form','app/models/user'],function($,SignupForm,User){
	var pubSub;
	var start = function(){
		$(function(){
			setupView();
		});
	};

	var setupView = function(){
		var user = new User();
		var signupForm = new SignupForm({model:user,el:'form'});
		var pubSub = _.extend({},Backbone.Events);

		pubSub.listenTo(signupForm,"user_created",function(){
			window.location.href = "/login";
		});
	}


	return {
		start: start
	}
});