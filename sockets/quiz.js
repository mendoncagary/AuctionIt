var CronJob = require('cron').CronJob;
var User = require('../models/user');
var Quiz = require('../models/quiz');
var fs = require('fs');

module.exports = function (io) {


        var job = new CronJob('20,50 * * * *', function() {
            User.update({}, { $set:{ quiz_flag: false }},{multi: true}, function(err,user){
              if(err) throw err;
            });
          }, function () {
            /* This function is executed when the job stops */
          },
          true,
          'Asia/Kolkata'
        );


  var quiz  = io.of('/quiz');

  quiz.on('connection', function (socket) {

    if (socket.request.user && socket.request.user.logged_in) {
       }


        socket.on('join:quiz',function(){
          quiz.room = 'quiz';
          socket.join(quiz.room);

          User.findOne({tek_userid: socket.request.user.username, quiz_flag:true} , function(err,user){
            if(err) throw err;
            if(user){
              var curtime = new Date(getUTC());
              var min = curtime.getUTCMinutes();

              day = curtime.getUTCDate();
              if(day<10){ day = "0"+day;}

              if(min>=0 && min<=19)
              {
                socket.emit('countdown:quiz',{day:day,hour:curtime.getUTCHours(),min:30,message:"Next quiz starts in"});
              }
              else if(min>=30 && min<=49)
              {
                  socket.emit('countdown:quiz',{day:day,hour:curtime.getUTCHours()+1,min:"00",message:"Next quiz starts in"});
              }
            }
          });

          User.findOne({tek_userid: socket.request.user.username, quiz_flag:false} , function(err,user){
            if(err) throw err;
            if(user){
              var curtime = new Date(getUTC());
              var min = curtime.getUTCMinutes();
              day = curtime.getUTCDate();
              if(day<10){ day = "0"+day;}

              if(min>=20 && min<=29)
              {
                socket.emit('countdown:quiz',{day:day,hour:curtime.getUTCHours(),min:30,message:"Next quiz starts in"});
              }
              else if(min>=50 && min<=59)
              {
                  socket.emit('countdown:quiz',{day:day,hour:curtime.getUTCHours()+1,min:"00",message:"Next quiz starts in"});
              }
              else if(min>=0 && min<=19 || min>=30 && min<=49)
              {
                Quiz.findOne({q_starttime:{ $lte: getUTC()},q_endtime:{$gt:getUTC()}} ,{'_id':0, 'q_question':1, 'q_op1':1, 'q_op2':1, 'q_op3':1, 'q_op4':1}, function(err,quiz){
                  if(quiz)
                  {
                    console.log(quiz);
                    socket.emit('current:quiz',quiz);
                  }
                  else{
                    socket.emit('no:quiz',{message:"Sorry, come back later for a quiz"});
                  }
                });
              }
            }
        });




                socket.on('submit:quiz',function(){
                  var curtime = new Date(getUTC());
                  var min = curtime.getUTCMinutes();
                  if(min>=0 && min<=19 || min>=30 && min<=49)
                  {
                    console.log("You cannot play now");
                      User.findOne({tek_userid: socket.request.user.username, quiz_flag:false} , function(err,user){
                        if(err) throw err;
                      if(user)
                      {

                      var cashbalance = user.u_cashbalance;
                      cashbalance += slicePrizes[prize];
                       User.update({tek_userid: user.tek_userid},{$set: {u_cashbalance: cashbalance,wof_flag: true}}, function(err, rows){
                          if(err) throw err;
                            socket.emit('result:quiz',{rounds: rounds,degrees: degrees,prize: prize});
                       });
                     }

                  });

                  }

                });




      });







    socket.on('disconnect',function(){
      socket.leave(quiz.room);
      console.log("User left quiz");
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
