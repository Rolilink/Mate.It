var destroyAllUsers = function destroyAllUsers() {
  return Users.destroy({});
};

describe('Users associations:',function(){

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

  it('Should have a one to one association with listing via listing',function(done){
    var userData = {
      name: 'Rolando Perez',
      email: 'me@rolilink.com',
      password: '12345678'
    },
    listingData = {
      capacity: 3,
      price: 300,
      title: 'Hermoso apartamento en la avenida balboa',
      description: 'Esto es un ejemplo de una descripcion rapida de un apartamento.'
    };

    Listings.create(listingData)
    .then(function(listing){
      userData.listing = listing.id;

      return Users.create(userData);
    })
    .then(function(user){
      return Users.findOne(user.id).populate('listing');
    })
    .then(function(user){
      expect(user).to.have.a.property('listing');
      expect(user.listing).to.have.a.property('id',userData.listing);
      done();
    })
    .catch(done);


  });

  it('Should have a one to one association with photo via profilePicture', function(done){
    
    var userData = {
      name: 'Rolando Perez',
      email: 'mew@rolilink.com',
      password: '12345678'
    },
    photoData = {
      fileType: 'png',
      url: 'http://placehold.it/200x200',
      width: 200,
      height: 200
    };

    Photos.create(photoData)
    .then(function(photo){
      userData.profilePicture = photo.id;

      return Users.create(userData);
    })
    .then(function(user){
      return Users.findOne(user.id).populate('profilePicture');
    })
    .then(function(user){
      expect(user).to.have.a.property('profilePicture');
      expect(user.profilePicture).to.have.a.property('url',photoData.url);
      done();
    })
    .catch(done);
  });

});