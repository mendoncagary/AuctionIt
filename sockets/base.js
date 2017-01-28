//var cron = require('node-cron');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var Item = require('../models/item');
var Chat = require('../models/chat');
var User = require('../models/user');

module.exports = function (io) {

var datetime;
var buffer;
var img = false;

var nsp = io.of('/play');

nsp.on('connection', function (socket) {


    var job = new CronJob({
      cronTime: '* * * * * *',
      onTick: function() {

        Item.find({i_starttime : getUTC(),i_flag: 0}, function(err,item){
        if(err) throw err;
       if(item.length>0)
        {
          Item.update({i_starttime : getUTC(),i_flag: 0},{$set: {i_flag: 1}},{new:true}, function(err,item){
            if(err) throw err;
          });
          for(var i in item)
          {
              var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);
              buffer = buf;
              img = true;
          nsp.emit('item',{item_id: item[i].i_id, item_name: item[i].i_name, item_desc: item[i].i_desc, item_price: item[i].i_baseprice, image: img, item_image: buffer.toString('base64')});
            img=false;
            }
            }
          });

          Item.find({i_endtime :getUTC(),i_is_won:false}, function(err,item){
          if(err) throw err;
            if(item.length>0)
            {
              for(var i in item)
              {
                Item.update({i_endtime: getUTC(),i_is_won:false},{$set:{i_is_won: true,i_flag:0,i_owner: item[i].bid[0].user_id} }, {new:true},function (err, item) {
                  if(err) throw err;
                  });

                    if(item[i].bid!=null)
                    {
                      var basprice = item[i].i_baseprice;
                      var deduction = item[i].bid[0].value;
                      User.findOne({tek_userid: item[i].bid[0].user_id},function(err,user){
                        if(err) throw err;
                        if(user)
                        {
                          var cur_itempoints = 0;

                          if (deduction <= (baseprice/2)) {
                                cur_itempoints = 10;
                            }else if(deduction <= (baseprice*3/5)) {
                                cur_itempoints = 9;
                            }else if(deduction <= (baseprice*7/10)) {
                                cur_itempoints = 8;
                            }else if(deduction <= (baseprice*4/5)) {
                                cur_itempoints = 7;
                            }else if(deduction <= (baseprice*11/10)) {
                                cur_itempoints = 7;
                            }else if(deduction <= (baseprice*6/5)) {
                                cur_itempoints = 6;
                            }else if(deduction <= (baseprice*13/10)) {
                                cur_itempoints = 6;
                            }else if(deduction <= (baseprice*7/5)) {
                                cur_itempoints = 5;
                            }else {
                                cur_itempoints = 5;
                            }

                            u_itempoints = cur_itempoints + user.u_itempoints;

                          var cash = user.u_cashbalance - deduction;
                          User.update({tek_userid: item[i].bid[0].user_id}, {$set:{u_cashbalance:cash, u_itempoints:u_itempoints},$inc:{u_itemswon: 1}},function(err,user){
                            if(err) throw err;
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
      timeZone: 'Asia/Kolkata'
    });
    job.start();

  //cron.schedule('* * * * * *', function(){

  //});





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
  Item.find({ i_starttime :{$gt: getUTC()}},function(err,item){
if(err) throw err;

if(item.length>0)
{
  for(var i in item)
{
  //var current = getDateTime().toString().split(/[- :]/);
  //var date =  new Date(current[0], current[1]-1, current[2],current[3], current[4], current[5]);
//console.log('selected',rows[i].i_name);
//  var td = timeDifference(date,item[i].time);
//console.log('Upcoming item:', item[i].i_baseprice);
var buf = fs.readFileSync('uploads/'+item[i].i_imgpath);

  buffer = buf;
  img = true;

socket.emit('upcomingItem',{item_name: item[i].i_name, item_price: item[i].i_baseprice, image: img, item_image: buffer.toString('base64') });
img=false;
}
}
});





	//console.log("A user connected");

	socket.emit('login');

	socket.on('username', function(username){
      socket.username = username;
 });

    //socket.emit('message', { message: 'welcome to the chat' });

    Chat.find({},{} ,{ limit:10, sort:{ _id: -1}},function(err,chat){
    if(err) throw err;

    //console.log('Selected:', rows);
    for(var i in chat)
    {
      d=getUTC();
      //console.log(d,rows[i].time);
      //console.log(timeDifference(d,rows[i].time));

    socket.emit('message',{message: chat[i].message,time:timeDifference(d,chat[i].time),name:chat[i].from_user});
  }
  //console.log('Messagesent');
    });



	socket.on('send', function (data) {

        if(data.message!="" && data.message.length<100)
        {
          time = getUTC();

        var chat_message = new Chat({message:data.message,from_user:'gary',time:time});

        chat_message.save(function(err,rows){
        if(err) throw err;
        console.log('Chat inserted - ID:',rows);



      Chat.findOne({}, {}, { sort: { _id : -1 } }, function(err, chat) {
      if(err) throw err;

      console.log('Selected:', chat);

        d=getUTC();

    nsp.emit('message',{message: chat.message,time:timeDifference(d,chat.time),name:chat.from_user});

    });
});

}

else

{
socket.emit('message',{message: data.message,time:'Maximum message size is 100 characters.Message could not be sent',name:'gary'});

}

	});



	socket.on('disconnect', function(){
    console.log('user disconnected');
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

/*function setValue(value) {
  item = value;
  //console.log(item);
  post_item = 1;

}*/
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
  var date =  new Date(Date.UTC(current[0], current[1]-1, current[2],current[3], current[4], current[5]));
return date;
}

 }
