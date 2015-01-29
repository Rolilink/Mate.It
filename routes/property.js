//Routes for Property
//req.body holds parameters that are sent up from the client as part of a post request.
app.post('/api/properties',authorization.is('User'),function(req,res,next){
	var handleError = function(err){ 
		if(err === "You already have a property created.")
			return res.status(422).json({error:"You already have a property created."});

		res.status(422).json({errors:err.errors});
	},
	handleSuccess = function(result){ res.status(201).json({property:result.property}); };

	if(!req.userCan('Create Property'))
		return handleError('You already have a property created.');
	
	// User can create a property
	seneca.act({controller:'property',action:'create',data:req.param('property'),owner:req.user.id},function(err,result){
		if(err)
			return handleError(err);
		return handleSuccess(result);
	});

});
 
 //returns the value of parameter 'id' brings back a specific property of id: id
app.get('/api/properties/:id',authorization.is('User'),function(req,res,next){
	seneca.act({controller:'property',action:'get',id:req.param('id')},function(err,result){

		if(err){
			if(err.name == "PropertyNotFound")
				return res.status(404).json({err:err});

			if(err.name == "CastError"){
				return res.status(422).json({err:err});
			}
			return res.status(500).json({err:err});
		}

		res.status(200).json({property:result.property});
	});
});

//returns list of properties 
app.get('/api/properties',authorization.is('User'),function(req,res,next){
	seneca.act({controller:'property',action:'list',query:{},page:req.param('page'),limit:req.param('limit')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({properties:result.properties});
	});
});

// returns list of properties based in a query
app.post('/api/properties/list',authorization.is('User'),function(req,res,next){
	seneca.act({controller:'property',action:'list',query:req.param('query'),page:req.param('page'),limit:req.param('limit')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({properties:result.properties});
	});
});

//deletes property of id: id brining back the parameter id
app.del('/api/properties/:id',authorization.is('Owner'),function(req,res,next){
	seneca.act({controller:'property',action:'delete',id:req.param('id')},function(err,result){
		if(err){
			if(err.name == "PropertyNotFound")
				return res.status(404).json({err:err});
			return res.status(422).json({errors:err.errors});
		}
		res.status(200).json({property:result.property});
	});
});

//updates property of id:id bringing back the parameter of id, then sends back the object.
app.post('/api/properties/:id',authorization.is('Owner'),function(req,res,next){
	seneca.act({controller:'property',action:'update',data:req.param('property'),id:req.param('id')},function(err,result){
		
		if(err){
			if(err.name == "PropertyNotFound")
				return res.status(404).json({err:err});
			return res.status(422).json({errors:err.errors});
		}
		res.status(200).json({property:result.property});
	});
});

app.post('/api/properties/:id/photos',authorization.is('Owner'),function(req,res,next){
	var picture = req.files.picture,
	id = req.param('id');


	if( ! /image/.test(picture.headers['content-type']) ){
    return res.status(422).json({error:'file to upload is not an image'});
  }

	seneca.act({controller:"property", action:"addPicture",id:id, picture:picture},function(err,result){
		if(err){
			if(err.name == "PropertyNotFound")
				return res.status(404).json({err:err});
			return res.status(422).json({errors:err.errors});
		}
		res.status(200).json({property:result.property});
	});
});

app.get('/api/properties/:id/photos',authorization.is('User'),function(req,res,next){
	var id = req.param('id');

	seneca.act({controller:'property',action:'listPictures',id:id},function(err,result){
		if(err){
			if(err.name == "PropertyNotFound")
				return res.status(404).json({err:err});
			return res.status(422).json({errors:err.errors});
		}
		res.status(200).json({pictures:result.pictures});
	});
});

app.del('/api/properties/:id/photos/:photoid',authorization.is('Owner'),function(req,res,next){
	var id = req.param('id'),
	pictureId = req.param('photoid');
	seneca.act({controller:'property',action:'deletePicture',id:id, pictureId:pictureId},function(err,result){
		if(err){
			if(err.name == "PropertyNotFound")
				return res.status(404).json({err:err});

			if(err.name == "PhotoNotFound")
				return res.status(404).json({err:err});
			
			return res.status(422).json({errors:err.errors});
		}
		res.status(200).json({property:result.property});
	});
});

app.get('/api/properties/:id/rating',authorization.is('User'),function(req,res){
	var id = req.param('id');

	if(!/^[0-9a-fA-F]{24}$/.test(id))
		return res.status(422).send();

	Comment.findQ({property:id})
	.then(function(comments,err){

		if(comments.length === 0){
			return res.status(404).send();
		}

		if(err){
			return res.status(500).json({errors:err.errors});
		}

		var length = comments.length;
		var sum = _.reduce(comments, function(memo,comment){ return memo + comment.rating; }, 0);
		var average = sum / length;
		return res.status(200).json({rating:average});
	});

});

app.get('/properties/create',function(req,res){

	if(!req.user || !req.user.is('User'))
		return res.redirect('/login');

	var fs = require('fs');
	var data = fs.readFileSync(appRoot + '/data/countries.json',{encoding:"utf8"});
	var countries = JSON.parse(data);

	res.render('property/new',{user:req.user,countries:countries});
});

app.get('/',function(req,res){
	
	if(!req.user || !req.user.is('User'))
		return res.redirect('/login');

	var center = {};
	center.lng = req.param('lng') || -79.51666699999998;
	center.lat = req.param('lat') || 8.983333;

	res.render('property/search',{user:req.user,center:center,advanced:true});
});

app.get('/properties/:id/view',function(req,res){

	if(!req.user || !req.user.is('User'))
		return res.redirect('/login');

	var id = req.param('id'),
	property,
	comments;

	var find = Property.findByIdQ(id);

	find
	.then(function(rproperty){
		property = rproperty;
		
		if(!property)
			return false;
	
		return Property.populateQ(property,{path:'habitants',model:'User'});
	})
	.then(function(rproperty){
		
		if(!property)
			return false;
		
		return Property.populateQ(property,{path:'owner',model:'User'});
	})
	.then(function(rproperty){
	
		if(!property)
			return res.status(404).send('property not found');
		
		return Comment.find({property: property._id}).populate({path:'user',model:'User', select:'name username profilePicture -_id'}).execQ();
	})
	.then(function(comments){
		
		if(!property )
			return false;
		
		res.status(200).render('property/view',{property:property,user:req.user,comments:comments});
	})
	.catch(function(err){
		res.status(500).send({error:err});
	});

});

app.post('/properties/:id/contact',function(req,res){
	var propertyId = req.param('id'),
	user = req.user,
	message = req.param('message');

	if(!propertyId)
		return res.status(400).json({error:'property id not provided'});

	if(!message)
		return res.status(400).json({error:'message not provided'});
	


	Property.findById(propertyId)
	.populate({path:'owner',model:'User'})
	.execQ()
	.then(function(rproperty){
		
		if(!rproperty)
			return res.status(400).json({error:'propertyId not found'});

		return user.sendContactEmail({message:message,title:rproperty.title,owner:rproperty.owner});
	})
	.then(function(){
		return res.status(200).json({sended:true});
	})
	.catch(function(err){
		return res.status(400).json({error:err});
	});	


});

app.get('/properties/update',function(req,res){
	var propertyId = req.user.property.data,
	user = req.user;

	var fs = require('fs');
	var data = fs.readFileSync(appRoot + '/data/countries.json',{encoding:"utf8"});
	var countries = JSON.parse(data);


	if(!propertyId && !user.property.isOwner)
		return res.status(400).json({error:'you are not owner of a property'});

	Property.findById(propertyId)
	.execQ()
	.then(function(rproperty){
		
		if(!rproperty)
			return res.status(400).json({error:'propertyId not found'});

		res.render('property/update',{user:req.user,property:rproperty,countries:countries,_:require('underscore')});
	})
	.catch(function(err){
		return res.status(400).json({error:err});
	});	
});




