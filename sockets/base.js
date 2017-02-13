
var session = require('client-sessions');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var Item = require('../models/item');
var Chat = require('../models/chat');
var User = require('../models/user');
var request = require('request');


module.exports = function (io) {

var datetime;
var buffer;
var img = false;

var nsp = io.of('/join');

nsp.on('connection', function (socket) {

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



    var job = new CronJob({
      cronTime: '* * * * * *',
      onTick: function() {
        Item.find({i_starttime : getUTC(),i_flag: 0}, function(err,item){
        if(err) throw err;
       if(item.length>0)
        {
          Item.update({i_starttime : getUTC(),i_flag: 0},{$set: {i_flag: 1}},{multi:true}, function(err,item){
            if(err) throw err;
          });
          for(var i in item)
          {
              var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);
              buffer = buf;
              img = true;
          nsp.emit('item',{item_id: item[i].i_id, item_name: item[i].i_name, item_desc: item[i].i_desc, item_price: item[i].i_baseprice, image: img, item_image: buffer.toString('base64')});
            img=false;
            nsp.emit('new:item');
            }
            }
          });

          Item.find({i_endtime :getUTC(),i_is_won:false}, function(err,item){
          if(err) throw err;
            if(item.length>0)
            {
              for(var i in item)
              {
                if(item[i].bid.length>0){
                  var size = item[i].bid.length;
                  var owner = item[i].bid[size-1].user_id;
                  old_owner = item.i_owner;
                  curr_cash = item[i].baseprice;
                }
                else {owner = "System Admin";}
                actual_price = 2*item[i].i_currentprice;
                Item.update({i_endtime: getUTC(),i_is_won:false},{$set:{i_is_won:true, i_flag:0, i_owner: owner, i_baseprice:item[i].i_currentprice,i_actualprice:actual_price} }, {multi:true},function (err, item) {
                  if(err) throw err;
                  });
                    if(item[i].bid.length>0)
                    {
                      var size = item[i].bid.length;
                      var actualprice = item[i].i_actualprice;
                      var deduction = item[i].bid[size-1].value;
                      User.findOne({tek_userid: item[i].bid[size-1].user_id},function(err,user){
                        if(err) throw err;
                        if(user)
                        {
                          var cur_itempoints = 0;
                          if (deduction <= (actualprice/2)) {
                                cur_itempoints = 10;
                            }else if(deduction <= (actualprice*3/5)) {
                                cur_itempoints = 9;
                            }else if(deduction <= (actualprice*7/10)) {
                                cur_itempoints = 8;
                            }else if(deduction <= (actualprice*4/5)) {
                                cur_itempoints = 7;
                            }else if(deduction <= (actualprice*11/10)) {
                                cur_itempoints = 7;
                            }else if(deduction <= (actualprice*6/5)) {
                                cur_itempoints = 6;
                            }else if(deduction <= (actualprice*13/10)) {
                                cur_itempoints = 6;
                            }else if(deduction <= (actualprice*7/5)) {
                                cur_itempoints = 5;
                            }else {
                                cur_itempoints = 5;
                            }
                            u_itempoints = cur_itempoints + user.u_itempoints;
                          var cash = user.u_cashbalance - deduction;
                          User.update({tek_userid: item[i].bid[size-1].user_id}, {$set:{u_cashbalance:cash, u_itempoints:u_itempoints},$inc:{u_itemswon: 1}},function(err,user){
                            if(err) throw err;
                          });
                          
                          User.findOne({tek_userid: old_owner},function(err,user){
                            if(user)
                            {
                              var old_owner_cashbal = user.u_cashbalance + deduction - curr_cash;
                                User.update({tek_userid: old_owner},{$set:{u_cashbalance: old_owner_cashbal},function(err,row){
                                  if(err) throw err;
                                }});
                            }
                          });

                        }
                      });
                    }
                  }
                  nsp.emit('end',true);
                }
          });
      },
      start: false,
      timeZone: 'Etc/UTC'
    });
    job.start();




  socket.on('join:area',function(){

    Item.find({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}},function(err,item){
    if(err) throw err;
    if(item.length>0)
    {
      for(var i in item)
    {
    var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);

      buffer = buf;
      img = true;
    socket.emit('item',{item_id: item[i]._id, item_name: item[i].i_name, item_desc: item[i].i_desc, item_price: item[i].i_baseprice, image: img, item_image: buffer.toString('base64') });
    img=false;
    }
    }
    });

    //Upcoming Auctions
    Item.find({ i_starttime :{$gt: getUTC()}},{},{limit: 6, sort:{i_starttime:1} }, function(err,item){
    if(err) throw err;
    if(item.length>0)
    {
    for(var i in item)
    {
    var start_time = item[i].i_starttime.toISOString();
    var start_time = start_time.split(/[T|.|Z]/);
    var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);
    buffer = buf;
    img = true;
    socket.emit('upcomingItem',{item_name: item[i].i_name, item_price: item[i].i_baseprice,item_starttime:start_time, image: img, item_image: buffer.toString('base64') });
    img=false;
    }
    }
    });


      socket.on('disconnect', function(){

      });

    });


socket.on('join:game',function(){
  Chat.find({},{} ,{ limit:10, sort:{ _id: -1}},function(err,chat){
  if(err) throw err;
    var chatnew = {};
  for(var i in chat)
  {
    d=getUTC();
    chatnew[10-i] = {message:chat[i].message,time:chat[i].time,from_user:chat[i].from_user};
  }
  for(var i in chatnew)
  {
  socket.emit('message',{message: chatnew[i].message,time:timeDifference(d,chatnew[i].time),name:chatnew[i].from_user});
}
  });


socket.on('send', function (data) {
      if(data.message!="" && data.message.length<100)
      {
        time = getUTC();
      var chat_message = new Chat({message:data.message,from_user:req.sess.username,time:time});
      chat_message.save(function(err,rows){
      if(err) throw err;


    Chat.findOne({}, {}, { sort: { _id : -1 } }, function(err, chat) {
    if(err) throw err;
      d=getUTC();
  nsp.emit('message',{message: chat.message,time:timeDifference(d,chat.time),name:chat.from_user});
  });
});
}
else
{
socket.emit('message',{message: data.message,time:'Maximum message size is 100 characters.Message could not be sent',name:req.sess.username});
}
});
});



  });










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
        return 'about ' + Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'about ' + Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return 'about ' + Math.round(elapsed/msPerYear ) + ' years ago';
    }
}

function getUTC()
{
  var current = getDateTime().toString().split(/[- :]/);
  var date =  new Date(current[0], current[1]-1, current[2],current[3], current[4], current[5]);
return date;
}

 }
