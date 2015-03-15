var Sails = require('sails'),
    sails,
    chai = require('chai'),
    expect = chai.expect
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');


chai.use(sinonChai);


GLOBAL.expect = expect;
GLOBAL.sinon = sinon;

before(function(done) {
  this.timeout(10000);
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
