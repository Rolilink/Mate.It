var crypto = require('crypto');

var Schema = new mongoose.Schema({
  host:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
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
		deferred.resolve("sended");
	})
	.catch(function(err){
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

	User.findQ({email:self.email})
	.then(function(err,user){
		
		if(err)
			deferred.reject(err);

		if(user.haveProperty)
			deferred.reject("have property");

		deferred.resolve(exist);

	});

	return deferred.promise;
}

Schema.methods._sendEmail = function(opts){
	var deferred = q.defer();

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

	User.countQ({email:self.email}).then(function(err,count){
		if(err)
			return deferred.reject(err);
		deferred.resolve(count > 0);
	});

	return deferred.promise;
}

Schema.methods.getEmailOpts = function(exist){
	var deferred = q.defer()
	opts = {};
	opts.template_name = self.getTemplateName(exist);
	opts.template_content = [];
	self.getMessage()
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
		User.findQ({email:self.email})
		.then(function(err,user){
			
			if(err)
				deferred.reject(err)

			content.push({name:"invited",content: user.username});
			content.push({name:"link",content:"http:localhost:3000/signup?invkey=" + key});
			deferred.resolve(content);
		});
	}else{	
		content.push({name:"INVITE_LINK",content:"http:localhost:3000/invitation/"+ key});
		deferred.resolve(content);
	}

	return deferred.promise;
}

Schema.methods.consume = function(currentUser){
	var deferred = q.defer(),
	self = this,
	handleError = function(err){ return deferred.reject(err); },
	handleSuccess = function(data){ return deferred.resolve(self); };

	// populates the invitation model and return a combined promise
	var populations = q.all([
		this.populateHost(),
		this.populateProperty()
	]);

	populations.then(function(){
		// validate Invitation
		var result = self.canConsume(currentUser,self.property);
		
		if(!result.isValid) return handleError(result.reason);
		
		currentUser.joinProperty(self.property)
		.then(function(){ return currentUser.saveQ(); })
		.then(function(){
			self.used = true;
			return self.saveQ();
		})
		.then(handleSuccess)
		.catch(handleError)
		.done();

	},handleError);


	return deferred.promise;
}

Schema.methods.canConsume = function(user,property){
	if(property.isFull())
		return {isValid:false, reason: "The property is full"}

	if(user.email != this.email)
		return {isValid: false, reason: "This User is not owner of the invitation"}

	if(user.ownsAProperty())
		return {isValid: false, reason: "User is property owner"}

	if(user.haveProperty())
		return {isValid: false, reason: "User is already in a property"}

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
		deferred.resolve(message);
	})
	.catch(deferred.reject);
	return deferred.promise;
}

var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;