var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10,
crypto = require('crypto'),
validate = require('mongoose-validator').validate
troop = require('mongoose-troop'),
path = require('path');

var Schema = new mongoose.Schema({
	name: {type:String,required:true,validate:[validate('len',1,50),validate('regex',/^[A-Za-z ]+$/)]},
	password: {type:String,required:true,validate:[validate('len',6,20)]},
	username: {type:String,required:true,unique:true,index:true,validate:[validate('len',6,20),validate('regex',/^[a-z A-Z][a-zA-Z0-9_\-]+[a-zA-Z0-9]+$/)]},
	email: {type:String,required:true,unique:true,index:true,validate:[validate('isEmail')]},
	country: String,
	birthdate: Date,
	emailKey: String,
	active: {type:Boolean,default:false},
  createdAt:{type:Date,default:Date.now()},
  role: {type:String,default:"user"},
  profilePicture: {type:String},
  aId: {type: Number, unique:true}
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

Schema.methods.setProfilePicture = function(file,cb){
  var self = this;

  if( ! /image/.test(file.headers['content-type']) ){
    return cb("File is not a Image");
  }

  seneca.act({controller:'files',action:'upload',file:file,fileName: self.username + path.extname(file.name), destFolder:"profile" },function(err,result){ 
    self.profilePicture = path.relative(app.get("publicdir"),result.path);
    cb(null,self.profilePicture);
  });
};





module.exports = Schema;