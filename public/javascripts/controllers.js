'use strict';

angular.module('AuctionIt.controllers', []).

controller('IndexController', ["$scope", "$location", "socket", "$route", function($scope,$location, socket,$route) {

  $scope.tagline = "Penny's on the Dollar!";
  console.log(`%c
      ___              __  _             ______
     /   | __  _______/ /_(_)___  ____  /  _/ /_
    / /| |/ / / / ___/ __/ / __ \\/ __ \\ / // __/
   / ___ / /_/ / /__/ /_/ / /_/ / / / // // /_
  /_/  |_\\__,_/\\___/\\__/_/\\____/_/ /_/___/\\__/

    `+
    `%c Hi there, welcome to AuctionIt.
    `, 'background: #ffff; color: #B00E1E', 'background: #ffff; color: #17855E');


    $scope.redirect = function(a){
      $location.path('/'+a);
    };


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
        //$("#btn-input").val('');
      }
    });


     socket.on('end', function(data){
       $route.reload();
     });


    var mouseovertimer;
    var audiostatus = 'off';

    $(document).on('mouseenter', '.speaker', function() {
      if (!mouseovertimer) {
        mouseovertimer = window.setTimeout(function() {
          mouseovertimer = null;
          if (!$('.speaker').hasClass("speakerplay")) {
            $('#player')[0].load();
            $('#player')[0].play();
            $('.speaker').addClass('speakerplay');
            return false;
          }
        }, 1000);
      }
    });

    $(document).on('mouseleave', '.speaker', function() {
      if (mouseovertimer) {
        window.clearTimeout(mouseovertimer);
        mouseovertimer = null;
      }
    });

    $(document).on('click touchend', '.speaker', function() {
      if (!$('.speaker').hasClass("speakerplay")) {
        if (audiostatus == 'off') {
          $('.speaker').addClass('speakerplay');
          $('#player')[0].load();
          $('#player')[0].play();
          window.clearTimeout(mouseovertimer);
          audiostatus = 'on';
          return false;
        } else if (audiostatus == 'on') {
          $('.speaker').addClass('speakerplay');
          $('#player')[0].play();
        }
      } else if ($('.speaker').hasClass("speakerplay")) {
        $('#player')[0].pause();
        $('.speaker').removeClass('speakerplay');
        window.clearTimeout(mouseovertimer);
        audiostatus = 'on';
      }
    });

    $('#player').on('ended', function() {
      $('.speaker').removeClass('speakerplay');
      audiostatus = 'off';
    });


    function toggleFullscreen(elem) {
      elem = elem || document.documentElement;
      if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

    $(document).on('click','#btnFullscreen',function() {
      toggleFullscreen();
    });


  }]).

  controller('MainController', ["$rootScope",function($rootScope) {
    $rootScope.bgimg = "'/images/front.jpg'";
}]).

controller('JoinController',["$rootScope", "$scope", "socket","$route","$interval","$templateCache","$timeout" , function($rootScope, $scope, socket,$route,$interval,$templateCache,$timeout) {
   $rootScope.bgimg = "'/images/studio.png'";

   $scope.tagline = 'Buy and Sell!';

    socket.emit('join:area');

    $scope.currentItem = [];
    socket.on('item', function(data){
      $scope.currentItem.push({ id:data.item_id, name:data.item_name, price: data.item_price, image: data.item_image});
    });


    $scope.upcomingItem = [];
    socket.on('upcomingItem', function(data){
      $scope.upcomingItem.push({name:data.item_name, price: data.item_price, image: data.item_image,time_1:data.item_starttime[0],time_2:data.item_starttime[1]});
    });

    socket.on('new:item',function(){
      $timeout(function(){
        var currentPageTemplate = $route.current.templateUrl;
        $templateCache.remove(currentPageTemplate);
        $route.reload();
      },2000);
    });


    $(document).ready(function() {
      $('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
      $('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
      $('#clist').click(function(event){event.preventDefault();$('#cproducts .item').addClass('list-group-item');});
      $('#cgrid').click(function(event){event.preventDefault();$('#cproducts .item').removeClass('list-group-item');$('#cproducts .item').addClass('grid-group-item');});
    });

  }]).

  controller('AuctionController', ["$rootScope", "$routeParams", "$http", "$scope", "socketa", function($rootScope, $routeParams, $http, $scope, socketa) {


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
          ctx.drawImage( img, 0, 0 ,350,350);
        };
        img.src = 'data:image/png;base64,' + $scope.item.item_image;

        $scope.endtime = "2017-"+$scope.item.item_endmonth+"-"+$scope.item.item_enddate+" "+$scope.item.item_endhour+":"+$scope.item.item_endmin+":"+$scope.item.item_endsec;
        var nextYear = moment.tz($scope.endtime, "Etc/UTC");

        $('#clockdiv').countdown(nextYear.toDate(), function(event) {
          $(this).html(event.strftime(
            "<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"
          ));
        });
      }
    },function (error){
    });



    socketa.emit('join:auction', {id : $routeParams.id});

    $scope.bidlist = [];

    socketa.on('priceUpdate', function(data) {
      $scope.bidlist.push({user: data.username, value: data.bid_value});
    });


    socketa.on('currentPrice',function(data){
      $scope.current_price = data;
    });

    socketa.on('flash:auction',function(data){
      $('#flashModal').modal();
      $('#flashModal .modal-body p').html(data.message);
    });

    $('.btn-bid').click(function(){
      socketa.emit('bid', {value : this.id,id: $routeParams.id });
    });

  }]).


  controller('WheelController', ["$rootScope", "$scope", "socketb", "$timeout", "$route", function($rootScope,$scope,socketb,$timeout,$route) {

    $rootScope.bgimg = "'/images/back.png'";

    socketb.on('reload:wof',function(){
      $route.reload();
    });
    socketb.emit('begin:wof');

    $scope.flash = false;
    socketb.on('countdown:wof',function(data){
      $scope.flash =true;
      $scope.endtime = "2017-02-"+data.day+" "+data.hour+":"+data.min;
      var nextYear = moment.tz($scope.endtime, "Etc/UTC");
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
    var slicePrizes = ["2500 DOLLARS", "500 DOLLARS", "5000 DOLLARS", "BAD LUCK!!!", "2000 DOLLARS", "1000 DOLLARS", "1500 DOLLARS", "BAD LUCK!!!"];
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
        $timeout(function(){$route.reload();
        },3000);
      }
    };

    game = new Phaser.Game(550, 550, Phaser.CANVAS, "gameArea");
    game.state.add("PlayGame",playGame);
    game.state.start("PlayGame");

  }]).


  controller('ProfileController', ["$rootScope", "$scope", "$timeout", "$route", "$http", "socketc", function($rootScope, $scope,$timeout,$route, $http,socketc) {
    $rootScope.bgimg = "'/images/back.png'";

    $http.get('/api/profile/')
    .then(function(success) {
      $scope.user = success.data;
    },function (error){
    });

    $scope.inv_message = "You have no items in your inventory";

    $http.get('/api/itemswon')
    .then(function(response){
      $scope.inv_message="";
      $scope.items_won = [];
      for(var i in response.data.item)
      {
        var m = i.toString();
        $scope.items_won[i] = response.data.item[m];
      }
      $scope.auction_cost_1 = 1;
    },function(response){
    });

    $http.get('/api/badges')
    .then(function(response) {
    $scope.badge = response.data;
  },function (response){
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
        $('#itemModal_'+response.id).modal('hide');
      },3000);
      $timeout(function(){
        $route.reload();
      },4000);
    });

    jQuery(document).ready(function($) {
      $('#itemCarousel').carousel({
        interval: 5000
      });

      $(document).on('click','[id^=carousel-selector-]', function(){
        var id = this.id.substr(this.id.lastIndexOf("-") + 1);
        id = parseInt(id);
        $('#itemCarousel').carousel(id);
      });

      $('#itemCarousel').on('slid.bs.carousel', function (e) {
        var id = $('.item.active').data('slide-number');
        $('#carousel-text').html($('#slide-content-'+id).html());
      });
    });


  }]).

  controller('LeaderBoardController', ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {


    $http.get('/api/leaderboard')
    .then(function(response) {
      $scope.users = [];
      for(var i in response.data.users)
      {
        var m = i.toString();
        $scope.users[i] = response.data.users[m];
      }
    },function (error){
    });

    $http.get('/api/rating')
    .then(function(response) {
      $("#input-1").rating("update", response.data.rating);
    },function (error){
    });


    $("#input-1").rating({
      min: 0,
      max: 5,
      step: 0.1,
      hoverChangeStars: false,
      starCaptions: {0.5:'0.5 star', 1: '1 star', 1.5: '1.5 star', 2: '2 star', 2.5: '2.5 star', 3: '3 star', 3.5: '3.5 star', 4: '4 star', 4.5:'4.5 star', 5:'5 star'}
    }).on("rating.change", function(event, value, caption) {
      $http.put('/api/rating',JSON.stringify({value: value}),'application/json')
      .then(function(response) {
        $scope.rating = response.data.value;
      },function (response){
      });

    });

  }]).


  controller('InstructionsController', ["$rootScope", function($rootScope) {
    $rootScope.bgimg = "'/images/back.png'";
  }]).

  controller('QuizController', ["$scope", "socketd", "$timeout", "$route", function($scope,socketd,$timeout,$route) {

    socketd.on('reload:quiz',function(){
      $route.reload();
    });

    socketd.emit('join:quiz');

    $('#flash_div').hide();
    $('#flash_message').hide();
    $('#quiz_modal').hide();


    socketd.on('current:quiz',function(quiz){
      $('#flash_div').hide();
      $('#flash_message').hide();
      $('#quiz_modal').show();
      $scope.quiz = quiz;
      angular.element($('#qid')).html($scope.quiz.q_question);
      angular.element($('#opt_1')).html($scope.quiz.q_op1);
      angular.element($('#opt_2')).html($scope.quiz.q_op2);
      angular.element($('#opt_3')).html($scope.quiz.q_op3);
      angular.element($('#opt_4')).html($scope.quiz.q_op4);
    });

    socketd.on('countdown:quiz',function(data){
      $('#quiz_modal').hide();
      $('#flash_div').show();
      $('#flash_message').hide();
      $scope.endtime = "2017-02-"+data.day+" "+data.hour+":"+data.min;
      var nextYear = moment.tz($scope.endtime, "Etc/UTC");
      $('#clockdiv').countdown(nextYear.toDate(), function(event) {
        $(this).html(event.strftime(
          "<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"
        ));
      });
    });

    socketd.on('no:quiz',function(message){
      $('#quiz_modal').hide();
      $('#flash_div').hide();
      $('#flash_message').show();
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
        socketd.emit('submit:quiz',{choice:choice});
        $('#loadbar').show();
        $('#quiz').fadeOut();
        socketd.on('result:quiz',function(data){
          setTimeout(function(){
            $( "#answer" ).html(data.message);
            $('#loadbar').fadeOut();
          }, 1500);
        });


      });

    });


  }]);
