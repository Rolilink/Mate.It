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

});