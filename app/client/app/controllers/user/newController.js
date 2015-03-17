angular.module('MateIt')
.controller('SignupController', ['$scope','$location','Api',function($scope,$location,Api){

  var Api = Api();

  //Private Methods
  var _objectIsEmpty = function(obj){
    return Object.getOwnPropertyNames(obj).length === 0;
  };

  var _onSuccess = function(ruser){
    $location.path('/user/confirm');
  };

  var _onError = function(response){
    $scope.httpError.exist = true;
  };

  var _isValid = function(field){
    return _objectIsEmpty($scope.signup_form[field].$error);
  };


  //Public Methods
  var createUser = function(e){
    e.preventDefault();
    var data = $scope.form;
    var user = new Api.User(data);

    user.$save()
    .then(_onSuccess)
    .catch(_onError);
  };

  var isFormValid = function(toValidate){
    var valid = true;

    toValidate = toValidate || ['name','email','password'];

    toValidate.forEach(function(field){
      if(!_isValid(field))
        valid = false;
    });

    return valid;
  };

  var showError = function(field){
    if($scope.httpError.exist && (field === 'email' || !field))
      return true;

    if(!field)
      return !isFormValid() && $scope.signup_form.$submitted;

    return !_isValid(field) && $scope.signup_form.$submitted;
  }




  //Exposing Public Methods
  $scope.createUser = createUser;
  $scope.isFormValid = isFormValid;
  $scope.showError = showError;
  $scope.httpError = {
    exist: false,
    message: function(email){
      if(email)
        return 'User with ' + email + ' is already used.';
      else
        return '';
    }
  }

}]);