angular.module('mateit', [
  'ngMessages',
  'ngResource'
]).
controller('signup', function($scope,$http,$resource){

  var User = $resource('/users/:id',{id:'@id'});

  //Private Methods
  var _objectIsEmpty = function(obj){
    return Object.getOwnPropertyNames(obj).length === 0;
  }
  //Public Methods
  

  $scope.createUser = function(e){
    e.preventDefault();
    var data = $scope.form;
    console.log(data);
    var user = new User(data);
    user.$save(function(ruser){
      console.log(ruser);
    });
  };

  $scope.isValid = function(field){
    return _objectIsEmpty($scope.signup_form[field].$error)
  }
});