define(['jquery','backbone','underscore','bootstrap','jquery.serializeObject'],function($,Backbone,_){

	return Backbone.View.extend({
		events:{
			'click .btn':'validate'
		},
		initialize: function(opts){
	
		},
		validate: function(e){
			var data = this.$el.find("form").serializeObject(),
			numberTest = /^[0-9]+$/;
			
			if(data["price-range-min"] == "") data["price-range-min"] = 0;

			if(data["price-range-max"] == "") data["price-range-max"] = 9999999999;

			if(!numberTest.test(data["price-range-min"]))
				return this.onInvalid(this,"price-range-min","El campo precio minimo debe ser un numero.");

			if(!numberTest.test(data["price-range-max"]))
				return this.onInvalid(this,"price-range-max","El campo precio maximo debe ser un numero.");
			
			if(data["price-range-min"] > data["price-range-max"])
				return this.onInvalid(this,"price-range-max","El campo precio maximo debe ser mayor que el precio menor.");

			this.trigger("options_changed",data);
			$("#as-modal").modal("hide");
			
		},
		onValid: function(v,attr){
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-error').addClass('has-success');
		},
		onInvalid: function(v,attr,error){
			v.$el.find(".alert ul").append("<li>" + error + "</li>");
			v.$el.find(".alert").show();
			var input = v.$el.find('[name="' + attr + '"]');
			$(input).parent().removeClass('has-success').addClass('has-error').append('<div class="alert alert-danger>' + error + '</div>');
		}
	});
});