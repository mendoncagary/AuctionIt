'use strict';

angular.module('AuctionIt.directives', []).

directive("myProfileDirective", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
                $timeout(function(){
                elem.html($('#slide-content-0').html());
              },1000);
            }
        };
});
