var bcrypt = require('bcrypt'),
wolfpack = require('wolfpack'),
Users = wolfpack('api/models/Users');


describe('Users Model:',function(){

  var user = {
    name: 'Elon Musk',
    email: 'elon3@musk.com',
    password: 'spacexmusk'
  }

  before(function(){
    var ruser = { id: 1 };
    _.assign(ruser,user);
    Users.setCreateResults(user,ruser);
  });

  it('Users#protectedReadAttributes must return protected read attributes',function(){
   
    expect(Users).to.have.a.property('protectedReadAttributes');
    expect(Users.protectedReadAttributes).to.be.a('function');

    var protectedAttributes = Users.protectedReadAttributes();
    expect(protectedAttributes[0]).to.be.equals('password');
  });

  it('Users#protectedWriteAttributes and must return protected write attributes',function(){
   
    expect(Users).to.have.a.property('protectedWriteAttributes');
    expect(Users.protectedWriteAttributes).to.be.a('function');
    var protectedAttributes = Users.protectedWriteAttributes()
    expect(protectedAttributes[0]).to.be.equals('role');
  });

  it('user#toJSON must not return password',function(done){

    Users.create(user)
    .then(function(rUser){
      var json = rUser.toJSON();
      expect(json).not.to.have.a.property('password');
      done();
    })
    .catch(done);


  }); 

  /*it('Users#serializeUser should return user id', function(done){

    expect(Users).to.have.a.property('serializeUser');
    expect(Users.serializeUser).to.be.a('function');
    
    Users.create(user)
    .then(function(rUser){
      var serializedUser = Users.serializeUser(rUser);
      expect(serializedUser).to.be.equals(rUser.id);
      done();
    })
    .catch(done);
    
  });
  */

  // deserialize user should be mocked 
  /*it('Users#deserializeUser should return deserialized User', function(done){
    Users.create(user)
    .then(function(rUser){
      Users.deserializeUser(rUser.id, function(dUser,err){
        expect(dUser).to.exist();
        expect(dUser).to.have.a.property('id',rUser.id);
        done();
      })
    })
    .catch(done);
  });*/

  /*it('users#comparePassword should exist',function(done){
    Users.create(user)
    .then(function(user){
      expect(user).to.have.a.property('comparePassword');
      expect(user.comparePassword).to.be.a('function');
      done();
    })
    .catch(done);
  });

  it('user#comparePassword function should compare received password with internal hash', function(done){
    var bcryptCompareSync = sinon.stub(bcrypt,'compareSync',function(password){ return password === '12345678'; });

    Users.create({email:'me5@rolilink.com', password:'12345678',name:'Rolando Perez'})
    .then(function(user){
      expect(user.comparePassword('12345678')).to.be.equals(true);
      bcryptCompareSync.restore();
      done();
    })
    .catch(done);
  });

  it('user#comparePassword should call bcrypt#compareSync for comparing the hash',function(done){
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
*/

  it('should hash the password before create',function(done){
    Users.create(user)
    .then(function(rUser){
      expect(rUser.password).not.to.be.equals('12345678');
      done();
    })
    .catch(done);
  });

  it('should call bcrypt#hashSync for generating the hash',function(done){
    var bcryptHashSync = sinon.stub(bcrypt,'hashSync',function(){ return 'asdasdasdsasad'; });

    Users.create(user)
    .then(function(rUser){
      expect(bcryptHashSync).to.have.been.calledOnce;
      bcryptHashSync.restore();
      done();
    })
    .catch(done);
  });

  it('should asign bcrypt#hashSync returned value as hash',function(done){
    var returnedValue = 'asdasdasdsasad';
    var bcryptHashSync = sinon.stub(bcrypt,'hashSync',function(){ return returnedValue; });

    Users.create(user)
    .then(function(rUser){
      expect(rUser.password).to.be.equals(returnedValue);
      bcryptHashSync.restore();
      done();
    })
    .catch(done);
  });

});