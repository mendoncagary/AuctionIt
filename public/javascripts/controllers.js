'use strict';

angular.module('AuctionIt.controllers', []).

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

controller('MainController', function($rootScope) {

$rootScope.bgimg = "'/images/front.png'";

}).

controller('JoinController', function($rootScope, $scope, socket, $compile) {

    $rootScope.bgimg = "'/images/studio.png'";

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
                    canvas.width  = 300; // Set the width and height as desired
                    canvas.height = 200;
                    canvas.className = "join_canvas";
                    var ctx = canvas.getContext('2d');

                    // Use your actual calculations for the SVG size/position here
                    ctx.drawImage( img, 0, 0,300,200);

                    $(li).append('<h3>'+data.item_name+'</h3>');

                    $(li).append("<div class='row'><div class='col-xs-4 col-md-4'><h4>BasePrice:</h4></div><div class='col-xs-2 col-md-2'><img class='rupee_small' alt='Rs.' src='images/rupee_micro.png'></div><div class='col-xs-2 col-md-2'><h4>"+data.item_price+"</h4><div></div>");

                     var html =  `<div class='row'><div class='col-xs-1 col-sm-4 col-md-6 col-lg-12'><button type='button' ng-click="redirect('auction/`+data.item_id+`')" class='btn btn-primary' data-item-id=`+data.item_id+`>Place Bid</button></div></div>`;

                     var temp = $compile(html)($scope);

                    angular.element($( "li[data-item-id="+data.item_id+"]" )).append(temp);

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
                   canvas.width  = 300;
                   canvas.height = 200;
                   canvas.className = "join_canvas";
                   var ctx = canvas.getContext('2d');

                   ctx.drawImage( img, 0, 0,300,200 );

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

controller('AuctionController', function($rootScope, $routeParams, $http, $scope, socketa) {


  $rootScope.bgimg = "'/images/spotlight.png'";


  $http.get('/api/item/' + $routeParams.id)
  .then(function(success) {
      $scope.item = success.data;
      if($scope.item.code)
      {
      $scope.redirect('join');
      }
      if($scope.item.image) {
       var img = new Image();
       img.onload = function(){
         var ctx = canvas.getContext('2d');
         ctx.drawImage( img, 0, 0 );
       };
      img.src = 'data:image/png;base64,' + $scope.item.item_image;

      $scope.endtime = "2017-"+$scope.item.item_endmonth+"-"+$scope.item.item_enddate+" "+$scope.item.item_endhour+":"+$scope.item.item_endmin+":28";
      console.log($scope.endtime);
      var nextYear = moment.tz($scope.endtime, "Asia/Kolkata");

      $('#clock').countdown(nextYear.toDate(), function(event) {
      $(this).html(event.strftime('%D days %H:%M:%S'));
      });
    }
    },function (error){
      console.log(error);
    });


  var messages = [];
  var chattime = [];
  var sendername = [];

  socketa.emit('join:auction', {id : $routeParams.id});


 socketa.on('priceUpdate', function(data) {
      $scope.current_price = data.currentPrice;
      $scope.bid_user = data.username;
 });

 $('.btn-bid').click(function(){
      socketa.emit('bid', {value : this.id,id: $routeParams.id });
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


controller('WheelController', function($rootScope,$scope,socketb) {

  $rootScope.bgimg = "'/images/back.png'";

  socketb.emit('begin:wof');

  // the game itself
  var game;
  // the spinning wheel
  var wheel;
  // can the wheel spin?
  var canSpin;
  // slices (prizes) placed in the wheel
  var slices = 8;
  // prize names, starting from 12 o'clock going clockwise
  var slicePrizes = ["A KEY!!!", "50 COINS", "500 COINS", "BAD LUCK!!!", "200 COINS", "100 COINS", "150 COINS", "BAD LUCK!!!"];
  // the prize you are about to win
  var prize;
  // text field where to show the prize
  var prizeText;


  // PLAYGAME STATE

  var playGame = function(game){};

  playGame.prototype = {

       preload: function(){
            game.load.image("wheel", "images/wheel.png");
  		      game.load.image("pin", "images/pin.png");
            game.load.image("spin", "images/spin.jpg");
       },

    	create: function(){
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setShowAll();
            window.addEventListener('resize', function () {
              game.scale.refresh();
            });
            game.scale.refresh();
    		    game.stage.backgroundColor = "#104D61";
            var spin = game.add.sprite(game.width / 2, game.width / 2, "spin");
            spin.anchor.set(0.5);
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
                socketb.emit('spin:wof');
                 // resetting text field
                 prizeText.text = "";
                 // the wheel will spin round from 2 to 4 times. This is just coreography
                 //var rounds = game.rnd.between(2, 4);
                 // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
                 //var degrees = game.rnd.between(0, 360);
                 socketb.on('result:wof',function(data){
                   var rounds = data.rounds;
                   var degrees = data.degrees;
                   prize = data.prize;

                 // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
                 //prize = slices - 1 - Math.floor(degrees / (360 / slices));
                 // now the wheel cannot spin because it's already spinning
                 canSpin = false;
                 // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
                 // the quadratic easing will simulate friction
                 var spinTween = game.add.tween(wheel).to({
                      angle: 360 * rounds + degrees
                 }, 3000, Phaser.Easing.Quadratic.Out, true);
                 // once the tween is completed, call winPrize function
                 spinTween.onComplete.add(playGame.prototype.winPrize, this);
                 });
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
 game = new Phaser.Game(580, 580, Phaser.CANVAS, "");
  // adding "PlayGame" state
  game.state.add("PlayGame",playGame);
  // launching "PlayGame" state
  game.state.start("PlayGame");

}).


controller('ProfileController', function($rootScope, $scope,$timeout,$route, $http,socketc) {
$rootScope.bgimg = "'/images/back.png'";

  $http.get('/api/profile/')
    .then(function(success) {
      $scope.user = success.data;
    },function (error){
      console.log(error);
    });

  $http.get('/api/itemswon')
  .then(function(response){
    $scope.items_won = [];
    for(var i in response.data.item)
    {
      var m = i.toString();
      $scope.items_won[i] = response.data.item[m];
    }
    $scope.auction_cost_1 = 1;
  },function(error){
    console.log(error);
  });



  $(document).on('click','.dur_but', function(){
    var id = $(this).attr('id');
    if(id=='time_1')
    {
      $scope.auction_cost_1 = 1;
      $scope.auction_cost_2 = 0;
      $scope.auction_cost_3 = 0;
      $scope.dur_id = id;
      $scope.$apply();
    }
    else if(id=='time_2')
    {
      $scope.auction_cost_1 = 0;
      $scope.auction_cost_2 = 1;
      $scope.auction_cost_3 = 0;
      $scope.dur_id = id;
      $scope.$apply();
    }
    else if(id=='time_3')
    {
      $scope.auction_cost_1 = 0;
      $scope.auction_cost_2 = 0;
      $scope.auction_cost_3 = 1;
      $scope.dur_id = id;
      $scope.$apply();
    }

  });

  $scope.SubmitAuction = function (event) {
              if($scope.dur_id)
              {
              socketc.emit('sell:item',{id:event.target.id,duration: $scope.dur_id});
                //$('#itemModal_'+event.target.id).modal('hide');
              }
              else {
                $scope.flash = "Please select a duration";
              }
         };

         socketc.on('profile:response',function(response){
           $scope.flash = response.message;
           $timeout(function(){
             $route.reload();
           },2000);
         });

         jQuery(document).ready(function($) {

             $('#itemCarousel').carousel({
                     interval: 5000
             });

             //$('#carousel-text').html($('#slide-content-0').html());
             //Handles the carousel thumbnails
            $(document).on('click','[id^=carousel-selector-]', function(){
                 var id = this.id.substr(this.id.lastIndexOf("-") + 1);
                 var id = parseInt(id);
                 $('#itemCarousel').carousel(id);
             });


             // When the carousel slides, auto update the text
             $('#itemCarousel').on('slid.bs.carousel', function (e) {
                      var id = $('.item.active').data('slide-number');
                     $('#carousel-text').html($('#slide-content-'+id).html());
             });
     });


}).

controller('LeaderBoardController', function($rootScope, $scope, $http) {


    $http.get('/api/leaderboard')
      .then(function(response) {
        $scope.users = [];
      for(var i in response.data.users)
        {
          var m = i.toString();
          $scope.users[i] = response.data.users[m];
        }
      },function (error){
        console.log(error);
      });


}).


controller('InstructionsController', function($rootScope) {
$rootScope.bgimg = "'/images/back.png'";
});
