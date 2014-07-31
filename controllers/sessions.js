// Passport User based Session Configuration

var serializeUser = function(user,done){
	console.log('serializing');
	done(null,user.id);
};

var deserializeUser = function(id,done){
	seneca.act({controller:'user',action:'get',id:id,blacklist:'-password -emailKey -aId'},function(err,result){
		if(err)
			return done(err);
		return done(null,result.user);
	});
};


var checkUserCredentials = function(username,password,done){
	seneca.act({controller:'user',action:'list',query:{username:username},limit:1,page:1,blacklist:'-emailKey -aId'},function(err,result){
		if(err){
			console.log(err);
			return done(err);
		}

		var user = result.users[0];


		// if there is no user returned
		if(!user){
			console.log('this is really bad');
			return done(null,false,{message:"Incorrect Username"});
		}

		// if there is no password returned

		if(!user.compareHash(password)){
			console.log('its not ok');
			return done(null,false,{message:"Incorrect Password"});
		}

		return done(null,user);
	});	
};


passport.use(new LocalStrategy(checkUserCredentials));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);