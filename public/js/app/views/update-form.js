define(['jquery','backbone','underscore','backbone.validation','jquery.serializeObject'],function($,Backbone,_){
	var error_translate = {
		"Name is required":"Por favor llenar el campo de nombre.",
		"Username is required":"Por favor llenar el campo de nombre de usuario.",
		"Email is required":"Por favor llenar el campo de email.",
		"Password is required":"Por favor llenar el campo de contraseña.",
		"Name must be between 2 and 100 characters":"El campo nombre debe contener entre 2 y 100 caracteres.",
		"Username must be between 6 and 20 characters":"El nombre de usuario debe tener entre 6 y 20 caracteres.",
		"Email must be a valid email":"Introduzca un correo",
		"Password must be at least 6 characters":"La contraseña almenos debe tener 6 caracteres."
	};

	return Backbone.View.extend({
		events:{
			'click #btn-update':'validate'
		},
		initialize: function(opts){
			this.model = opts.model;
			this.bindValidation();
			console.log(this.model);
		},
		validate: function(e){
			var data = this.$el.serializeObject();
			this.model.set(data);
			this.$el.find(".alert").hide();
			this.$el.find(".alert ul").empty();
			if(this.model.isValid(true)){
				this.submit();
			}
		},
		bindValidation: function(){
			Backbone.Validation.bind(this,{
				valid: this.onValid,
				invalid: this.onInvalid
			});
		},
		onValid: function(v,attr){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-error').addClass('has-success');
			$(input).parent().find('.alert').remove();
		},
		onInvalid: function(v,attr,error){
			console.log(error);
			v.$el.find(".alert ul").append("<li>" + error_translate[error] + "</li>");
			v.$el.find(".alert").show();
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-success').addClass('has-error').append('<div class="alert alert-danger>' + error + '</div>');
		},
		submit:function(){
			this.model.once('sync',this.onApiResponse,this);
			this.model.once('error',this.onErrorResponse,this);
			this.model.save();
		},
		onApiResponse: function(model,response){
			this.trigger('user_created',{user:model})
		},
		onErrorResponse: function(model){
			window.location.href = "/users/new?message=usuario ya existe"
		}
	});
});