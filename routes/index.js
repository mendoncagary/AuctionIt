module.exports = function(io) {
  var routes = {};

routes.index = function(req, res){
  res.render('index', {title: 'AuctionIt'});
};


routes.auction = function (req, res) {
  var id = req.params.id;
  console.log(id);
res.render('index', {title: 'AuctionIt'});
}


routes.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name, {title: 'AuctionIt'});


  var auction = io.of('/play/auction');

    auction.emit('payload');
};


//routes.auction = function (req, res) {
  //var name = req.params.name;
  //res.render('partials/' + name, {title: 'AuctionIt'});
//};



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
