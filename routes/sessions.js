app.post('/login',
passport.authenticate('local'),
function(req, res) {
	console.log('authenticated');
  res.status(200).json({auth:true});
});

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