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
	seneca.act({controller:'property',action:'create',data:req.body.property,owner:req.user.id},function(err,result){
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

app.get('/properties/create',authorization.is('User'),function(req,res){
	res.render('property/new',{user:req.user});
});

