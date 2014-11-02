// Default test for verifying if app instantiation is working
describe("App",function(){
	
	it("should load models",function(){
		expect(User).not.to.be.undefined; 
	});

	it("should be loading testing configuration", function(){
		expect(config).to.have.deep.property('stores.testing');
	});

});
