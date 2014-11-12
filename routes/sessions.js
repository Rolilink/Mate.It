app.post('/login',passport.authenticate('local',{ successRedirect: '/',failureRedirect: '/login' }));

app.get('/login',function(req,res){
	if(!req.isAuthenticated())
		res.render('sessions/login',{});
	else
		res.redirect('/');
});	

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});