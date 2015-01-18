define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.View.extend({
		events:{
			'click #btn-comentario':'onClickComentario'
		},
		initialize: function(opts){

		},
		validate: function(message){
			return message.length > 0;
		},
		onClickComentario: function(){
			var message = this.$el.find("textarea[name='message']").val();

			if(this.validate(message)){
				var url = this.$el.find("form").attr('action'),
				self = this;

				$.post(url,{message:message})
				.done(function(){
					self.onValid();
				})
				.fail(function(err){
					self.onError(err);
				});

			}
			else{
				this.onError("por favor llene el campo de mensaje");
			}

		},
		onError: function(err){
			this.$el.find("form").prepend('<div class="alert alert-danger"><strong> Un Error ha ocurrido por favor llena el campo de mensaje o recarga la pagina.</strong></div>')
		},
		onValid: function(){
			this.$el.find("form").empty();
			this.$el.find("form").append('<div class="alert alert-success"><strong>Mensaje Enviado</strong></div>');
		}
	});
});