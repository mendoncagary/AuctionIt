'use strict';

/* Controllers */

angular.module('AuctionIt.controllers', []).
// public/js/controllers/MainCtrl.js
controller('IndexController', function($scope,$location) {

  $scope.tagline = "Penny's on the Dollar!";
  console.log(`%c
    ___              __  _             ______
   /   | __  _______/ /_(_)___  ____  /  _/ /_
  / /| |/ / / / ___/ __/ / __ \\/ __ \\ / // __/
 / ___ / /_/ / /__/ /_/ / /_/ / / / // // /_
/_/  |_\\__,_/\\___/\\__/_/\\____/_/ /_/___/\\__/

`+
`%c Hi there, welcome to AuctionIt.
`, 'background: #ffff; color: #17855E', 'background: #ffff; color: #B51616');


$scope.redirect = function(a){
  $location.path('/'+a);
}

}).

controller('MainController', function($scope) {


}).

controller('JoinController', function($scope, socket,$location) {


    $scope.tagline = 'Buy and Sell!';

    socket.on('item', function(data){
    //var numCarouselItems = 2;
    var mytab = document.getElementById('myTab');
    //var items = mytab.childNodes;
    if (data.image) {
     var img = new Image();
     img.onload = function(){

                   // for (var i=0;i<numCarouselItems;i++){
                    // Find the nth li, or create it
                    var li = //items[i] ||
                     mytab.appendChild(document.createElement('li'));
                     $(li).attr('data-item-id',data.item_id);
                     $(li).css({'margin-left':'20px','margin-right':'20px'});
                    // Find the nth canvas, or create it
                    var canvas = //li.getElementsByTagName('canvas')[0] ||
                                 li.appendChild(document.createElement('canvas'));
                    canvas.width  =  1; // Erase the canvas, in case it existed
                    canvas.width  = 500; // Set the width and height as desired
                    canvas.height = 300;
                    var ctx = canvas.getContext('2d');

                    // Use your actual calculations for the SVG size/position here
                    ctx.drawImage( img, 0, 0 );

                    $(li).append('<h3>'+data.item_name+'</h3>');

                    $(li).append('<h4>BasePrice: Rs.'+data.item_price+'</h4>');

                    $( "li[data-item-id="+data.item_id+"]" ).append( `<div class='row'><div class='col-xs-1 col-sm-4 col-md-6 col-lg-12'><button type='button' ng-click="redirect('auction/`+data.item_id+`')" class='btn btn-primary join_button' data-item-id=`+data.item_id+`>Place Bid</button></div></div>`);


   //}
 };
     img.src = 'data:image/png;base64,' + data.item_image;
   }

   });







   socket.on('upcomingItem', function(data){

   //var numCarouselItems = 2;
   var uptab = document.getElementById('uptab');
   //var items = mytab.childNodes;
   if (data.image) {
    var img = new Image();
    img.onload = function(){

                  // for (var i=0;i<numCarouselItems;i++){
                   // Find the nth li, or create it
                   var li = //items[i] ||
                    uptab.appendChild(document.createElement('li'));

                    $(li).css({'margin-left':'20px','margin-right':'20px'});
                   // Find the nth canvas, or create it
                   var canvas = //li.getElementsByTagName('canvas')[0] ||
                                li.appendChild(document.createElement('canvas'));
                   canvas.width  =  1; // Erase the canvas, in case it existed
                   canvas.width  = 500; // Set the width and height as desired
                   canvas.height = 300;
                   var ctx = canvas.getContext('2d');

                   // Use your actual calculations for the SVG size/position here
                   ctx.drawImage( img, 0, 0 );

                   $(li).append('<h3>'+data.item_name+'</h3>');

                   $(li).append('<h4>BasePrice: Rs.'+data.item_price+'</h4>');


  //}
 };
    img.src = 'data:image/png;base64,' + data.item_image;
  }

  });




}).





controller('AuctionController', function($scope, socketa) {

  socketa.on('priceUpdate', function(data) {
       $('#bids').html(data + "");

  });

 $('#submit').click(function(){

       socketa.emit('bid',  $('#input').val() );

 });

});
