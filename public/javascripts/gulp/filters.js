'use strict';

angular.module('AuctionIt.filters', []).filter('reverse', function () {
  return function (items) {
    return items.slice().reverse();
  };
});