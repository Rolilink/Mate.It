/* 
 * Property Controller
 * @author: Rolilink
 */

seneca.add({controller:'property',action:'create'},function(args,cb){
	var data = args.data;

	var createdProperty = new Property(data);
	createdProperty.save(function(err){
		if(err){
			console.log("error:")
			console.log(err);
			return
		}

		cb(null,{property:createdProperty});
	});
});

seneca.add({controller:'property',action:'get'},function(args,cb){
	var id = args.id;
	Property.findById(id,function(err,property){
	console.log(id);
	if(err){
			//pass error to be handled for error handler			
			seneca.act({model:'property',action:'error',when:'getting',id:id,error:err},cb);
				console.log(err);
				return;
			}

	cb(null,{property:property});
	});
});

seneca.add({controller:'property',action:'list'},function(args,cb){
	var page = args.page || 1,
			query = args.query || {},
			limit = args.limit || 20;
	Property.findPaginated(query,'',page,limit).lean().exec(function(err,properties){
		console.log(err);
		if(err)
			return;

		cb(null,{properties:properties})
	});
});



seneca.add({controller:'property',action:'delete'},function(args,cb){
	var id = args.id;
	Property.findById(id,function(err,property){
		console.log("id que se esta borrando es ",id);
		if(err){
			seneca.act({model:'property',action:'error',when:'deleting',id:id,error:err},cb);
			return;
		}
		property.remove(function(err,result){
			if(err){
				seneca.act({model:'property',action:'error',when:'deleting',id:id,error:err},cb);
				return
			}
			cb(null,{property:property});
		});
	});
});

seneca.add({controller:'property',action:'update'},function(args,cb){
	var data = args.data;
	var id = args.id;
	Property.findById(id,function(err,property){
		console.log("id que se esta actualizando es ",id);
		if(err){
			seneca.act({model:'property',action:'error',when:'deleting',id:id,error:err},cb);
			return;
		}
		var property = _.extend(property,data);
		property.save(function(err){
			if(err){
				seneca.act({model:'property',action:'error',when:'updating',id:id,error:err},cb);
				return;
			}
			cb(null,{property:property});
		});
	});
});

