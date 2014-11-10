var utils = require('../utils'),
request = require('supertest-as-promised'),
eraseDb = require ('../utils').eraseDatabase,
UsersData = require('../utils').properties;

describe.only("Properties",function(){
	
	describe("Create",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should create a property when doing a valid post");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 422 and an errors object when missing required fields");
		it("should respond with a 422 and an errors object containing a validation error per field when failing validation");

		//Finish create#describe()
	});

	describe("List",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should respond with a list of properties when doing a valid query");
		it("should respond with a 401 when user is not authenticated");

		// finish list#describe()
	});

	describe("Get",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should respond with the property when doing a valid get");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 404 when property does not exist");
		it("should respond with 422 when giving a bad id");

		//finish get#describe()
	});

	describe("Update",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should update the property when doing a valid get");
		it("should respond with 404 when property does not exist");
		it("should respond with 422 when giving a bad id");
		it("should respond with a 422 and an errors object containing a validation error per field when failing validation");
		it("should respond with 401 when user is not property owner or is not admin");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 404 when property does not exist");
		it("should respond with 422 when giving a bad id");
		
	});

	describe("Delete",function(){
		var data;

		it("should have a property model available",function(){
			expect(Invitation).not.to.be.undefined;
		});

		it("should delete a property when doing a sucessful delete request");
		it("should respond with 401 when user is not authenticated");
		it("should respond with 404 when property does not exist");
		it("should respond with 401 when user is not property owner or is not admin");
		it("should respond with 422 when giving a bad id");


		// finish delete#describe()
	})

// finish properties#describe()
});