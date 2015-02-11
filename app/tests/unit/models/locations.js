describe('Locations Model:',function(){
  
  it("should exist",function(){
    expect(Locations).to.exist();
  });

  it("should have an coordinates attribute",function(){
    expect(Locations._attributes).to.have.a.property('coordinates');    
  });

  it("should only accept valid geojson point data in the coordinates attribute",function(done){
    var notAPoint = {
      type: "point"
    };

    Locations.create({coordinates:notAPoint})
    .then(function(){
      done(new Error('It should not create the model'));
    })
    .catch(function(err){
      done();
    });

  });

  it("should have a one to one relationship with a Listing via the listing attribute", function(done){
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

    Listings.create(listingData)
    .then(function(listing){
      locationData.listing = listing.id;
      return Locations.create(locationData);
    })
    .then(function(location){
      return Locations.findOne(location.id).populate('listing');
    })
    .then(function(location){
      expect(location.listing).to.have.a.property('title',listingData.title);
      done();
    })
    .catch(function(err){
      done(err);
    });

  });

});