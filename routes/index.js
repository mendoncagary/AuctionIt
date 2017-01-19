var Item = require('../models/item');
var fs = require('fs');

module.exports = function(io) {
  var routes = {};

routes.index = function(req, res){
  res.render('index', {title: 'AuctionIt'});
};

routes.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name, {title: 'AuctionIt'});
};


  function makeid()
  {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
  }

  function getUTC()
  {
    var current = getDateTime().toString().split(/[- :]/);
    var date =  new Date(Date.UTC(current[0], current[1]-1, current[2],current[3], current[4], current[5]));
  return date;
  }


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


    return routes;
};



//var express = require('express');
//var router = express.Router();


        // sample api route
        //router.get('/api/nerds', function(req, res) {
            // use mongoose to get all nerds in the database
            //Nerd.find(function(err, nerds) {

                // if there is an error retrieving, send the error.
                                // nothing after res.send(err) will execute
                //if (err)
                  //  res.send(err);

            //    res.json(nerds); // return all nerds in JSON format
          //  });
        //});

        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)




        //router.get('/partials/:name',function(req,res)
        //{
          //var name = req.params.name;
          //console.log('name');
          //res.render("partials/" +name,{title: 'AuctionIt'});
        //});


        //router.get('*', function(req, res) {
      //    console.log('index');
    //        res.render('index',{title: 'AuctionIt'});
  //      });



//module.exports = router;
