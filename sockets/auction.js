var Item = require('../models/item');
var Chat = require('../models/chat');


module.exports = function (io) { // io stuff here...
var currentPrice = 99;

  var auction = io.of('/play/auction');

  auction.on('connection', function (socket) {
    //console.log("A user connected");

    Chat.find({},{} ,{ limit:10, sort:{ _id: -1}},function(err,chat){
    if(err) throw err;
    for(var i in chat)
    {
      d=getUTC();
    auction.emit('message',{message: chat[i].message,time:timeDifference(d,chat[i].time),name:chat[i].from_user});
  }
    });



    auction.emit('priceUpdate',currentPrice);


    socket.on('bid', function (data) {
      console.log(data);
      currentPrice = parseInt(data);
      socket.emit('priceUpdate',currentPrice);
      socket.broadcast.emit('priceUpdate',socket.id + 'bid:'+currentPrice);
    });



    	auction.on('send', function (data) {
            if(data.message!="" && data.message.length<100)
            {
              time = getUTC();
            var chat_message = new Chat({message:data.message,from_user:'gary',time:time});
            chat_message.save(function(err,rows){
            if(err) throw err;
//            console.log('Chat inserted - ID:',rows);

          Chat.findOne({}, {}, { sort: { _id : -1 } }, function(err, chat) {
          if(err) throw err;
            d=getUTC();
        nsp.emit('message',{message: chat.message,time:timeDifference(d,chat.time),name:chat.from_user});
        });
    });
    }
    else
    {
    auction.emit('message',{message: data.message,time:'Maximum message size is 100 characters.Message could not be sent',name:'gary'});
    }
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
