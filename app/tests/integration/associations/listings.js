describe('Listings associations:',function(){
  it('should have a one to one relationship with a location via location attribute',function(done){
    var listingData = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well'
    },
    locationData = {
      coordinates: {
        type: "point",
        coordinates: [9.006654, -79.504121]
      }
    };

    Locations.create(locationData)
    .then(function(location){
      listingData.loc = location.id;
      return Listings.create(listingData);
    })
    .then(function(listing){
      return Listings.findOne(listing.id).populate('loc');
    })
    .then(function(listing){
      expect(listing.loc).to.have.a.property('coordinates');
      done();
    })
    .catch(function(err){
      done(err);
    });

  });

  it('should have a one to many association with users via habitants',function(done){
    var listingData = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well'
    },
    user1Data = {
      name: 'Mark Zuckerberg',
      email: 'mark@zuck.com',
      password: '12345678'
    },
    user2Data = {
      name: 'Mark Zuckerberg',
      email: 'mark2@zuck.com',
      password: '12345678'
    };

    Listings.create(listingData)
    .then(function(listing){
      user1Data.listing = listing.id;
      user2Data.listing = listing.id;

      return [Users.create(user1Data),Users.create(user2Data)];
    })
    .spread(function(user1,user2){
    
      return Listings.findOne(user1Data.listing).populate('habitants');
    })
    .then(function(listing){
      expect(listing).to.have.property('habitants');
      expect(listing.habitants).to.exist();
      expect(listing.habitants).to.have.length(2);
      done();
    })
    .catch(done);

  });

  it('should have a one to many associations with photo via photos',function(done){
    var listingData = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well'
    },
    photo1Data = {
      fileType: 'png',
      url: 'http://placehold.it/200x200',
      width: 200,
      height: 200
    },
    photo2Data = {
      fileType: 'png',
      url: 'http://placehold.it/200x200',
      width: 200,
      height: 200
    };

    Listings.create(listingData)
    .then(function(listing){
      photo1Data.listing = listing.id;
      photo2Data.listing = listing.id;

      return [Photos.create(photo1Data),Photos.create(photo2Data)];
    })
    .spread(function(photo1,photo2){
      return Listings.findOne(photo1Data.listing).populate('photos');
    })
    .then(function(listing){
      expect(listing).to.have.a.property('photos');
      expect(listing.photos).to.exist();
      expect(listing.photos).to.have.length(2);
      done();
    })
    .catch(done);
  });
  
});