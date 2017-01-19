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

controller('JoinController', function($scope, socket, $compile) {

    var messages = [];
    var chattime = [];
    var sendername = [];


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

                     var html =  `<div class='row'><div class='col-xs-1 col-sm-4 col-md-6 col-lg-12'><button type='button' ng-click="redirect('auction/`+data.item_id+`')" class='btn btn-primary' data-item-id=`+data.item_id+`>Place Bid</button></div></div>`;

                     var temp = $compile(html)($scope);

                    angular.element($( "li[data-item-id="+data.item_id+"]" )).append(temp);


   //}
 };
     img.src = 'data:image/png;base64,' + data.item_image;
   }

   });



   socket.on('upcomingItem', function(data){
   var uptab = document.getElementById('uptab');
   if (data.image) {
    var img = new Image();
    img.onload = function(){
                   var li = uptab.appendChild(document.createElement('li'));

                    $(li).css({'margin-left':'20px','margin-right':'20px'});

                   var canvas = li.appendChild(document.createElement('canvas'));
                   canvas.width  =  1;
                   canvas.width  = 500;
                   canvas.height = 300;
                   var ctx = canvas.getContext('2d');

                   ctx.drawImage( img, 0, 0 );

                   $(li).append('<h3>'+data.item_name+'</h3>');

                   $(li).append('<h4>BasePrice: Rs.'+data.item_price+'</h4>');
 };
    img.src = 'data:image/png;base64,' + data.item_image;
  }

  });


  socket.on('message', function (data) {
          if(data.message) {
  						if(messages.length>=10)
  						{
  							messages.shift();
                chattime.shift();
                sendername.shift();
  						}
              messages.push(data.message);
              chattime.push(data.time);
              sendername.push(data.name);
              var html = '';
              for(var i=0; i<messages.length; i++) {
                  html += "<li class='left clearfix'><span class='chat-img pull-left'><img src='http://placehold.it/50/55C1E7/fff&text=U' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>"+sendername[i]+"</strong><small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>"+chattime[i]+"</small></div><p>" +messages[i]+"</p></div></li>";
              }
            $('#res-chat').html(html);
          }
      });

      $(document).on('click','#btn-chat',function() {
        if($('#btn-input').val())
        {
          var text = $('#btn-input').val();
          socket.emit('send', { message: text });
          $("#btn-input").val('');
        }
      });


}).

controller('AuctionController', function( $routeParams, $http, $scope,  socketa) {

  $http.get('/api/item/' + $routeParams.id)
  .then(function(success) {
      $scope.item = success.data;
      if ($scope.item.image) {
       var img = new Image();
       img.onload = function(){
         var ctx = canvas.getContext('2d');
         ctx.drawImage( img, 0, 0 );
       };
    img.src = 'data:image/png;base64,' + $scope.item.item_image;

      $('#item_name').html($scope.item.item_name);
      $('#item_price').html($scope.item.item_price);
      $('#item_desc').html($scope.item.item_desc);
      $('#but_1').val($scope.item.curBidValue1);
      $('#but_2').val($scope.item.curBidValue2);
      $('#but_3').val($scope.item.curBidValue3);
    }
    },function (error){
    });


  var messages = [];
  var chattime = [];
  var sendername = [];

socketa.emit('join:auction', {id : $routeParams.id});


 socketa.on('priceUpdate', function(data) {
      $('#bids').html(data+ "");
 });

 $('.btn-bid').click(function(){
      socketa.emit('bid', {value : this.id });
 });

   socketa.on('message', function (data) {
           if(data.message) {
   						if(messages.length>=10)
   						{
   							messages.shift();
                 chattime.shift();
                 sendername.shift();
   						}
               messages.push(data.message);
               chattime.push(data.time);
               sendername.push(data.name);
               var html = '';
               for(var i=0; i<messages.length; i++) {
                   html += "<li class='left clearfix'><span class='chat-img pull-left'><img src='http://placehold.it/50/55C1E7/fff&text=U' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>"+sendername[i]+"</strong><small class='pull-right text-muted'><span class='glyphicon glyphicon-time'></span>"+chattime[i]+"</small></div><p>" +messages[i]+"</p></div></li>";
               }
             $('#res-chat').html(html);
           }
       });

       $(document).on('click','#btn-chat',function() {
         if($('#btn-input').val())
         {
           var text = $('#btn-input').val();
           socketa.emit('send', { message: text });
           $("#btn-input").val('');
         }
       });

}).


controller('WheelController', function($scope) {

  // the game itself
  var game;
  // the spinning wheel
  var wheel;
  // can the wheel spin?
  var canSpin;
  // slices (prizes) placed in the wheel
  var slices = 8;
  // prize names, starting from 12 o'clock going clockwise
  var slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
  // the prize you are about to win
  var prize;
  // text field where to show the prize
  var prizeText;


  // PLAYGAME STATE

  var playGame = function(game){};

  playGame.prototype = {
       // function to be executed once the state preloads
       preload: function(){
            // preloading graphic assets
            game.load.image("wheel", "images/wheel.png");
  		      game.load.image("pin", "images/pin.png");
       },
       // funtion to be executed when the state is created
    	create: function(){
            // giving some color to background
    		game.stage.backgroundColor = "#104D61";
            // adding the wheel in the middle of the canvas
    		wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
            // setting wheel registration point in its center
            wheel.anchor.set(0.5);
            // adding the pin in the middle of the canvas
            var pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
            // setting pin registration point in its center
            pin.anchor.set(0.5);
            // adding the text field
            prizeText = game.add.text(game.world.centerX, 480, "");
            // setting text field registration point in its center
            prizeText.anchor.set(0.5);
            // aligning the text to center
            prizeText.align = "center";
            // the game has just started = we can spin the wheel
            canSpin = true;
            // waiting for your input, then calling "spin" function
            game.input.onDown.add(this.spin, this);
  	},
       // function to spin the wheel
       spin(){
            // can we spin the wheel?
            if(canSpin){
                 // resetting text field
                 prizeText.text = "";
                 // the wheel will spin round from 2 to 4 times. This is just coreography
                 var rounds = game.rnd.between(2, 4);
                 // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
                 var degrees = game.rnd.between(0, 360);
                 // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
                 prize = slices - 1 - Math.floor(degrees / (360 / slices));
                 // now the wheel cannot spin because it's already spinning
                 canSpin = false;
                 // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
                 // the quadratic easing will simulate friction
                 var spinTween = game.add.tween(wheel).to({
                      angle: 360 * rounds + degrees
                 }, 3000, Phaser.Easing.Quadratic.Out, true);
                 // once the tween is completed, call winPrize function
                 spinTween.onComplete.add(this.winPrize, this);
            }
       },
       // function to assign the prize
       winPrize(){
            // now we can spin the wheel again
            canSpin = true;
            // writing the prize you just won
            prizeText.text = slicePrizes[prize];
       }
  }

  // creation of a 458x488 game
 game = new Phaser.Game(458, 488, Phaser.CANVAS, "");
  // adding "PlayGame" state
  game.state.add("PlayGame",playGame);
  // launching "PlayGame" state
  game.state.start("PlayGame");

});
