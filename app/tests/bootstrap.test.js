var Sails = require('sails'),
  sails,
  chai = require('chai'),
  expect = chai.expect;


before(function(done) {
  this.timeout(5000);
  console.log('before');
  Sails.lift({
    port: 1200
  }, function(err, server) {
    sails = server;
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

describe("App",function(){
  
  it("should be running in port 1200",function(){
    expect(sails.config.port).to.be.equals(1200);
  });
  
});
