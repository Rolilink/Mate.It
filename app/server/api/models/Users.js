var bcrypt = require('bcrypt');

/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      email: true
    },
    about: 'string',
    birthdate: 'date',
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    profilePicture: {
      model: 'photos'
    },
    role: {
      type: 'string',
      defaultsTo: 'user'
    },
    listing: {
      model: 'listings'
    },
    toJSON: function toJSON(){
      var obj =  _.omit(this.toObject(),Users.protectedReadAttributes());
      return obj;
    },
    comparePassword: function comparePassword(password){
      return bcrypt.compareSync(password,this.password);
    }
  },
  beforeCreate: function beforeCreate(values,cb){
    var salt = bcrypt.genSaltSync();
    values.password = bcrypt.hashSync(values.password,salt);
    cb();
  },
  protectedReadAttributes: function protectedReadAttributes(){
    return ['password'];
  },
  protectedWriteAttributes: function protectedWriteAttributes(){
    return ['role'];
  },
  serializeUser: function serializeUser(user) {
    return user.id;
  },
  deserializeUser: function deserializeUser (userId,done) {
    Users.findOne(userId)
    .then(function(user){
      done(user,null);
    })
    .catch(function(err){
      done(null,err);      
    });
  }
};

