app.post('/login',
passport.authenticate('local'),
function(req, res) {
	console.log('authenticated');
  res.status(200).json({auth:true});
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});