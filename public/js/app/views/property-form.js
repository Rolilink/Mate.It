define(['jquery','backbone','underscore','backbone.validation','jquery.serializeObject'],function($,Backbone,_){
	
	var error_translate = {
		"Capacity is required":"Por favor llenar el campo de capacidad.",
		"Price is required":"Por favor llenar el campo de precio.",
		"Title is required":"Por favor llenar el campo de titulo.",
		"Description is required":"Por favor llenar el campo de descripcion.",
		"Address is required":"Por favor llenar el campo de direccion.",
		"Title must be between 20 and 120 characters":"El campo titulo debe tener entre 20 y 120 caracteres.",
		"Description must be between 40 and 500 characters":"El campo descripcion debe tener entre 40 y 500 caracteres.",
		"Address must be between 10 and 70 characters":"La direccion debe tener entre 10 y 70 caracteres.",
		"Price must be greater than or equal to 1":"El precio debe ser una cantidad valida mayor a 0.",
		"Capacity must be greater than or equal to 1":"La capacidad debe ser una cantidad valida mayor a 0."
	};

	return Backbone.View.extend({
		events:{
			'click #btn-create':'validate'
		},
		initialize: function(opts){
			this.model = opts.model;
			this.bindValidation();
		},
		validate: function(e){
			var data = this.$el.serializeObject();
			this.model.set(data);
			this.model.amenitiesToArray();
			this.model.locToArray();
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
		},
		onInvalid: function(v,attr,error){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-success').addClass('has-error').append('<div class="alert alert-danger>' + error + '</div>');
			v.$el.find(".alert ul").append("<li data-attr='"+ attr + "'>" +  error_translate[error] + "</li>");
			v.$el.find(".alert").show();
		},
		submit:function(){
			this.model.once('sync',this.onApiResponse,this);
			this.model.once('error',this.onErrorResponse,this);
			this.trigger('creating_property',{})
			this.model.save();
		},
		onApiResponse: function(model,response){
			this.trigger('property_created',{id:response.property._id})
		},
		onErrorResponse: function(response){
			this.$el.find(".alert ul").append("<li> Ha Sucedido un error en el servidor intenta mas tarde.</li>");
			this.$el.find(".alert").show();
		}
	});
});