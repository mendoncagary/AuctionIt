var Item = require('../models/item');
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
      console.log(item[i].i_increment);


    res.json({
      item_name: item[i].i_name,
      item_price: item[i].i_baseprice,
      item_desc: item[i].i_desc,
      image: img,
      item_image: buffer.toString('base64'),
      item_bid: item[i].i_bidvalue,
      curBidValue1 : curBidValue1,
      curBidValue2 : curBidValue2,
      curBidValue3 : curBidValue3
    });
    img = false;
    }
  }
});
}

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
