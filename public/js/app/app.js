require.config({
	paths: {
		jquery:'//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
		underscore:'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
		backbone:'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
		bootstrap:'//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min',
		'bootstrap-select':'//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.5.4/bootstrap-select',
		'backbone.validation':'//cdnjs.cloudflare.com/ajax/libs/backbone.validation/0.9.1/backbone-validation-min'
	},
	shim:{
		'bootstrap': ['jquery'],
		'bootstrap-select' : ['bootstrap'],
		'backbone': {
      deps: ['underscore', 'jquery'],
      exports: function() {
        return Backbone.noConflict();
      }
    },
    'backbone.validation':['backbone']
	}
});


require(['jquery'],function($){
		
});