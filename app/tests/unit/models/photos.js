describe('Photos Model:',function(){
  
  it("should exist",function(){
    expect(Photos).to.exist();
  });

  it("should have attributes like: listing,url,fileType,width and height",function(){
    expect(Photos._attributes).to.have.a.property('listing');
    expect(Photos._attributes).to.have.a.property('url');
    expect(Photos._attributes).to.have.a.property('fileType');
    expect(Photos._attributes).to.have.a.property('width');
    expect(Photos._attributes).to.have.a.property('height');
  });

  it("should require to have an url field",function(done){
    
    var photoData = {
      fileType: 'png',
      width: 200,
      height: 200
    };

    Photos.create(photoData)
    .then(function(){
      done(new Error('It should not create photo.'));
    })
    .catch(function(err){
      done();
    });

  });

  it("should have an url attribute that contains a valid url value",function(done){

    var photoData = {
      fileType: 'png',
      url: 'invalid url',
      width: 200,
      height: 200
    };

    Photos.create(photoData)
    .then(function(){
      done(new Error('It should not create photo.'));
    })
    .catch(function(err){
      done();
    });

  });

});