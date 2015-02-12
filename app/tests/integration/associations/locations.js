describe('Locations associations:',function(){
  
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