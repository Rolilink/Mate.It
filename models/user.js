//TODO: Test both invitation flows, clean, optimize and commit 

var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10,
crypto = require('crypto'),
validate = require('mongoose-validator').validate
troop = require('mongoose-troop'),
path = require('path');


var Schema = new mongoose.Schema({
	name: {type:String,validate:[validate('len',1,50),validate('regex',/^[A-Za-z ]+$/)]},
	password: {type:String,required:true,validate:[validate('len',6)]},
	username: {type:String,unique:true,required:true,validate:[validate('len',6,20),validate('regex',/^[a-z A-Z][a-zA-Z0-9_\-]+[a-zA-Z0-9]+$/)]},
	email: {type:String,unique:true,required:true,validate:[validate('isEmail')]},
	country: String,
	birthdate: Date,
	emailKey: String,
	active: {type:Boolean,default:false},
  createdAt:{type:Date,default:Date.now()},
  role: {type:String,default:"user"},
  profilePicture: {type:String},
  property: {
    isOwner: {type:Boolean},
    data: {type: mongoose.Schema.Types.ObjectId,ref:'Property'}
  }
});

//Encrypt password in the database
Schema.plugin(troop.timestamp);
var paginate = require('./plugins/paginate');
Schema.plugin(paginate);

Schema.pre('save',function(next,done){
	var self = this;
    if (!self.isModified('password')){
      next();
      return done();
    };

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err)
      next(err);
    else{
      bcrypt.hash(self.password,salt,function(err,hash){
        if(err)
          next(err)
        else{
          self.password = hash;
          next();
          done();
        }
      });
    }
  });
});

// Save emailKey for validation
Schema.pre('save',function(next,done){
  var self = this;
  if (!self.isModified('email') || !self.isModified('username')){
      next();
      return done();
    };

  var hash = crypto.createHash('md5').update(this.email + this.username ).digest("hex");
	this.emailKey = hash;
  next();
  done();
});


Schema.methods.compareHash = function(rpassword){
	return bcrypt.compareSync(rpassword,this.password);
};

Schema.methods.setProfilePicture = function(file){
  var self = this,
  deferred = q.defer(),
  fileName = self.username + path.extname(file.originalFilename),
  uploadPath = appRoot + "/public/uploads/profile/" + fileName,
  readPath = file.path;
  if( ! /image/.test(file.headers['content-type']) ){
    deferred.reject("file is not an image.");
    return deferred.promise;
  }

  seneca.act({controller:'files',action:'upload', readPath: readPath, writePath: uploadPath },function(err,result){ 
    if(err)
      deferred.reject(err);

    var filePath = path.relative(app.get("publicdir"),result.filePath);
    self.profilePicture = filePath;
    deferred.resolve(self);
  });

  return deferred.promise;
};

Schema.methods.addProperty = function(propertyId){
  this.property = {
    isOwner: true,
    data: propertyId
  };
};

Schema.methods.removeProperty = function(){
  this.property = { };
};


Schema.methods.joinProperty = function(property){
  var self = this;
  // Add Habitant
  self.property = {
    isOwner:false,
    data:property.id
  };

  property.addHabitant(self.id);
  
  return property.saveQ();
};

Schema.methods.leaveProperty = function(){
  this.property = null;
};

Schema.methods.isOwner = function(propertyId){
  if(this.property)
    return propertyId == this.property.data && this.property.isOwner; 
}

Schema.methods.haveProperty = function(){
  if(this.property.data)
    return true;
  else 
    return false;
};

Schema.methods.ownsAProperty = function(){
  if(this.property)
    return this.property.isOwner;
  return false;
};

Schema.methods.ownProperty = function(propertyId){
  this.property = {
    isOwner:true,
    data: propertyId
  }
  console.log(this);
  return this;
}

module.exports = Schema;