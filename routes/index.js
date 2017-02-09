var User = require('../models/user');

module.exports = function(io) {
  var routes = {};

  routes.index = function(req, res){

    User.count({tek_userid: req.sess.username} ,function(err,count){
      if(err) throw err;
      if(count>0)
      {
        User.update({tek_userid: req.sess.username},{$set:{u_firstvisit: false}}, function(err,user){
          if(err) throw err;
        });
      }
      else {
        var user = new User({tek_userid: req.sess.username,u_firstvisit: true, u_cashbalance: 30000, u_itemswon: 0, u_itemssold: 0, u_itempoints: 0, u_quizlevel: 1, chat_status: true, quiz_attempt_status: true, wof_status: true, wof_flag: false, quiz_flag: false,wof_no_attempts: 0, quiz_no_attempts: 0});
        user.badge.beginner= false;
        user.badge.intermediate= false;
        user.badge.advanced= false;
        user.save(function(err,rows){
          if(err) throw err;
        });
      }
    });


    User.findOne({tek_userid: req.sess.username},function(err,user){
      if(user)
      {
        var beginner_badge = false;
        var intermediate_badge = false;
        var advanced_badge = false;
        var beg_imgpath = 'badge/beginnerfaded.png';
        var int_imgpath = 'badge/intermediatefaded.png';
        var adv_imgpath = 'badge/advancedfaded.png';
        var user_cashbal = user.u_cashbalance;
        if(user.quiz_no_attempts>10) quiz_level = 2;
        else if(user.quiz_no_attempts>20) quiz_level = 3;
        else if(user.quiz_no_attempts>40) quiz_level = 4;
        else if(user.quiz_no_attempts>80) quiz_level = 5;


        if(user.u_itemswon>0 && user.wof_no_attempts>0 && user.quiz_no_attempts>0 && user.badge[0].beginner.value == false){
          beginner_badge = true;
          beg_imgpath  = 'badge/beginner.png';
          user_cashbal += 7000;
          console.log("beginner");
        }
        if(user.u_itemswon>4 && user.wof_no_attempts>4 && user.quiz_no_attempts>4 && user.badge[0].intermediate.value == false){
          intermediate_badge = true;
          int_imgpath =  'badge/intermediate.png';
          user_cashbal += 15000;
        }
        if(user.u_itemswon>9 && user.wof_no_attempts>9 && user.quiz_no_attempts>9 && user.badge[0].advanced.value == false){
          advanced_badge = true;
          adv_imgpath = 'badge/advanced.png';
          user_cashbal += 30000;
        }
        if(beginner_badge == true || intermediate_badge == true || advanced_badge == true)
        {
          var u = new User();
          var badge = u.badge.create({beginner:{value:beginner_badge,imgpath:beg_imgpath}, intermediate:{value:intermediate_badge,imgpath:int_imgpath},advanced:{value:advanced_badge,imgpath:adv_imgpath}});
          User.update({tek_userid: req.sess.username},{$set:{badge:badge,u_cashbalance: user_cashbal, u_quizlevel: quiz_level}},{new: true}, function(err,user){
            if(err) throw err;
          });
        }
      }
    });

  res.render('index', {title: 'AuctionIt'});
};

routes.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name, {title: 'AuctionIt'});
};


function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getUTC()
{
  var current = getDateTime().toString().split(/[- :]/);
  var date =  new Date(Date.UTC(current[0], current[1]-1, current[2],current[3], current[4], current[5]));
  return date;
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

  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}


return routes;
};
