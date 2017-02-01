var Item = require('../models/item');
var User = require('../models/user');
var fs = require('fs');

module.exports = function (io) {

  var profile = io.of('/profile');



    profile.on('connection',function(socket){





      socket.on('sell:item',function(item){
      if(item.duration =='time_1')
      {
        duration = 20;
        valid =true;
      }
      else if(item.duration =='time_2')
      {
        duration = 30;
        valid =true;
      }
      else if(item.duration =='time_3')
      {
        duration = 40;
        valid =true;
      }


      var id=item.id;


      if(valid)
      {
      if(id.match(/^[0-9a-fA-F]{24}$/))
      {
        var date = getUTC();
        var dateMillis = date.getTime();
        var timePeriod = "00:15:00";
        var parts = timePeriod.split(/:/);
        var timePeriodMillis = (parseInt(parts[0], 10) * 60 * 60 * 1000) +
                                (parseInt(parts[1], 10) * 60 * 1000) +
                                (parseInt(parts[2], 10) * 1000);
        var startDate = new Date();
        startDate.setTime(dateMillis + timePeriodMillis);
        var endtimeduration = 15+duration;
        timePeriod = "00:"+endtimeduration+":00";
        parts = timePeriod.split(/:/);
        timePeriodMillis= (parseInt(parts[0], 10) * 60 * 60 * 1000) +
                                (parseInt(parts[1], 10) * 60 * 1000) +
                                (parseInt(parts[2], 10) * 1000);

        var endDate = new Date();
        endDate.setTime(dateMillis+timePeriodMillis);

      Item.findOneAndUpdate({_id : item.id, i_is_won: true,'bid.user_id': socket.request.user.username},{$set:{i_starttime:startDate,i_endtime:endDate,i_is_won:false,bid:null}},function(err,item){
      if(err) throw err;
      if(item)
      {
          if(duration==20) cost = 10*item.i_baseprice/100;
          else if(duration==30) cost = 20*item.i_baseprice/100;
          else if(duration==40){
            cost = 30*item.i_baseprice/100;
          }
      User.findOne({tek_userid:socket.request.user.username},function(err,user){
        if(err) throw err;
        if(user)
        {
        var cashbalance = user.u_cashbalance;
        var cashbalance = cashbalance - cost;
        User.update({tek_userid:socket.request.user.username},{$set:{u_cashbalance:cashbalance},$inc:{u_itemssold:1}},{new: true}, function(err,user){
          if(err) throw err;
        });
        }
      });
      }
      });
      socket.emit('profile:response',{message: "Auction successfully placed. Your auction will start in 15 minutes."});
    }
    }
    else{
      socket.emit('profile:response',{message: "There was an error placing your auction. Please try again."});
    }

    });


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
