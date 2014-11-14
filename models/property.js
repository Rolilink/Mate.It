var validate = require('mongoose-validator').validate,
troop = require('mongoose-troop'),
fs = require('fs'),
path  = require('path'),
uuid = require('node-uuid');

//TODO: Habitant relationship - Habitants Field


var Schema = new mongoose.Schema({
	capacity:{required:true,type:Number,min:1}, //ok
	available:{type:Boolean,default:true}, //ok
	country:{required:true,type:String}, //ok
	address:{required:true,type:String,validate:[validate('len',10,70)]}, //ok
	loc:{required:true,type:[Number],index:'2dsphere'},
	price:{required:true,type:Number,min:1},
	createdAt:{type:Date,default:Date.now()},//ok
	roomType:{type:String,enum:['private','shared'],default:"private"}, //ok
	propertyType:{type:String,enum:['apartment','house','other'],default:"apartment"}, //ok
	description:{required:true,type:String,validate:[validate('len',10,500)]}, //ok 
	title:{required:true,type:String,validate:[validate('len',5,140)]}, // ok
	photos:[{url:String,description:String}],
	genderAllowed:{type:String,enum:['male','female','both'],default:"both"},
	owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
	habitants:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
	amenities:[{type:String,enum:['kitchen','internet','tv','wifi','air_conditioning','washer','dryer','cable_tv','pets_allowed','gym','pool','smoking_allowed']}]
});	

Schema.methods.addPicture = function(file){
	var deferred = q.defer(),
	readPath = file.path,
	fileName = uuid.v1()+ path.extname(file.originalFilename),
	uploadPath = appRoot + "/public/uploads/properties/" + fileName,
	self = this;

	if( ! /image/.test(file.headers['content-type']) ){
    deferred.reject("file is not an image.");
    return deferred.promise;
  }

  seneca.act({controller:'files',action:'upload', readPath: readPath, writePath: uploadPath},function(err,result){
  	if(err)
  		return deferred.reject(err);
  	var filePath = path.relative(app.get("publicdir"),result.filePath);
    self.photos.push({id:fileName,url:filePath});
    deferred.resolve(self);	
  });
	
	return deferred.promise;
};

Schema.methods.removePicture = function(id){
	var deferred = q.defer(),
	photo = this.photos.id(id),
	filepath,
	self = this;

	if(!photo){
		var error = new Error('PhotoNotFound')
		error.name = "PhotoNotFound";
		deferred.reject(error);
	}else{
		filePath = appRoot + "/public/" + photo.url;
	}

	seneca.act({controller:'files',action:'delete',filePath:filePath},function(err,result){
		if(err)	
			deferred.reject(err);
		self.photos.remove(id);
		deferred.resolve(self);
	});
	return deferred.promise;
}

Schema.methods.listPictures = function(){
	return this.photos;
}

Schema.methods.setOwner = function(ownerId){
	if(!this.owner)
		this.owner = ownerId
};

Schema.methods.addHabitant = function(userid){
	this.habitants.push(userid);

	if(this.habitants === this.capacity)
		this.available = false;
};

Schema.methods.isFull = function(){
	return this.habitants.length >= this.capacity;
};

// Validate capacity > habitants.length
Schema.pre('save',function(next){
  var self = this;
  
  if (!self.isModified('capacity')){
    return next();
  };

  if(self.capacity === self.habitants.length){
  	this.available = false;
  	next();
  }

  next();
});

Schema.path('capacity').validate(function(value,done){
 	var self = this;

  if(self.habitants.length > 0 && self.capacity < self.habitants.length){
  	return done(false);
  }

  done(true);

},'cannot update capacity below current quantity of habitants');

Schema.plugin(troop.timestamp);
var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
Schema.plugin(troop.timestamp); //ok
module.exports = Schema;
