var cron = require('node-cron');
var fs = require('fs');
var Item = require('../models/item');
var Chat = require('../models/chat');


module.exports = function (io) { // io stuff here...

var currentPrice = 99;
var datetime;
var item = [];
var post_item = 0;
var buffer;
var img = false;

var nsp = io.of('/play');

nsp.on('connection', function (socket,item) {



  cron.schedule('*/1 * * * *', function(){
    Item.find({i_starttime : getUTC()}, function(err,item){
    if(err) throw err;
   if(item.length>0)
    {
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

      Item.find({i_endtime :getUTC()}, function(err,item){
      if(err) throw err;
      if(item.length>0)
      nsp.emit('end',true);
      });
    console.log('running a task every one minute');
  });





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
