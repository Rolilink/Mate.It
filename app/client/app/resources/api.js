angular.module('MateIt')
.factory('Api', ['$resource', function($resource){
  var User = $resource('http://api.mate.it/users/:id', {id:'@id'});

  return function getUser(){
    return {
      User: User
    };
  };
}]);