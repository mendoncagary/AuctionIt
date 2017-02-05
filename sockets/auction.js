var User = require('../models/user');
var Item = require('../models/item');
var fs = require('fs');

module.exports = function (io) {

  var auction = io.of('/auction');

  auction.on('connection', function (socket) {


    socket.on('join:auction',function(data){
      var id = data.id;
      if(id.match(/^[0-9a-fA-F]{24}$/))
      {
        auction.room = id;
        socket.join(auction.room);

        Item.findOne({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()},_id: auction.room} ,function(err,item){
          if(err) throw err;
          if(item)
          {
            current_item =  item.i_name;
            baseprice = item.i_baseprice;
            increment = item.i_increment;
            currentPrice = item.i_currentprice;
            socket.emit('currentPrice',currentPrice);
            if(item.bid.length>0)
            {
              for(var i in item.bid)
              {
                username = item.bid[i].first_name;
                bid_value = item.bid[i].value;
                socket.emit('priceUpdate',{bid_value: bid_value,username: username});
              }
            }
            else {
              username = "No User has placed bid";
              socket.emit('priceUpdate',{bid_value: 0, username: username});
            }

          }
        });
      }



      socket.on('bid', function (data) {

        User.findOne({tek_userid: req.session.user.username},function(err,user){
          if(err) throw err;
          if(user)
          {
            user_cashbal = user.u_cashbalance;

            c_user = req.session.user.username;
            if(data.value == 'but_1')
            {
              var bidvalue = baseprice;
              currentPrice += bidvalue;
            }
            else if(data.value == 'but_2')
            {
              var bidvalue = baseprice + increment;
              currentPrice += bidvalue;
            }
            else if(data.value == 'but_3')
            {
              var bidvalue = baseprice + (2*increment);
              currentPrice += bidvalue;
            }
            Item.findOne({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}, i_is_won: false, _id:data.id},function(err,row){
              if(err) throw err;
              if(row)
              {
                if(row.i_owner !== c_user && user_cashbal >=currentPrice)
                {
                  var bid = { value: currentPrice, user_id: req.session.user.username,first_name: socket.request.user.first_name};

                  Item.findOneAndUpdate({i_starttime:{ $lt: getUTC()},i_endtime:{$gt:getUTC()}, i_is_won: false, _id:data.id}, { $set: { i_bidvalue: bidvalue,i_currentprice: currentPrice}, $push:{bid : bid}} ,{new: true}, function(err,item){
                    if(err) throw err;
                    if(item.bid.length>0)
                    {
                      var size = item.bid.length;
                      auction.in(data.id).emit('priceUpdate',{bid_value:currentPrice,username: item.bid[size-1].first_name});
                      auction.in(data.id).emit('currentPrice',currentPrice);
                    }

                  });
                }
                else if(user_cashbal < currentPrice){
                  socket.emit('flash:auction',{message:"You don't have enough cash to place a bid."});
                }
                else if(row.i_owner == c_user){
                  socket.emit('flash:auction',{message:"You cannot bid on your own assets"});
                }

              }
            });
          }
        });
      });


      socket.on('disconnect',function(){
        socket.leave(auction.room);
        console.log("auction disconnected");
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
