var session = require('client-sessions');
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



    if (socket.request.user && socket.request.user.logged_in) {
       }

       var job = new CronJob('0,30 * * * *', function() {
           quiz.emit('reload:quiz');
         }, function () {
           /* This function is executed when the job stops */
         },
         true,
         'Asia/Kolkata'
       );




        socket.on('join:quiz',function(){
          quiz.room = 'quiz';
          socket.join(quiz.room);

          User.findOne({tek_userid: req.sess.username, quiz_flag:true} , function(err,user){
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

          User.findOne({tek_userid: req.sess.username, quiz_flag:false} , function(err,user){
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
                    socket.emit('current:quiz',quiz);
                  }
                  else{
                    socket.emit('no:quiz',{message:"Sorry, come back later for a quiz"});
                  }
                });
              }
            }
        });




                socket.on('submit:quiz',function(data){
                  var curtime = new Date(getUTC());
                  var min = curtime.getUTCMinutes();
                  if(min>=0 && min<=19 || min>=30 && min<=49)
                  {
                    Quiz.findOne({q_starttime:{ $lt: getUTC()},q_endtime:{$gt:getUTC()}},function(err,quiz){
                    if(err) throw err;
                    if(quiz)
                    {
                      if(data.choice==1) answer = quiz.q_op1;
                      else if(data.choice==2) answer = quiz.q_op2;
                      else if(data.choice==3) answer = quiz.q_op3;
                      else if(data.choice==4) {answer = quiz.q_op4;}

                      if(answer == quiz.q_ans)
                      {
                        User.findOne({tek_userid: req.sess.username, quiz_flag:false} , function(err,user){
                          if(err) throw err;
                        if(user)
                        {
                        var cashbalance = user.u_cashbalance;
                        cashbalance += 2000;
                         User.update({tek_userid: user.tek_userid,quiz_flag:false},{$set: {u_cashbalance: cashbalance,quiz_flag: true}, $inc:{quiz_no_attempts: 1}}, function(err, rows){
                            if(err) throw err;
                              socket.emit('result:quiz',{message:"CORRECT. YOU JUST WON $2000"});
                         });
                       }
                    });
                      }
                      else {
                        User.findOne({tek_userid: req.sess.username, quiz_flag:false} , function(err,user){
                          if(err) throw err;
                          if(user)
                          {
                          User.update({tek_userid: user.tek_userid,quiz_flag: false},{$set: {quiz_flag: true}}, function(err, rows){
                           if(err) throw err;
                           socket.emit('result:quiz',{message:"INCORRECT"});
                         });
                         }
                         else {
                           socket.emit('result:quiz',{message:"YOU HAVE ALREADY ATTEMPTED THE QUIZ"});

                         }
                      });
                      }
                    }
                  });
                }
                });




      });







    socket.on('disconnect',function(){
      socket.leave(quiz.room);
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
