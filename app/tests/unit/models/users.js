var destroyAllUsers = function destroyAllUsers() {
  return Users.destroy({});
};

describe('Users Model:',function(){
  it('should exist',function(){
    expect(Users).to.exist();
  });

  before(function(done){
    destroyAllUsers()
    .then(function(){
      done();
    })
    .catch(function(err){
      done(err);
    });

  });

  after(function(done){
    destroyAllUsers()
    .then(function(){
      done();
    })
    .catch(function(err){
      done(err);
    });
    
  });

  it('should have attributes like: name, password, email, about, birthdate, active, profilePicture, role and listing.', function(){
    expect(Users._attributes).to.have.a.property('name');
    expect(Users._attributes).to.have.a.property('password');
    expect(Users._attributes).to.have.a.property('email');
    expect(Users._attributes).to.have.a.property('about');
    expect(Users._attributes).to.have.a.property('birthdate');
    expect(Users._attributes).to.have.a.property('active');
    expect(Users._attributes).to.have.a.property('profilePicture');
    expect(Users._attributes).to.have.a.property('role');
    expect(Users._attributes).to.have.a.property('listing');
  });

  it('should have a email required attribute',function(done){
    var userData = {
      name: 'Rolando Perez',
      password: '12345678',
    };

    Users.create(userData)
    .then(function(){
      done(new Error('It should not save the user'));
    })
    .catch(function(err){
      done();
    });

  });

  it('should have a name required attribute',function(done){
    var userData = {
      password: '12345678',
      email: 'me@rolilink.com'
    };

    Users.create(userData)
    .then(function(){
      done(new Error('It should not save the user'));
    })
    .catch(function(err){
      done();
    });

  });

  it('should have a password required attribute', function(done){
    var userData = {
      name: 'Rolando Perez',
      email: 'me@rolilink.com',
    };

    Users.create(userData)
    .then(function(){
      done(new Error('It should not save the user'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should have a email unique attribute', function(done){
    var userData = {
      name: 'Elon Musk',
      email: 'elon@musk.com',
      password: 'spacexmusk'
    }

    Users.create(userData)
    .then(function(){
      return Users.create(userData);
    })
    .then(function(){
      done(new Error('Should not create second user')); 
    })
    .catch(function(err){
      done();
    });
  });

  it('email attribute should only accept valid emails', function(done){
    var userData = {
      name: 'Elon Musk',
      email: 'elon2',
      password: 'spacexmusk'
    }

    Users.create(userData)
    .then(function(){
      done(new Error('It should not save the user'));
    })
    .catch(function(err){
      done();
    });  
  });

  it('password attribute must be 8 characters or larger', function(done){
    var userData = {
      name: 'Elon Musk',
      email: 'elon2@musk.com',
      password: 'space'
    }

    Users.create(userData)
    .then(function(){
      done(new Error('It should not save the user'));
    })
    .catch(function(err){
      done();
    });  

  });

  it('active attribute should default to true', function(done){
    var userData = {
      name: 'Elon Musk',
      email: 'elon23@musk.com',
      password: 'spacexmusk'
    }

    Users.create(userData)
    .then(function(user){
      expect(user).to.have.a.property('active',true);
      done();
    })
    .catch(function(err){
      console.log(err);
      done(err);
    });

  });

  it('should have a function called protectedReadAttributes and must return protected read attributes',function(){
   
    expect(Users).to.have.a.property('protectedReadAttributes');
    expect(Users.protectedReadAttributes).to.be.a('function');

    var protectedAttributes = Users.protectedReadAttributes();
    expect(protectedAttributes[0]).to.be.equals('password');
  });

  it('should have a function called protectedWriteAttributes and must return protected write attributes',function(){
   
    expect(Users).to.have.a.property('protectedWriteAttributes');
    expect(Users.protectedWriteAttributes).to.be.a('function');
    var protectedAttributes = Users.protectedWriteAttributes()
    expect(protectedAttributes[0]).to.be.equals('role');
  });

  it('when calling model.toJSON it should not return the password attribute',function(done){
    var userData = {
      name: 'Elon Musk',
      email: 'elon3@musk.com',
      password: 'spacexmusk'
    }

    Users.create(userData)
    .then(function(user){
      var json = user.toJSON();
      expect(json).not.to.have.a.property('password');
      done();
    })
    .catch(done);


  }); 

});