var bcrypt = require('bcrypt');

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

  it('Users should have an serializeUser function that returns user id', function(done){

    expect(Users).to.have.a.property('serializeUser');
    expect(Users.serializeUser).to.be.a('function');
    
    Users.create({email:'me2@rolilink.com',password:'12345678',name:'Rolando Perez'})
    .then(function(rUser){
      var serializedUser = Users.serializeUser(rUser);
      expect(serializedUser).to.be.equals(rUser.id);
      done();
    })
    .catch(done);
    
  });

  it('Users should have an deserializeUser function that returns user id', function(done){
    Users.create({email:'me3@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(rUser){
      Users.deserializeUser(rUser.id, function(dUser,err){
        expect(dUser).to.exist();
        expect(dUser).to.have.a.property('id',rUser.id);
        done();
      })
    })
    .catch(done);
  });

  it('should have a compare password function',function(done){
    Users.create({email:'me4@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      expect(user).to.have.a.property('comparePassword');
      expect(user.comparePassword).to.be.a('function');
      done();
    })
    .catch(done);
  });

  it('comparePassword function should compare received password with internal hash', function(done){
    var bcryptCompareSync = sinon.stub(bcrypt,'compareSync',function(password){ return password === '12345678'; });

    Users.create({email:'me5@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      expect(user.comparePassword('12345678')).to.be.equals(true);
      bcryptCompareSync.restore();
      done();
    })
    .catch(done);
  });

  it('comparePassword function should call bcrypt.compareSync for comparing the hash',function(done){
    var bcryptCompareSync = sinon.stub(bcrypt,'compareSync',function(){ return true; });

    Users.create({email:'me6@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      user.comparePassword('12345678');
      expect(bcryptCompareSync).to.have.been.calledOnce;
      bcryptCompareSync.restore();
      done();
    })
    .catch(done);
  });

  it('should hash the password before create',function(done){
    Users.create({email:'me7@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      expect(user.password).not.to.be.equals('12345678');
      done();
    })
    .catch(done);
  });

  it('should call bcrypt#hashSync for generating the hash',function(done){
    var bcryptHashSync = sinon.stub(bcrypt,'hashSync',function(){ return 'asdasdasdsasad'; });

    Users.create({email:'me8@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      expect(bcryptHashSync).to.have.been.calledOnce;
      bcryptHashSync.restore();
      done();
    })
    .catch(done);
  });

  it('should asign bcrypt#hashSync returned value as hash',function(done){
    var returnedValue = 'asdasdasdsasad';
    var bcryptHashSync = sinon.stub(bcrypt,'hashSync',function(){ return returnedValue; });

    Users.create({email:'me9@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      expect(user.password).to.be.equals(returnedValue);
      bcryptHashSync.restore();
      done();
    })
    .catch(done);
  });

});