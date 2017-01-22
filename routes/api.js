var Item = require('../models/item');
var User = require('../models/user');
var fs = require('fs');

exports.item = function (req, res) {
  var id = req.params.id;


  if(id.match(/^[0-9a-fA-F]{24}$/))
  {
    Item.find({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}, _id:id},function(err,item){
    if(err) throw err;
    if(item.length>0)
    {
      for(var i in item)
    {
    var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);
      buffer = buf;
      img = true;

      var curBidValue1 = item[i].i_baseprice;
      var curBidValue2 = item[i].i_baseprice + item[i].i_increment;
      var curBidValue3 = item[i].i_baseprice + (item[i].i_increment * 2);

      var endtime = item[i].i_endtime;
      var date =  new Date(endtime);
    res.json({
      item_name: item[i].i_name,
      item_price: item[i].i_baseprice,
      item_desc: item[i].i_desc,
      image: img,
      item_image: buffer.toString('base64'),
      item_bid: item[i].i_bidvalue,
      curBidValue1 : curBidValue1,
      curBidValue2 : curBidValue2,
      curBidValue3 : curBidValue3,
      item_enddate : date.getUTCDate(),
      item_endhour : date.getUTCHours(),
      item_endmin : date.getUTCMinutes()
    });
    img = false;
    }
  }
  else{
    res.json({code : "redirect"});
  }
});
}
else {
  res.json({code : "redirect"});
}

};


exports.profile = function(req,res){

User.count({tek_userid: req.session.passport.user} ,function(err,count){
          if(err) throw err;
          if(count>0)
          {
            User.findOne({tek_userid: req.session.passport.user},function(err,user){
              if(err) throw err;
                  res.json({
                userid : user.tek_userid,
                username :  user.tek_name,
                cashbal :  user.u_cashbalance,
                auction_points : user.u_itempoints,
                items_won : user.u_itemswon,
                quizlevel : user.u_quizlevel
                });

              
            });
          }
          else {
            var user = new User({tek_userid:req.session.passport.user, tek_name:'gary',u_firstvisit: false, u_cashbalance: 30000, u_itemswon: 0,u_itempoints: 0, u_quizlevel: 1, chat_status: true, quiz_attempt_status: true, wof_status: true});
            user.save(function(err,rows){
            if(err) throw err;

                res.json({
                userid : req.session.passport.user,
                username : "gary",
                cashbal : 30000,
                auction_points : 0,
                items_won : 0,
                quizlevel : 1
                });
            });
          }

      });


};


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
