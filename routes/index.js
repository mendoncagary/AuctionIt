var User = require('../models/user');

module.exports = function(io) {
  var routes = {};

routes.index = function(req, res){


  User.count({tek_userid: req.session.passport.user} ,function(err,count){
            if(err) throw err;
            if(count>0)
            {
              User.update({tek_userid: req.session.passport.user},{$set:{u_firstvisit: false}}, function(err,user){
                if(err) throw err;
              });
            }
            else {
              var user = new User({tek_userid:req.session.passport.user, tek_name:'gary',u_firstvisit: true, u_cashbalance: 30000, u_itemswon: 0,u_itempoints: 0, u_quizlevel: 1, chat_status: true, quiz_attempt_status: true, wof_status: true});
              user.save(function(err,rows){
              if(err) throw err;
              });
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
