angular.module('mateit', []).
controller('signup', function($scope){
  //Private Methods
  var _objectIsEmpty = function(obj){
    return Object.getOwnPropertyNames(obj).length === 0;
  }
  //Public Methods
  

  $scope.logForm = function(e){
    e.preventDefault();
    var signupForm = $scope.signup_form;
  };

  $scope.isValid = function(field){
    return _objectIsEmpty($scope.signup_form[field].$error)
  }
});