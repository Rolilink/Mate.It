angular.module('MateIt', [
  'ngMessages',
  'ngResource',
  'ngRoute'
])
.config(['$routeProvider',function($routeProvider) {
  $routeProvider
  .when('/signup',{
    templateUrl:'/views/users/signup.html',
    controller:'SignupController'
  })
  .when('/user/confirm',{
    templateUrl:'/views/users/user_created.html'
  });
}]);