'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('AuctionIt.services', []).

factory('socket', function ($rootScope) {
  var socket = io('/play');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}).

factory('socketa', function ($rootScope) {
  var socketa = io('/auction');
  return {
    on: function (eventName, callback) {
      socketa.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketa, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socketa.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketa, args);
          }
        });
      })
    }
  };
}).

factory('socketb', function ($rootScope) {
  var socketb = io('/wheeloffortune');
  return {
    on: function (eventName, callback) {
      socketb.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketb, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socketb.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketb, args);
          }
        });
      })
    }
  };
}).

factory('Nerd', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/nerds');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        create : function(nerdData) {
            return $http.post('/api/nerds', nerdData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/nerds/' + id);
        }
    }

}]);
