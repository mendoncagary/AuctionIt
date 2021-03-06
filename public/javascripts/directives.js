'use strict';

angular.module('AuctionIt.directives', []).

directive("myProfileDirective", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
                $timeout(function(){
                elem.html($('#slide-content-0').html());
              },1000);
            }
        };
}]).


directive("countdownDirective", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          $timeout(function(){
          $('[data-countdown]').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            var nextYear = moment.tz(finalDate, "Etc/UTC");
            $this.countdown(nextYear.toDate(), function(event) {
              $this.html(event.strftime("<div><span class='days'>%D</span><div class='smalltext'>Day%!D</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"));
            });
          });
        },0);
            }
        };
}]).


directive("quizDirective", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
        $timeout(function(){
        },1000);
            }
        };
}]);
