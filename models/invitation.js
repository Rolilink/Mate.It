var crypto = require('crypto');

var Schema = new mongoose.Schema({
  host:{type:mongoose.Schema.Types.ObjectId, ref:'User',},
  property:{type:mongoose.Schema.Types.ObjectId, ref:'Property'},
  key: String,
  email:String,
  used:{type:Boolean,default:false}
});

Schema.methods.generateKey = function(){
	this.key = crypto.createHash('md5').update(this.email).digest("hex");
	return this.key;
}

Schema.methods.populateHost = function(){
	return Invitation.populateQ(this,{path:'host',model:'User'});
}

Schema.methods.populateProperty = function(){
	return Invitation.populateQ(this,{path:'property',model:'Property'});
}

Schema.methods.sendEmail = function(){
	var deferred = q.defer();
	message = {},
	self = this;

	var populations = q.all([
		self.populateHost(),
		self.populateProperty()
	]);

	populations
	.then(self.userExist)
	.then(self.canSendEmail)
	.then(self.getEmailOpts)
	.then(self._sendEmail)
	.then(function(result){
		deferred.resolve({status:201,response:"sended"});
	})
	.catch(function(err){
		if(err.status)
			return deferred.resolve(err);
		deferred.reject(err);
	})
	.done();
	
	return deferred.promise;
}

Schema.methods.canSendEmail = function(exist){
	var deferred = q.defer();
	// If it does not exist just continue and send invitation
	if(!exist)
		return	deferred.resolve(exist)

	User.find({email:self.email}).execQ()
	.then(function(users){
		var user = users[0];

		if(user.haveProperty())
			deferred.reject({status:422,err:"user is already a roommate of a property"});

		if(self.property.isFull())
			deferred.reject({status:422,err:"Property is full can't send more invitations"});

		deferred.resolve(exist);

	})
	.catch(function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

Schema.methods._sendEmail = function(opts){
	var deferred = q.defer();
	console.log(opts);
	emailClient.messages.sendTemplate(
		opts,
		function(result){
			deferred.resolve();
		},
		function(err){
			deferred.reject(err);
		}
	);
	return deferred.promise;
}

Schema.methods.userExist = function(id){
	var deferred = q.defer();

	User.countQ({email:self.email}).then(function(count){
		deferred.resolve(count > 0);
	})
	.catch(function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

Schema.methods.getEmailOpts = function(exist){
	var deferred = q.defer()
	opts = {};
	opts.template_name = self.getTemplateName(exist);
	opts.template_content = [];
	self.getMessage(exist)
	.then(function(message){
		opts.message = message;
		deferred.resolve(opts);
	})
	return deferred.promise;
}

Schema.methods.getTemplateName = function(exist){
	var key = self.key || self.generateKey();
	var templateName = "";

	if(exist){
		templateName = "invitacion-usuario"
	}else{
		templateName = "invitacion-no-usuario"
	}
	
	return templateName;
}

Schema.methods.getMergeVars = function(exist){
	var deferred = q.defer(),
	key = self.key || self.generateKey(),
	content = [{name:"HOST_NAME",content:self.host.username}];
	
	if(exist){
		User.findOneQ({email:self.email})
		.then(function(user){
			console.log(user);
			content.push({name:"invited",content: user.username});
			content.push({name:"link",content:"http:localhost:3000/invitation/"+ key});
			deferred.resolve(content);
		})
		.catch(function(err){
			deferred.resolve(err);
		});
	}else{	
		content.push({name:"INVITE_LINK",content:"http:localhost:3000/user/new?invkey=" + key});
		deferred.resolve(content);
	}

	return deferred.promise;
}

Schema.methods.consume = function(currentUser){
	var deferred = q.defer(),
	self = this,
	handleError = function(err){ 
		return deferred.reject(err); 
	},
	handleResponse = function(data){ return deferred.resolve(data); };

	// populates the invitation model and return a combined promise
	var populations = q.all([
		this.populateHost(),
		this.populateProperty()
	]);

	populations.then(function(){
		// validate Invitation
		var result = self.canConsume(currentUser,self.property);
		
		if(!result.isValid) return handleResponse({status:result.status,err:result.reason});
		
		currentUser.joinProperty(self.property)
		.then(function(){ return currentUser.saveQ(); })
		.then(function(){
			self.used = true;
			return self.saveQ();
		})
		.then(function(){
			handleResponse({
				status:200,
				response:{
					status:"consumed",
					key:self.key,
					consumedBy:self.email
				}
			})
		})
		.catch(handleError)
		.done();

	},handleError);


	return deferred.promise;
}

Schema.methods.canConsume = function(user,property){
	if(user.email != this.email)
		return {isValid: false,status:401,reason: "This User is not owner of the invitation"}

	if(!property)
		return {isValid: false,status:422,reason: "property associated to this invitation no longer exist"}

	if(property.isFull())
		return {isValid:false, status:422, reason: "property associated to this invitation is full"}

	if(user.ownsAProperty())
		return {isValid: false,status:422, reason: "User is property owner"}

	if(user.haveProperty())
		return {isValid: false,status:422, reason: "User is already in a property"}

	return {isValid: true};
};

Schema.methods.getMessage = function(exist){
	var deferred = q.defer(),
	message =  {
		subject:"Invitacion de Roommate",
		from_email:"invitations@mate.it",
		from_name:"Invitaciones Mate It",
		to:[
			{
				email: this.email,
				name: this.email,
				type: "to"
			}
		]
	};
	self.getMergeVars(exist)
	.then(function(merge_vars){
		message.global_merge_vars = merge_vars;
		console.log(message);
		deferred.resolve(message);
	})
	.catch(deferred.reject);
	return deferred.promise;
}

var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;