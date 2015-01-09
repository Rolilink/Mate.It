define(['jquery','underscore','backbone','app/views/image-zoomer','app/views/property-map','app/models/comment','app/views/comment-form'],function($,_,Backbone,ImageZoomer,PropertyMap,Comment,CommentForm){
	var imageZoomer,locationMap,pubSub,property,commentForm;

	var setupView = function(rproperty,ruser,rcomments){
		pubSub = _.extend({},Backbone.Events);
		property = rproperty;
		comment = new Comment({property:rproperty._id});
		imageZoomer = new ImageZoomer({el:'#image-zoomer'});
		commentForm = new CommentForm({el:"#comment-form",model:comment});
		locationMap = new PropertyMap({el:'#localizacion',center:{lat:property.loc[0],lng:property.loc[1]},zoom:13});

		pubSub.listenToOnce(locationMap,'tiles_loaded',renderMarker);
		pubSub.listenTo(commentForm,"comment_created",redirectTo);
	};	

	var renderMarker = function(){
		locationMap.renderMarker(property);
	}

	var start = function(rproperty,ruser,rcomments){
		$(function(){
			setupView(rproperty,ruser,rcomments);
		});
	};

	return {
		start: start
	}
});