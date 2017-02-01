'use strict';

angular.module('AuctionIt.services', []).

factory('socket', function ($rootScope) {
  var socket = io('/join');
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

factory('socketc', function ($rootScope) {
  var socketc = io('/profile');
  return {
    on: function (eventName, callback) {
      socketc.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketc, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socketc.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketc, args);
          }
        });
      })
    }
  };
}).


factory('socketd', function ($rootScope) {
  var socketd = io('/quiz');
  return {
    on: function (eventName, callback) {
      socketd.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketd, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socketd.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketd, args);
          }
        });
      })
    }
  };
}).


factory('Quiz', ['$http', function($http) {

    return {
        get : function() {
            return $http.get('/api/quiz');
        },

        create : function(nerdData) {
            return $http.post('/api/quiz', quizData);
        },

        delete : function(id) {
            return $http.delete('/api/quiz/' + id);
        }
    }

}]);
