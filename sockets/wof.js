var session = require('client-sessions');
var CronJob = require('cron').CronJob;
var User = require('../models/user');
var fs = require('fs');

module.exports = function (io) {


        var job = new CronJob('20,50 * * * *', function() {
            User.update({}, { $set:{ wof_flag: false }},{multi: true}, function(err,user){
              if(err) throw err;
            });
          }, function () {
            /* This function is executed when the job stops */
          },
          true,
          'Asia/Kolkata'
        );




  var wof = io.of('/wheeloffortune');

  var slices = 8;
  var slicePrizes = [2500, 500, 5000, 0, 2000, 1000, 1500, 0];

  wof.on('connection', function (socket) {


    var cookie_string = socket.request.headers.cookie;
    var req = { headers : {cookie : cookie_string} };
    session({ cookieName:'sess',
    secret: '134klh389dbcbsldvn1mcbj',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    //secure: true,
    ephemeral: true
    })(req, {}, function(){})




            var job = new CronJob('0,30 * * * *', function() {
                wof.emit('reload:wof');
              }, function () {
                /* This function is executed when the job stops */
              },
              true,
              'Asia/Kolkata'
            );



    if (socket.request.user && socket.request.user.logged_in) {

       }

        socket.on('begin:wof',function(){
          wof.room = 'wheeloffortune';
          socket.join(wof.room);

          User.findOne({tek_userid: req.sess.username, wof_flag:true} , function(err,user){
            if(err) throw err;
            if(user){
              var curtime = new Date(getUTC());
              var min = curtime.getUTCMinutes();

              day = curtime.getUTCDate();
              if(day<10){ day = "0"+day;}

              if(min>=0 && min<=29)
              {
                var hour = curtime.getUTCHours();
                if(hour<10){ hour = "0"+hour;}
                socket.emit('countdown:wof',{day:day, hour:hour, min:30});
              }
              else if(min>=30 && min<=49)
              {
                  var hour = curtime.getUTCHours() +1;
                  if(hour<10){ hour = "0"+hour;}

                  socket.emit('countdown:wof',{day:day,hour:hour, min:"00"});
              }
            }
          });

          User.findOne({tek_userid: req.sess.username, wof_flag:false} , function(err,user){
            if(err) throw err;
            if(user){
              var curtime = new Date(getUTC());
              var min = curtime.getUTCMinutes();

              day = curtime.getUTCDate();
              if(day<10){ day = "0"+day;}


              if(min>=20 && min<=29)
              {
                var hour = curtime.getUTCHours();
                if(hour<10){ hour = "0"+hour;}
                socket.emit('countdown:wof',{day:day,hour:hour,min:30});
              }
              else if(min>=50 && min<=59)
              {
                var hour = curtime.getUTCHours()+1;
                if(hour<10){ hour = "0"+hour;}
                  socket.emit('countdown:wof',{day:day,hour:hour,min:"00"});
              }
            }
        });
      });

        socket.on('spin:wof',function(){
          var curtime = new Date(getUTC());
          var min = curtime.getUTCMinutes();
          if(min>=0 && min<=19 || min>=30 && min<=49)
          {
              User.findOne({tek_userid: req.sess.username, wof_flag:false} , function(err,user){
                if(err) throw err;
              if(user)
              {
                var rounds = getRandomInt(6,10);
                var degrees = getRandomInt(0,360);
                var prize = slices - 1 - Math.floor(degrees / (360 / slices));
                var cashbalance = user.u_cashbalance;
              cashbalance += slicePrizes[prize];
               User.update({tek_userid: user.tek_userid},{$set: {u_cashbalance: cashbalance,wof_flag: true},$inc:{wof_no_attempts:1}}, function(err, rows){
                  if(err) throw err;
                    socket.emit('result:wof',{rounds: rounds,degrees: degrees,prize: prize});
               });
             }

          });

          }

        });




    socket.on('disconnect',function(){
      socket.leave(wof.room);
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
