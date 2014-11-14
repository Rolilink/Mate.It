var Schema = new mongoose.Schema({
	content:{type:String,required:true},
  user:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},
  property:{type:mongoose.Schema.Types.ObjectId, ref:'Property',index:true,required:true}
});

Schema.path('user').validate(function(value,done){
	var self = this;

	Comment.countQ({property:self.property,user:self.user})
		.then(function(n){
			if(n === 0)
				return done(true);
			else
				return done(false);
		})
		.catch(function(){
			done(false);
		});

},'user already posted a comment in this property');

Schema.path('property').validate(function(value,done){
	var self = this;

	Property.countQ({_id:self.property})
		.then(function(n){
			if(n === 0)
				return done(false);
			else
				return done(true);
		})
		.catch(function(){
			done(false);
		});

},'property does not exist');



var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;