/* 
 * User Controller
 * @author: Rolilink
 */


/*
 * Login Action: Creates User
 * controller: user
 * action: create
 */

 var _ = require('underscore');



 //TODO: Recreate as promise based chain
seneca.add({controller:'user',action:'create'},function(args,cb){
	User.count(function(err,count){
		var data = _.omit(args.data,['role','emailKey','active','aId','profilePicture']),
				createdUser = new User(data);
		console.log('seneca');
		if(args.file){
			createdUser.setProfilePicture(args.file,function(err,path){
				createdUser.save(function(err){
					if(err)
						return cb(err);

					cb(null,{user:createdUser});
				});
			});
			return;
		}

		console.log("por aqui paso");

		createdUser.save(function(err){
			console.log('saved');
			if(err){
				//pass error to be handled for error handler			
				seneca.act({model:'user',action:'error',when:'created',data:data,error:err},cb);
				return;
			}

			cb(null,{user:createdUser});
		});
	});
});

/* 
	* List User Controller
	* List Users in the system by providing some data that they contains
	* Params:
	*	query.data [JSON] Object containg the data to query.
	* query.page [Integer] Number of page 
*/

seneca.add({controller:'user',action:'list'},function(args,cb){
	var page = args.page || 0,
			query = args.query || {},
			limit = args.limit || 10;

	User.findPaginated(query,'-password -emailKey -aId',page,limit).lean().exec(function(err,users){
		if(err){
			//pass error to be handled for error handler			
			console.log("listed");
			seneca.act({model:'user',action:'error',when:'listing',query:query,error:err},cb);
			return;
		}

		cb(null,{users:users});
	});
});

seneca.add({controller:'user',action:'get'},function(args,cb){
	
	User.findById(args.id,'-password -emailKey -aId').lean().exec(function(err,user){
		if(err){
			seneca.act({model:'user',action:'error',when:'listing',query:query,error:err},cb);
			return;
		}

		cb(null,{user:user});
	});
});

seneca.add({controller:'user',action:'delete'},function(args,cb){
	var id = args.id;
	User.findById(id).exec(function(err,user){
		if(err){
			//pass error to be handled for error handler			
			seneca.act({model:'user',action:'error',when:'deleting',id:id,error:err},cb);
			return;
		}
		user.remove(function(err,product){
			if(err){
				//pass error to be handled for error handler			
				seneca.act({model:'user',action:'error',when:'deleting',id:id,error:err},cb);
				return;
			}
			cb(null,{user:user});
		});
	});
});

seneca.add({controller:'user',action:'update'},function(args,cb){
	var data = _.omit(args.data,['role','emailKey','active','aId','profilePicture']),
			id = args.id;
	User.findById(id,'-password -emailKey',function(err,user){
		if(err){
			//pass error to be handled for error handler			
			seneca.act({model:'user',action:'error',when:'updating',id:id,error:err},cb);
			return;
		}
		var user = _.extend(user,data);

		if(args.file){
			user.setProfilePicture(args.file,function(err,path){
				user.save(function(err){
					if(err)
						return cb(err);

					cb(null,{user:user});
				});
			});
			return;
		};
			
		user.save(function(err){
			if(err){
				//pass error to be handled for error handler			
				seneca.act({model:'user',action:'error',when:'updating',id:id,error:err},cb);
				return;
			}
			cb(null,{user:user});
		});
	});
});