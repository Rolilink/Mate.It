define(['jquery','bootstrap','underscore','backbone','app/views/image-zoomer','app/views/property-map','app/models/comment','app/views/comment-form','app/views/contact-modal'],function($,bootstrap,_,Backbone,ImageZoomer,PropertyMap,Comment,CommentForm,ContactModal){
	var imageZoomer,locationMap,pubSub,property,commentForm,contactModal;

	var setupView = function(rproperty,ruser,rcomments){
		pubSub = _.extend({},Backbone.Events);
		property = rproperty;
		comment = new Comment({property:rproperty._id});
		imageZoomer = new ImageZoomer({el:'#image-zoomer'});
		commentForm = new CommentForm({el:"#comment-form",model:comment});
		locationMap = new PropertyMap({el:'#localizacion',center:{lat:property.loc[0],lng:property.loc[1]},zoom:13});
		contactModal = new ContactModal({el:"#contacto-modal"});
		pubSub.listenToOnce(locationMap,'tiles_loaded',renderMarker);
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