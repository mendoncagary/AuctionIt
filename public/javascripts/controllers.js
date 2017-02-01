'use strict';

angular.module('AuctionIt.controllers', []).

controller('IndexController', function($scope,$location, socket) {

  $scope.tagline = "Penny's on the Dollar!";
  console.log(`%c
    ___              __  _             ______
   /   | __  _______/ /_(_)___  ____  /  _/ /_
  / /| |/ / / / ___/ __/ / __ \\/ __ \\ / // __/
 / ___ / /_/ / /__/ /_/ / /_/ / / / // // /_
/_/  |_\\__,_/\\___/\\__/_/\\____/_/ /_/___/\\__*/

`+
`%c Hi there, welcome to AuctionIt.
`, 'background: #ffff; color: #17855E', 'background: #ffff; color: #B51616');


$scope.redirect = function(a){
  $location.path('/'+a);
}


  $scope.messages = [];

  socket.emit('join:game');

  socket.on('message', function (data) {
    $scope.chat = data;
          if($scope.chat.message) {
  						if($scope.messages.length>=10)
  						{
  							$scope.messages.shift();
  						}
              $scope.messages.push({ name: $scope.chat.name, message: $scope.chat.message, time: $scope.chat.time });
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

controller('MainController', function($rootScope) {
$rootScope.bgimg = "'/images/front.png'";
}).

controller('JoinController', function($rootScope, $scope, socket,$route,$interval) {
    $rootScope.bgimg = "'/images/studio.png'";

    $scope.tagline = 'Buy and Sell!';

    socket.emit('join:area');

    $scope.currentItem = [];
    socket.on('item', function(data){
        $scope.currentItem.push({ id:data.item_id, name:data.item_name, price: data.item_price, image: data.item_image});
   });

/*
   $interval(function(){
     $route.reload;
     console.log("rel");
   },10000);
*/
  $scope.upcomingItem = [];
   socket.on('upcomingItem', function(data){
     $scope.upcomingItem.push({name:data.item_name, price: data.item_price, image: data.item_image,time_1:data.item_starttime[0],time_2:data.item_starttime[1]});
  });

  $(document).ready(function() {
      $('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
      $('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
      $('#clist').click(function(event){event.preventDefault();$('#cproducts .item').addClass('list-group-item');});
      $('#cgrid').click(function(event){event.preventDefault();$('#cproducts .item').removeClass('list-group-item');$('#cproducts .item').addClass('grid-group-item');});
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
         ctx.drawImage( img, 0, 0 ,400,300);
       };
      img.src = 'data:image/png;base64,' + $scope.item.item_image;

      $scope.endtime = "2017-"+$scope.item.item_endmonth+"-"+$scope.item.item_enddate+" "+$scope.item.item_endhour+":"+$scope.item.item_endmin+":"+$scope.item.item_endsec;
      var nextYear = moment.tz($scope.endtime, "Asia/Kolkata");

      $('#clockdiv').countdown(nextYear.toDate(), function(event) {
      $(this).html(event.strftime(
        "<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"
  ));
      });
    }
    },function (error){
      console.log(error);
    });



  socketa.emit('join:auction', {id : $routeParams.id});


 socketa.on('priceUpdate', function(data) {
      $scope.current_price = data.currentPrice;
      $scope.bid_user = data.username;
 });

 $('.btn-bid').click(function(){
      socketa.emit('bid', {value : this.id,id: $routeParams.id });
 });

}).


controller('WheelController', function($rootScope,$scope,socketb) {

  $rootScope.bgimg = "'/images/back.png'";

  socketb.emit('begin:wof');
  socketb.on('countdown:wof',function(data){

    $scope.endtime = "2017-02-"+data.day+" "+data.hour+":"+data.min;
    var nextYear = moment.tz($scope.endtime, "Asia/Kolkata");
    $('#clockdiv').countdown(nextYear.toDate(), function(event) {
    $(this).html(event.strftime(
      "<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"
    ));
    });
    });


  var game;
  var wheel;
  var canSpin;
  var slices = 8;
  var slicePrizes = ["A KEY!!!", "50 COINS", "500 COINS", "BAD LUCK!!!", "200 COINS", "100 COINS", "150 COINS", "BAD LUCK!!!"];
  var prize;
  var prizeText;


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
            wheel.anchor.set(0.5);
            var pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
            pin.anchor.set(0.5);

            prizeText = game.add.text(game.world.centerX, 400, "");
            prizeText.anchor.set(0.5);
            prizeText.align = "center";
            canSpin = true;
            game.input.onDown.add(this.spin, this);
  	},
       spin(){
            if(canSpin){
                socketb.emit('spin:wof');
                 prizeText.text = "";
                 socketb.on('result:wof',function(data){
                   var rounds = data.rounds;
                   var degrees = data.degrees;
                   prize = data.prize;

                 canSpin = false;
                 var spinTween = game.add.tween(wheel).to({
                      angle: 360 * rounds + degrees
                 }, 3000, Phaser.Easing.Quadratic.Out, true);
                 spinTween.onComplete.add(playGame.prototype.winPrize, this);
                 });
            }
       },
       winPrize(){
            canSpin = true;
            prizeText.text = slicePrizes[prize];
       }
  }

  game = new Phaser.Game(450, 450, Phaser.CANVAS, "gameArea");
  game.state.add("PlayGame",playGame);
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
              }
              else {
                $scope.flash = "Please select a duration";
              }
         };

         socketc.on('profile:response',function(response){
           $scope.flash = response.message;
           $timeout(function(){
             $('#itemModal_'+event.target.id).modal('hide');
             $route.reload();
           },3000);
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


controller('InstructionsController', function($rootScope,socketd) {
$rootScope.bgimg = "'/images/back.png'";
}).

controller('QuizController', function($scope,Quiz,socketd,$timeout) {


  socketd.emit('join:quiz');

  socketd.on('current:quiz',function(quiz){
    $('#quiz_modal').show();
    $('#flash_div').hide();
    $scope.quiz = quiz;
    angular.element($('#qid')).html($scope.quiz.q_question);
    angular.element($('#opt_1')).append($scope.quiz.q_op1);
    angular.element($('#opt_2')).append($scope.quiz.q_op2);
    angular.element($('#opt_3')).append($scope.quiz.q_op3);
    //$scope.quiz.question=quiz.q_question;
    //$scope.$apply();

  });

  socketd.on('countdown:quiz',function(data){
    $('#quiz_modal').hide();
    $('#flash_div').show();
    $scope.endtime = "2017-02-"+data.day+" "+data.hour+":"+data.min;
    var nextYear = moment.tz($scope.endtime, "Asia/Kolkata");
    $('#clockdiv').countdown(nextYear.toDate(), function(event) {
    $(this).html(event.strftime(
      "<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"
    ));
    });
    });



    socketd.on('no:quiz',function(message){
      $('#quiz_modal').hide();
      $scope.quiz_flash = message;
    });

    $(function(){
        var loading = $('#loadbar').hide();
        $(document)
        .ajaxStart(function () {
            loading.show();
        }).ajaxStop(function () {
        	loading.hide();
        });

        $("label.btn").on('click',function () {
        	var choice = $(this).find('input:radio').val();
        	$('#loadbar').show();
        	$('#quiz').fadeOut();
        	setTimeout(function(){
               $( "#answer" ).html(  $(this).checking(choice) );
                $('#quiz').show();
                $('#loadbar').fadeOut();
               /* something else */
        	}, 1500);
        });

        $ans = 3;

        $.fn.checking = function(ck) {
            if (ck != $ans)
                return 'INCORRECT';
            else
                return 'CORRECT';
        };
    });


});
