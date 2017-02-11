'use strict';

angular.module('AuctionIt.services', []).factory('socket', ["$rootScope", function ($rootScope) {
  var socket = io('/join');
  return {
    on: function on(eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function emit(eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]).factory('socketa', ["$rootScope", function ($rootScope) {
  var socketa = io('/auction');
  return {
    on: function on(eventName, callback) {
      socketa.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketa, args);
        });
      });
    },
    emit: function emit(eventName, data, callback) {
      socketa.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketa, args);
          }
        });
      });
    }
  };
}]).factory('socketb', ["$rootScope", function ($rootScope) {
  var socketb = io('/wheeloffortune');
  return {
    on: function on(eventName, callback) {
      socketb.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketb, args);
        });
      });
    },
    emit: function emit(eventName, data, callback) {
      socketb.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketb, args);
          }
        });
      });
    }
  };
}]).factory('socketc', ["$rootScope", function ($rootScope) {
  var socketc = io('/profile');
  return {
    on: function on(eventName, callback) {
      socketc.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketc, args);
        });
      });
    },
    emit: function emit(eventName, data, callback) {
      socketc.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketc, args);
          }
        });
      });
    }
  };
}]).factory('socketd', ["$rootScope", function ($rootScope) {
  var socketd = io('/quiz');
  return {
    on: function on(eventName, callback) {
      socketd.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socketd, args);
        });
      });
    },
    emit: function emit(eventName, data, callback) {
      socketd.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socketd, args);
          }
        });
      });
    }
  };
}]);