"use strict";angular.module("AuctionApp",["ngRoute","appRoutes","AuctionIt.controllers","AuctionIt.services","AuctionIt.directives","AuctionIt.filters"]);
"use strict";angular.module("appRoutes",[]).config(["$routeProvider","$locationProvider",function(r,l){r.when("/",{templateUrl:"partials/home",controller:"MainController"}).when("/join",{templateUrl:"partials/join",controller:"JoinController"}).when("/profile",{templateUrl:"partials/profile",controller:"ProfileController"}).when("/quiz",{templateUrl:"partials/quiz",controller:"QuizController"}).when("/auction/:id",{templateUrl:"partials/auction",controller:"AuctionController"}).when("/wheeloffortune",{templateUrl:"partials/wof",controller:"WheelController"}).when("/leaderboard",{templateUrl:"partials/leaderboard",controller:"LeaderBoardController"}).when("/instructions",{templateUrl:"partials/instructions",controller:"InstructionsController"}).otherwise({redirectTo:"/"}),l.html5Mode(!0)}]);
"use strict";angular.module("AuctionIt.controllers",[]).controller("IndexController",["$scope","$location","socket","$route",function(e,t,n,i){function a(e){e=e||document.documentElement,document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement?document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen():e.requestFullscreen?e.requestFullscreen():e.msRequestFullscreen?e.msRequestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen&&e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)}e.tagline="Penny's on the Dollar!",console.log("%c\n      ___              __  _             ______\n     /   | __  _______/ /_(_)___  ____  /  _/ /_\n    / /| |/ / / / ___/ __/ / __ \\/ __ \\ / // __/\n   / ___ / /_/ / /__/ /_/ / /_/ / / / // // /_\n  /_/  |_\\__,_/\\___/\\__/_/\\____/_/ /_/___/\\__/\n\n    %c Hi there, welcome to AuctionIt.\n    ","background: #ffff; color: #B00E1E","background: #ffff; color: #17855E"),e.redirect=function(e){t.path("/"+e)},e.messages=[],n.emit("join:game"),n.on("message",function(t){e.chat=t,e.chat.message&&(e.messages.length>=10&&e.messages.shift(),e.messages.push({name:e.chat.name,message:e.chat.message,time:e.chat.time}))}),$(document).on("click","#btn-chat",function(){if($("#btn-input").val()){var e=$("#btn-input").val();n.emit("send",{message:e})}}),n.on("end",function(e){i.reload()});var o,s="off";$(document).on("mouseenter",".speaker",function(){o||(o=window.setTimeout(function(){if(o=null,!$(".speaker").hasClass("speakerplay"))return $("#player")[0].load(),$("#player")[0].play(),$(".speaker").addClass("speakerplay"),!1},1e3))}),$(document).on("mouseleave",".speaker",function(){o&&(window.clearTimeout(o),o=null)}),$(document).on("click touchend",".speaker",function(){if($(".speaker").hasClass("speakerplay"))$(".speaker").hasClass("speakerplay")&&($("#player")[0].pause(),$(".speaker").removeClass("speakerplay"),window.clearTimeout(o),s="on");else{if("off"==s)return $(".speaker").addClass("speakerplay"),$("#player")[0].load(),$("#player")[0].play(),window.clearTimeout(o),s="on",!1;"on"==s&&($(".speaker").addClass("speakerplay"),$("#player")[0].play())}}),$("#player").on("ended",function(){$(".speaker").removeClass("speakerplay"),s="off"}),$(document).on("click","#btnFullscreen",function(){a()})}]).controller("MainController",["$rootScope",function(e){e.bgimg="'/images/front.jpg'"}]).controller("JoinController",["$rootScope","$scope","socket","$route","$interval","$templateCache","$timeout",function(e,t,n,i,a,o,s){e.bgimg="'/images/studio.png'",t.tagline="Buy and Sell!",n.emit("join:area"),t.currentItem=[],n.on("item",function(e){t.currentItem.push({id:e.item_id,name:e.item_name,price:e.item_price,image:e.item_image})}),t.upcomingItem=[],n.on("upcomingItem",function(e){t.upcomingItem.push({name:e.item_name,price:e.item_price,image:e.item_image,time_1:e.item_starttime[0],time_2:e.item_starttime[1]})}),n.on("new:item",function(){s(function(){var e=i.current.templateUrl;o.remove(e),i.reload()},2e3)}),$(document).ready(function(){$("#list").click(function(e){e.preventDefault(),$("#products .item").addClass("list-group-item")}),$("#grid").click(function(e){e.preventDefault(),$("#products .item").removeClass("list-group-item"),$("#products .item").addClass("grid-group-item")}),$("#clist").click(function(e){e.preventDefault(),$("#cproducts .item").addClass("list-group-item")}),$("#cgrid").click(function(e){e.preventDefault(),$("#cproducts .item").removeClass("list-group-item"),$("#cproducts .item").addClass("grid-group-item")})})}]).controller("AuctionController",["$rootScope","$routeParams","$http","$scope","socketa",function(e,t,n,i,a){e.bgimg="'/images/spotlight.png'",n.get("/api/item/"+t.id).then(function(e){if(i.item=e.data,i.item.code&&i.redirect("join"),i.item.image){var t=new Image;t.onload=function(){var e=canvas.getContext("2d");e.drawImage(t,0,0,350,350)},t.src="data:image/png;base64,"+i.item.item_image,i.endtime="2017-"+i.item.item_endmonth+"-"+i.item.item_enddate+" "+i.item.item_endhour+":"+i.item.item_endmin+":"+i.item.item_endsec;var n=moment.tz(i.endtime,"Asia/Kolkata");$("#clockdiv").countdown(n.toDate(),function(e){$(this).html(e.strftime("<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"))})}},function(e){}),a.emit("join:auction",{id:t.id}),i.bidlist=[],a.on("priceUpdate",function(e){i.bidlist.push({user:e.username,value:e.bid_value})}),a.on("currentPrice",function(e){i.current_price=e}),a.on("flash:auction",function(e){$("#flashModal").modal(),$("#flashModal .modal-body p").html(e.message)}),$(".btn-bid").click(function(){a.emit("bid",{value:this.id,id:t.id})})}]).controller("WheelController",["$rootScope","$scope","socketb","$timeout","$route",function(e,t,n,i,a){e.bgimg="'/images/back.png'",n.on("reload:wof",function(){a.reload()}),n.emit("begin:wof"),t.flash=!1,n.on("countdown:wof",function(e){t.flash=!0,t.endtime="2017-02-"+e.day+" "+e.hour+":"+e.min;var n=moment.tz(t.endtime,"Asia/Kolkata");$("#clockdiv").countdown(n.toDate(),function(e){$(this).html(e.strftime("<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"))})});var o,s,l,c,r,u=["2500 DOLLARS","500 DOLLARS","5000 DOLLARS","BAD LUCK!!!","2000 DOLLARS","1000 DOLLARS","1500 DOLLARS","BAD LUCK!!!"],d=function(e){};d.prototype={preload:function(){o.load.image("wheel","images/wheel.png"),o.load.image("pin","images/pin.png"),o.load.image("spin","images/spin.jpg")},create:function(){o.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,o.scale.setShowAll(),window.addEventListener("resize",function(){o.scale.refresh()}),o.scale.refresh(),o.stage.backgroundColor="#104D61";var e=o.add.sprite(o.width/2,o.width/2,"spin");e.anchor.set(.5),s=o.add.sprite(o.width/2,o.width/2,"wheel"),s.anchor.set(.5);var t=o.add.sprite(o.width/2,o.width/2,"pin");t.anchor.set(.5),r=o.add.text(o.world.centerX,400,""),r.anchor.set(.5),r.align="center",l=!0,o.input.onDown.add(this.spin,this)},spin:function(){l&&(n.emit("spin:wof"),r.text="",n.on("result:wof",function(e){var t=e.rounds,n=e.degrees;c=e.prize,l=!1;var i=o.add.tween(s).to({angle:360*t+n},3e3,Phaser.Easing.Quadratic.Out,!0);i.onComplete.add(d.prototype.winPrize,this)}))},winPrize:function(){l=!0,r.text=u[c],i(function(){a.reload()},3e3)}},o=new Phaser.Game(550,550,Phaser.CANVAS,"gameArea"),o.state.add("PlayGame",d),o.state.start("PlayGame")}]).controller("ProfileController",["$rootScope","$scope","$timeout","$route","$http","socketc",function(e,t,n,i,a,o){e.bgimg="'/images/back.png'",a.get("/api/profile/").then(function(e){t.user=e.data},function(e){}),t.inv_message="You have no items in your inventory",a.get("/api/itemswon").then(function(e){t.inv_message="",t.items_won=[];for(var n in e.data.item){var i=n.toString();t.items_won[n]=e.data.item[i]}t.auction_cost_1=1},function(e){}),a.get("/api/badges").then(function(e){t.badge=e.data},function(e){}),$(document).on("click",".dur_but",function(){var e=$(this).attr("id");"time_1"==e?(t.auction_cost_1=1,t.auction_cost_2=0,t.auction_cost_3=0,t.dur_id=e,t.$apply()):"time_2"==e?(t.auction_cost_1=0,t.auction_cost_2=1,t.auction_cost_3=0,t.dur_id=e,t.$apply()):"time_3"==e&&(t.auction_cost_1=0,t.auction_cost_2=0,t.auction_cost_3=1,t.dur_id=e,t.$apply())}),t.SubmitAuction=function(e){t.dur_id?o.emit("sell:item",{id:e.target.id,duration:t.dur_id}):t.flash="Please select a duration"},o.on("profile:response",function(e){t.flash=e.message,n(function(){$("#itemModal_"+e.id).modal("hide")},3e3),n(function(){i.reload()},4e3)}),jQuery(document).ready(function(e){e("#itemCarousel").carousel({interval:5e3}),e(document).on("click","[id^=carousel-selector-]",function(){var t=this.id.substr(this.id.lastIndexOf("-")+1);t=parseInt(t),e("#itemCarousel").carousel(t)}),e("#itemCarousel").on("slid.bs.carousel",function(t){var n=e(".item.active").data("slide-number");e("#carousel-text").html(e("#slide-content-"+n).html())})})}]).controller("LeaderBoardController",["$rootScope","$scope","$http",function(e,t,n){n.get("/api/leaderboard").then(function(e){t.users=[];for(var n in e.data.users){var i=n.toString();t.users[n]=e.data.users[i]}},function(e){}),n.get("/api/rating").then(function(e){$("#input-1").rating("update",e.data.rating)},function(e){}),$("#input-1").rating({min:0,max:5,step:.1,hoverChangeStars:!1,starCaptions:{.5:"0.5 star",1:"1 star",1.5:"1.5 star",2:"2 star",2.5:"2.5 star",3:"3 star",3.5:"3.5 star",4:"4 star",4.5:"4.5 star",5:"5 star"}}).on("rating.change",function(e,i,a){n.put("/api/rating",JSON.stringify({value:i}),"application/json").then(function(e){t.rating=e.data.value},function(e){})})}]).controller("InstructionsController",["$rootScope",function(e){e.bgimg="'/images/back.png'"}]).controller("QuizController",["$scope","socketd","$timeout","$route",function(e,t,n,i){t.on("reload:quiz",function(){i.reload()}),t.emit("join:quiz"),$("#flash_div").hide(),$("#flash_message").hide(),$("#quiz_modal").hide(),t.on("current:quiz",function(t){$("#flash_div").hide(),$("#flash_message").hide(),$("#quiz_modal").show(),e.quiz=t,angular.element($("#qid")).html(e.quiz.q_question),angular.element($("#opt_1")).html(e.quiz.q_op1),angular.element($("#opt_2")).html(e.quiz.q_op2),angular.element($("#opt_3")).html(e.quiz.q_op3),angular.element($("#opt_4")).html(e.quiz.q_op4)}),t.on("countdown:quiz",function(t){$("#quiz_modal").hide(),$("#flash_div").show(),$("#flash_message").hide(),e.endtime="2017-02-"+t.day+" "+t.hour+":"+t.min;var n=moment.tz(e.endtime,"Asia/Kolkata");$("#clockdiv").countdown(n.toDate(),function(e){$(this).html(e.strftime("<div><span class='days'>%-d</span><div class='smalltext'>Day%!d</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"))})}),t.on("no:quiz",function(e){$("#quiz_modal").hide(),$("#flash_div").hide(),$("#flash_message").show()}),$(function(){var e=$("#loadbar").hide();$(document).ajaxStart(function(){e.show()}).ajaxStop(function(){e.hide()}),$("label.btn").on("click",function(){var e=$(this).find("input:radio").val();t.emit("submit:quiz",{choice:e}),$("#loadbar").show(),$("#quiz").fadeOut(),t.on("result:quiz",function(e){setTimeout(function(){$("#answer").html(e.message),$("#loadbar").fadeOut()},1500)})})})}]);
"use strict";angular.module("AuctionIt.directives",[]).directive("myProfileDirective",["$timeout",function(t){return{restrict:"A",link:function(i,n,s){t(function(){n.html($("#slide-content-0").html())},1e3)}}}]).directive("countdownDirective",["$timeout",function(t){return{restrict:"A",link:function(i,n,s){t(function(){$("[data-countdown]").each(function(){var t=$(this),i=$(this).data("countdown");t.countdown(i,function(i){t.html(i.strftime("<div><span class='days'>%D</span><div class='smalltext'>Day%!D</div></div><div><span class='hours'>%H</span><div class='smalltext'>Hour%!H</div></div><div><span class='minutes'>%M</span><div class='smalltext'>Minute%!M</div></div><div><span class='seconds'>%S</span><div class='smalltext'>Seconds</div></div>"))})})},0)}}}]).directive("quizDirective",["$timeout",function(t){return{restrict:"A",link:function(i,n,s){t(function(){},1e3)}}}]);
"use strict";angular.module("AuctionIt.filters",[]).filter("reverse",function(){return function(e){return e.slice().reverse()}});
"use strict";angular.module("AuctionIt.services",[]).factory("socket",["$rootScope",function(n){var o=io("/join");return{on:function(t,i){o.on(t,function(){var t=arguments;n.$apply(function(){i.apply(o,t)})})},emit:function(t,i,c){o.emit(t,i,function(){var t=arguments;n.$apply(function(){c&&c.apply(o,t)})})}}}]).factory("socketa",["$rootScope",function(n){var o=io("/auction");return{on:function(t,i){o.on(t,function(){var t=arguments;n.$apply(function(){i.apply(o,t)})})},emit:function(t,i,c){o.emit(t,i,function(){var t=arguments;n.$apply(function(){c&&c.apply(o,t)})})}}}]).factory("socketb",["$rootScope",function(n){var o=io("/wheeloffortune");return{on:function(t,i){o.on(t,function(){var t=arguments;n.$apply(function(){i.apply(o,t)})})},emit:function(t,i,c){o.emit(t,i,function(){var t=arguments;n.$apply(function(){c&&c.apply(o,t)})})}}}]).factory("socketc",["$rootScope",function(n){var o=io("/profile");return{on:function(t,i){o.on(t,function(){var t=arguments;n.$apply(function(){i.apply(o,t)})})},emit:function(t,i,c){o.emit(t,i,function(){var t=arguments;n.$apply(function(){c&&c.apply(o,t)})})}}}]).factory("socketd",["$rootScope",function(n){var o=io("/quiz");return{on:function(t,i){o.on(t,function(){var t=arguments;n.$apply(function(){i.apply(o,t)})})},emit:function(t,i,c){o.emit(t,i,function(){var t=arguments;n.$apply(function(){c&&c.apply(o,t)})})}}}]);