define(['jquery','underscore','backbone','app/views/image-zoomer'],function($,_,Backbone,ImageZoomer){
	var imageZoomer;

	var setupView = function(){
		imageZoomer = new ImageZoomer({el:'#image-zoomer'});
	};	

	var start = function(){
		$(function(){
			setupView();
		});
	};

	return {
		start: start
	}
});