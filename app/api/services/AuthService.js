/**
* AuthService.js
*
* @description :: Service for authenticating with passportjs.
* @docs        :: http://sailsjs.org/#!documentation/services
* @docs        :: http://passportjs.org/
*/

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
strategy = new LocalStrategy({usernameField:'email'},function(email,password,done){
  Users.findOne({email:email})
  .then(function(user){
    if(!user)
      return done(null,false,{message:'user don\'t exist'});

    if(!user.comparePassword(password))
      return done(null,false,{message:'passwords dont match'})
    
    done(null,user);
  })
  .catch(done);
});

passport.use(strategy);

module.exports = {
  serializeUser: function serializeUser(user,done){
    var userId = Users.serializeUser(user);
    done(null,userId);
  },
  deserializeUser: function deserializeUser(userId,done){
    Users.deserializeUser(userId,done);
  },
  login: function login(req,res,done){
    passport.authenticate('local',function(err,user){
      if(err)
        return done(false,err);
      
      if(!user)
        return done(false,new Error('user not found'));

      req.loginIn(user,function(err){
        if(err)
          return done(false,err);

        return done(true);
      });

    })(req,res,done);
  },
  logout: function logout(req){
    req.logout();
  },
  getPassport: function getPassport(){
    return passport;
  },
  getStrategy: function getStrategy(){
    return strategy;
  }
};