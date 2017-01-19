// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'partials/home',
            controller: 'MainController'
        })
        .when('/join', {
            templateUrl: 'partials/join',
            controller: 'JoinController'
        })
        .when('/profile', {
            templateUrl: 'partials/profile',
        })
        .when('/quiz', {
            templateUrl: 'partials/quiz',
            controller: 'JoinController'
        })
        .when('/auction/:id', {
            templateUrl: 'partials/auction',
            controller: 'AuctionController'
        })
        .when('/wheeloffortune', {
            templateUrl: 'partials/wof',
            controller: 'WheelController'
        })
        .otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);

}]);
