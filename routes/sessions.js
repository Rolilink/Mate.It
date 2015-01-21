app.post('/login',passport.authenticate('local',{ successRedirect: '/',failureRedirect: '/login' , failureFlash: "Usuario o Contraseña Incorrecta"}));

app.get('/login',function(req,res){

	if(!req.isAuthenticated())
		res.render('sessions/login',{message:req.flash('error')});
	else
		res.redirect('/');
});	

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});