var crypto = require('crypto');

var Schema = new mongoose.Schema({
  host:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  property:{type:mongoose.Schema.Types.ObjectId, ref:'Property'},
  key: String,
  email:String
});

Schema.methods.generateKey = function(){
	this.key = crypto.createHash('md5').update(this.email).digest("hex");
	return this.key;
}

Schema.methods.sendEmail = function(){
	var deferred = q.defer();
	message = {},
	self = this;
	console.log(this);
	User.count({email:this.email},function(err,count){
		message = self.getMessage(count > 0);
		emailClient.messages.send(
			{message:message, async:true},
			function(result){
			// success function
			deferred.resolve(result);
			},
			function(e){
			// error function
			deferred.reject(e);
		}
	);
	});
	
	
	return deferred.promise
}

Schema.methods.getMessage = function(exist){
	var key = this.key || this.generateKey();
	var message = {};

	if(exist){
		message = {
			text: "http:localhost:3000/invitation/"+ key,
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
	}else{
		message = {
			text: "http:localhost:3000/signup?invkey=" + key,
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
		}
	}
	
	return message;
}

var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;