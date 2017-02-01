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
}).


directive("countdownDirective", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          $timeout(function(){
          $('[data-countdown]').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
              $this.html(event.strftime("<div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"));
            });
          });
        },0);
            }
        };
}).


directive("quizDirective", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
        $timeout(function(){
          console.log("sdad");
        },1000);
            }
        };
});
