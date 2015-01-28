define(['jquery','backbone','underscore','backbone.validation','jquery.serializeObject'],function($,Backbone,_){
		var translation = {
			"Content is required": "Por favor llenar el campo de contenido."
		}
		return Backbone.View.extend({
		events:{
			'click #btn-comentario':'validate'
		},
		initialize: function(opts){
			this.model = opts.model;
			this.bindValidation();
		},
		validate: function(e){
			var data = this.$el.serializeObject();
			this.model.set(data);
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
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-success').addClass('has-error');
			$("#error").text(translation[error]).addClass("alert alert-danger");
		},
		submit:function(){
			this.model.once('sync',this.onApiResponse,this);
			this.model.once('error',this.onErrorResponse,this);
			this.model.save();
		},
		onApiResponse: function(model,response){
			window.location.reload();
		},
		onErrorResponse: function(response){
			$("#error").text("Ya has escrito un comentario.").addClass("alert alert-danger");
		}
	});
});