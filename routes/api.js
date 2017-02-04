var Item = require('../models/item');
var User = require('../models/user');
var fs = require('fs');


exports.item = function (req, res) {
  var id = req.params.id;

  if(id.match(/^[0-9a-fA-F]{24}$/))
  {
    Item.find({ _id:id, i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}},function(err,item){
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

      var item_endhour = date.getUTCHours();
      if(item_endhour<10) item_endhour = "0"+item_endhour;

      var item_endmin = date.getUTCMinutes();
      if(item_endmin<10) item_endmin = "0"+item_endmin;

      var item_endsec = date.getUTCSeconds();
      if(item_endsec<10) item_endsec = "0"+item_endsec;

      var item_endmonth = date.getUTCMonth()+1;
      if(item_endmonth<10) item_endmonth = "0"+item_endmonth;

      var item_endday = date.getUTCDate();
      if(item_endday<10) item_endday = "0"+item_endday;

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
      item_endmonth : item_endmonth,
      item_enddate : item_endday,
      item_endhour : item_endhour,
      item_endmin : item_endmin,
      item_endsec : item_endsec,
      item_owner : item[i].i_owner

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


            User.findOne({tek_userid: req.session.passport.user},function(err,user){
              if(err) throw err;

              if(user)
              {
                  res.json({
                userid : user.tek_userid,
                username :  user.tek_name,
                cashbal :  user.u_cashbalance,
                auction_points : user.u_itempoints,
                items_won : user.u_itemswon,
                items_sold: user.u_itemssold,
                quizlevel : user.u_quizlevel
                });
              }
            });



};



exports.rating = function(req,res){
  if(req.body.value >=0 && req.body.value<=5)
  {
            User.findOneAndUpdate({tek_userid: req.session.passport.user},{$set:{rating:req.body.value }},{new: true},function(err,user){
              if(err) throw err;

              if(user)
              {
                console.log(user);
                  res.json({
                    rating: user.rating
                });
              }
            });
}

};


exports.rating_get = function(req,res){
            User.findOne({tek_userid: req.session.passport.user},{'_id':0, 'rating':1},function(err,user){
              if(err) throw err;

              if(user)
              {
                console.log(user);
                  res.json({
                    rating: user.rating
                });
              }
            });

};

exports.itemswon = function(req,res){

  var itemlist = {};
  var itemid = {};
  var itemname = {};
  var itemdesc = {};
  var itemprice = {};
  var itempath = {};
  var costprice_1 = {};
  var costprice_2 = {};
  var costprice_3 = {};
  Item.find({i_is_won : true, 'bid.user_id': req.session.passport.user,i_owner: req.session.passport.user },'_id i_name i_baseprice i_desc i_imgpath',function(err,item){
  if(err) throw err;
  if(item.length>0)
  {
    for(var i in item)
    {
      console.log(item);
      itemid[i] = item[i]._id;
      itemname[i] = item[i].i_name;
      itemprice[i] = item[i].i_baseprice;
      costprice_1[i] = 10*item[i].i_baseprice/100;
      costprice_2[i] = 20*item[i].i_baseprice/100;
      costprice_3[i] = 30*item[i].i_baseprice/100;
      itemdesc[i] = item[i].i_desc;
      var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);
        buffer = buf;
        img = true;
        itempath[i] = buffer.toString('base64');
    }
    for(var i in item)
    {
      itemlist[i] = { id:itemid[i], name:itemname[i], price:itemprice[i], desc:itemdesc[i], image:img, path:itempath[i],cost_1:costprice_1[i],cost_2:costprice_2[i],cost_3:costprice_3[i]};
    }

  res.json({item: itemlist});
  img = false;

  }
  });


};


exports.leaderboard = function(req,res){
var userlist = {};
var userid = {};
var itemswon = {};
var aucpoints = {};

  User.find({},
  {'_id':0, 'tek_userid':1, 'u_itemswon':1, 'u_itempoints':1},
  {
      skip:0,
      limit:10,
      sort:{
        u_itempoints  : -1
      }
  },
  function(err,users){
        if(err) throw err;
        if(users.length>0)
        {
          for(var i in users)
          {
            userid[i] = users[i].tek_userid;
            itemswon[i] = users[i].u_itemswon;
            aucpoints[i] = users[i].u_itempoints;
          }
          for(var i in users)
          {
            userlist[i] = {id:userid[i],itemswon: itemswon[i],aucpoints:aucpoints[i]};
          }
          res.json({
            users: userlist
          });
        }
  })

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
