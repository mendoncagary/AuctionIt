var Item = require('../models/item');
var Chat = require('../models/chat');
var room = require('../routes/index');
var fs = require('fs');

module.exports = function (io) {
var currentPrice = 1000;

  var auction = io.of('/auction');

  auction.on('connection', function (socket) {

        socket.on('join:auction',function(data){
          auction.room = data.id;
          socket.join(auction.room);
          console.log("Client Joined Room:",auction.room);
        });


        //Item.findOne({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}, _id:auction.room} ,function(err,item){
        //if(err) throw err;
        //if(item.length>0)
        //{
        //  for(var i in item)
        //{


      //}
      //}
      //});


    Chat.find({},{} ,{ limit:10, sort:{ _id: -1}},function(err,chat){
    if(err) throw err;
    for(var i in chat)
    {
      d=getUTC();
    socket.emit('message',{message: chat[i].message,time:timeDifference(d,chat[i].time),name:chat[i].from_user});
    }
    });


    socket.to(auction.room).emit('priceUpdate',currentPrice);


    socket.on('bid', function (data) {
      if(data.value == 'but_1')
      {
        var bidvalue = 300;
        currentPrice += 1000 ;
      }
      else if(data.value == 'but_2')
      {
        var bidvalue = 500;
        currentPrice += 1500;
      }
      else if(data.value == 'but_3')
      {
        var bidvalue = 800;
        currentPrice += 2000;
      }

      Item.findOneAndUpdate({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}, _id:auction.room}, { $set: { i_bidvalue: bidvalue} } , function(err,item){
      if(err) throw err;
         auction.in(auction.room).emit('priceUpdate',currentPrice);
      
    });
  });



    	auction.on('send', function (data) {
            if(data.message!="" && data.message.length<100)
            {
              time = getUTC();
            var chat_message = new Chat({message:data.message,from_user:'gary',time:time});
            chat_message.save(function(err,rows){
            if(err) throw err;

          Chat.findOne({}, {}, { sort: { _id : -1 } }, function(err, chat) {
          if(err) throw err;
            d=getUTC();
            auction.emit('message',{message: chat.message,time:timeDifference(d,chat.time),name:chat.from_user});
        });
    });
    }
    else
    {
    socket.emit('message',{message: data.message,time:'Maximum message size is 100 characters.Message could not be sent',name:'gary'});
    }
    	});


    socket.on('disconnect',function(){
      socket.leave(auction.room);
      console.log("User disconnected");
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
