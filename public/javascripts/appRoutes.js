
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

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
            controller: 'ProfileController'
        })
        .when('/quiz', {
            templateUrl: 'partials/quiz',
            controller: 'QuizController'
        })
        .when('/auction/:id', {
            templateUrl: 'partials/auction',
            controller: 'AuctionController'
        })
        .when('/wheeloffortune', {
            templateUrl: 'partials/wof',
            controller: 'WheelController'
        })
        .when('/leaderboard', {
            templateUrl: 'partials/leaderboard',
            controller: 'LeaderBoardController'
        })
        .when('/instructions', {
            templateUrl: 'partials/instructions',
            controller: 'InstructionsController'
        })
        .otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);

}]);
