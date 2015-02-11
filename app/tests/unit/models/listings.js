describe('Listings Model:',function(){
  
  var listingData = {
    title: 'This is an example title for this testing property.',
    price: 200,
    capacity: 3,
    description: 'This is a really long description just to test that this property is working well'
  };

  it('should exist',function(){
    expect(Listings).to.exist();
  });

  it('should contain attributes like: capacity, listed, address, price, roomType, propertyType, description, title, genderAllowed and amenities',function(){
    expect(Listings._attributes).to.have.a.property('capacity');
    expect(Listings._attributes).to.have.a.property('listed');
    expect(Listings._attributes).to.have.a.property('address');
    expect(Listings._attributes).to.have.a.property('price');
    expect(Listings._attributes).to.have.a.property('roomType');
    expect(Listings._attributes).to.have.a.property('propertyType');
    expect(Listings._attributes).to.have.a.property('description');
    expect(Listings._attributes).to.have.a.property('title');
    expect(Listings._attributes).to.have.a.property('genderAllowed');
    expect(Listings._attributes).to.have.a.property('amenities');
  });

  it('should have a default value for properties like: roomType, propertyType and genderAllowed.',function(done){
    var data = listingData;
    Listings.create(data)
    .then(function(listing){
      expect(listing).to.have.property('roomType','private');
      expect(listing).to.have.property('propertyType','apartment');
      expect(listing).to.have.property('genderAllowed','both');
      expect(listing).to.have.property('listed',true);
      done();
    })
    .catch(function(err){
      done(err);
    });

  });

  it('should have required title attribute.',function(done){
    var data = {
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should have required description attribute.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should have required price attribute.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should have required capacity attribute.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      description: 'This is a really long description just to test that this property is working well'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should validate that amenities are part of a valid list of amenites.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well',
      amenities:['invalid']
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should validate that propertyType value is part of a valid list of types.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well',
      propertyType: 'invalid'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should validate that propertyType value is part of a valid list of types.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well',
      propertyType: 'invalid'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should validate that roomType value is part of a valid list of types.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well',
      roomType: 'invalid'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

  it('should validate that genderAllowed value is part of a valid list of types.',function(done){
    var data = {
      title: 'This is an example title for this testing property.',
      price: 200,
      capacity: 3,
      description: 'This is a really long description just to test that this property is working well',
      genderAllowed: 'invalid'
    };

    Listings.create(data)
    .then(function(listing){
      done(new Error('Should throw an validation error.'));
    })
    .catch(function(err){
      done();
    });
  });

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



});