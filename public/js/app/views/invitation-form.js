define(['jquery','backbone','underscore'],function($,Backbone,_){
		return Backbone.View.extend({
		events:{
			'click .invite-btn':'validate'
		},
		initialize: function(opts){
			this.model = opts.model;
		},
		validate: function(e){
			var email = this.$el.find('#invite-email').val();

			if(email.length === 0)
				return this.onInvalid(this,'invite-email','Por favor insertar un correo valido.');

			var propertyId = this.model.id;
			var self = this;

			$.ajax({
			  type: "POST",
			  url: "/api/properties/" + propertyId + "/invite?email=" + email,
			  success: self.onApiResponse,
			  error: self.onErrorResponse
			});
			
		},
		onValid: function(v,attr){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-error').addClass('has-success');
			$(input).parent().find('.alert').remove();
			this.$el.find(".error-invite").hide();
		},
		onInvalid: function(v,attr,error){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-success').addClass('has-error');
			this.$el.find(".error-invite").text(error).addClass("alert alert-danger").show();
		},
		onApiResponse: function(response){
			console.log(response);
			alert('Correo Enviado');
		},
		onErrorResponse: function(response){
			alert('usuario ya esta en una propiedad');
		}
	});
});