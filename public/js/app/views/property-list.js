define(['jquery','backbone','underscore','app/templates/listItem'],function($,Backbone,_,listItemTmp){
	return Backbone.View.extend({
		events:{
			"mouseover .list-item":"onListItemOver",
			"mouseout .list-item":"onListItemOut"
		},
		initialize: function(params){
		},
		onListItemOver:function(e){
			if(this.activeHover)
				return;
			var id = $(e.currentTarget).attr('data-id');
			this.trigger('hover_over',{id:id});
			this.activeHover = true;
		},
		onListItemOut:function(e){
			this.activeHover = false;
			var id = $(e.currentTarget).attr('data-id');
			this.trigger('hover_out',{id:id});
		},
		render: function(properties){
			console.log(properties);
			console.log(this.$el);
			var self = this;
			self.$el.empty();
			_.each(properties,function(property){
				self.$el.append(listItemTmp({property:property}));
			});
		}
	});
});