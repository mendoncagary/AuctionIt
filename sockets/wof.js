var cron = require('node-cron');
var Chat = require('../models/chat');
var User = require('../models/user');
var fs = require('fs');

module.exports = function (io) {

  var wof = io.of('/wheeloffortune');

  var slices = 8;
  var slicePrizes = [500, 50, 500, 0, 200, 100, 150, 0];

  wof.on('connection', function (socket) {

    if (socket.request.user && socket.request.user.logged_in) {
         console.log("User info:",socket.request.user);
       }


        socket.on('begin:wof',function(){
          wof.room = 'wheeloffortune';
          socket.join(wof.room);
          console.log("Client Joined Room:",wof.room);
        });


        socket.on('spin:wof',function(){
          var curtime = new Date(getUTC());
          var min = curtime.getUTCMinutes();
          if(min>=0 && min<=30)
          {
            var rounds = getRandomInt(2,4);
            var degrees = getRandomInt(0,360);
            var prize = slices - 1 - Math.floor(degrees / (360 / slices));
            console.log("Client won:", slicePrizes[prize]);
            User.findOne({tek_userid: socket.request.user.username } , function(err,user){
            if(err) throw err;
              var cashbalance = user.u_cashbalance;
              cashbalance += slicePrizes[prize];
               User.update({tek_userid: user.tek_userid},{$set: {u_cashbalance: cashbalance}}, function(err, rows){
                  if(err) throw err;
                    socket.emit('result:wof',{rounds: rounds,degrees: degrees,prize: prize});
               });

          });

          }

        });



    Chat.find({},{} ,{ limit:10, sort:{ _id: -1}},function(err,chat){
    if(err) throw err;
    for(var i in chat)
    {
      d=getUTC();
    socket.emit('message',{message: chat[i].message,time:timeDifference(d,chat[i].time),name:chat[i].from_user});
    }
    });





    	wof.on('send', function (data) {
            if(data.message!="" && data.message.length<100)
            {
              time = getUTC();
            var chat_message = new Chat({message:data.message,from_user:'gary',time:time});
            chat_message.save(function(err,rows){
            if(err) throw err;

          Chat.findOne({}, {}, { sort: { _id : -1 } }, function(err, chat) {
          if(err) throw err;
            d=getUTC();
            wof.emit('message',{message: chat.message,time:timeDifference(d,chat.time),name:chat.from_user});
        });
    });
    }
    else
    {
    socket.emit('message',{message: data.message,time:'Maximum message size is 100 characters.Message could not be sent',name:'gary'});
    }
    	});


    socket.on('disconnect',function(){
      socket.leave(wof.room);
      console.log("User disconnected");
    });

});


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
    }
}

function getUTC()
{
  var current = getDateTime().toString().split(/[- :]/);
  var date =  new Date(Date.UTC(current[0], current[1]-1, current[2],current[3], current[4], current[5]));
return date;
}


}
