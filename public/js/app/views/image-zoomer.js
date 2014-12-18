define(['jquery','backbone','underscore'],function($,Backbone,_){
	return Backbone.View.extend({
		initialize: function(){
			var self = this;
			this.$el.on('mouseover','.mini-image img',function(e){
				var $target = $(e.currentTarget);
				$("#zoom-image img").attr('src',$target.attr('src'));
			});
		}
	});
});