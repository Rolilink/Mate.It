app.get('/test/email',function(req,res){
	var message = {
		text: "hello world this is a test",
		subject:"test",
		from_email:"not.answer@mate.it",
		from_name:"Testing System",
		to:[
			{
				email: req.param('email'),
				name: req.param('name'),
				type: "to"
			}
		]
	};



	emailClient.messages.send({message:message,async:true},function(result){
		res.status(200).send('sended');
	},function(e){	
		res.status(500);
		console.log(e);
	});
});