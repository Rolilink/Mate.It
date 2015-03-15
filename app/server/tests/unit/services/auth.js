/*describe('AuthService', function(){

  it('should exist',function(){
    expect(AuthService).to.exist();
  });

  it('should contain a serializeUser function', function(){
    expect(AuthService).to.have.a.property('serializeUser');
    expect(AuthService.serializeUser).to.be.a('function');
  });

  it('AuthService#serializeUser should call Users#serializeUser',function(){
    var UsersSerialize = sinon.stub(Users,'serializeUser'),
    cb = sinon.spy();

    AuthService.serializeUser({},cb);

    expect(cb).to.have.been.calledOnce;
    expect(UsersSerialize).to.have.been.calledOnce;
    UsersSerialize.restore();

  });

  it('should contain a deserializeUser function',function(){
    expect(AuthService).to.have.a.property('deserializeUser');
    expect(AuthService.deserializeUser).to.be.a('function');
  });

  it('AuthService#deserializeUser should call Users#deserializeUser',function(){
    
    var UsersdeSerialize = sinon.stub(Users,'deserializeUser',function(userId,fn){
      fn(null,{});
    }),
    cb = sinon.spy();

    AuthService.deserializeUser({},cb);

    expect(cb).to.have.been.calledOnce;
    expect(UsersdeSerialize).to.have.been.calledOnce;
    UsersdeSerialize.restore();

  });

  it('should contain a login function',function(){
    expect(AuthService).to.have.a.property('login');
    expect(AuthService.login).to.be.a('function');
  });

  it('AuthService#login should call passport#authenticate with local',function(){
    var passport = AuthService.getPassport(),
    stub = sinon.stub(passport,'authenticate',function(strategy,fn){
      return function(req,res,next){
        next();
      };
    }),
    cb = sinon.spy();

    var authenticate = AuthService.login({},{},cb);

    expect(cb).to.be.calledOnce;
    expect(stub.withArgs('local')).to.be.calledOnce;
    stub.restore();

  });

  it('should contain a logout function', function(){
    expect(AuthService).to.have.a.property('logout');
    expect(AuthService.logout).to.be.a('function');
  });

  it('AuthService#logout should call req#logout',function(){
    
    var req = {logout:function(){}},
    stub = sinon.stub(req,'logout');

    AuthService.logout(req);
    expect(stub.calledOnce).to.be.equals(true);
    stub.restore();

  });

  it('should contain a local strategy',function(){
    var strategy = AuthService.getStrategy();
    
    expect(strategy).to.exist(); 
    expect(strategy).to.have.a.property('name','local');  
  });

  it('strategy function should call Users#findOne to find the user with email argument', function(){
    
    var strategy = AuthService.getStrategy(),
    findOne = sinon.stub(Users,'findOne',function(){
      return {
        then: function(fn){
          fn();
          return this;
        },
        catch: function(){

        }
      }
    }),
    cb = sinon.spy();

    strategy._verify('me@rolilink.com','12345678',cb);

    expect(cb).to.have.been.calledOnce;
    expect(findOne).to.have.been.calledOnce;
    findOne.restore();

  });

  it('strategy function should call done with error and a message if user dont exist',function(){
    var strategy = AuthService.getStrategy(),
    findOne = sinon.stub(Users,'findOne',function(){
      return {
        then: function(fn){
          fn();
          return this;
        },
        catch: function(){

        }
      }
    }),
    cb = sinon.spy();

    strategy._verify('me@rolilink.com','12345678',cb);

    expect(cb).to.have.been.calledWith(null,false,{message:'user don\'t exist'});
    findOne.restore();
  });

  it('strategy function should call done with error and a message if passwords dont match',function(){
    var strategy = AuthService.getStrategy(),
    findOne = sinon.stub(Users,'findOne',function(){
      return {
        then: function(fn){
          fn({
            comparePassword:function(){
              return false;
            }
          });
          return this;
        },
        catch: function(){

        }
      }
    }),
    cb = sinon.spy();

    strategy._verify('me@rolilink.com','12345678',cb);

    expect(cb).to.have.been.calledWith(null,false,{message:'passwords dont match'});
    findOne.restore();

  });

  it('strategy function shoud call done with user if everything goes ok',function(){
    var strategy = AuthService.getStrategy(),
    findOne = sinon.stub(Users,'findOne',function(){
      return {
        then: function(fn){
          fn({
            comparePassword:function(){
              return true;
            }
          });
          return this;
        },
        catch: function(){

        }
      }
    }),
    cb = sinon.spy();

    expect(cb).not.to.have.been.calledWith(null,false);
    findOne.restore();
  });

});*/