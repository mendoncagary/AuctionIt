var express = require('express');
var router = express.Router();
var db=require('../config/database');
var fs=require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('join', { title: 'AuctionIt' });
});

router.get('/auction/:id', function(req, res) {
    var id = req.params.id;
  //  var token = req.body.token;


  db.query('SELECT * FROM items WHERE i_id = ? LIMIT 1',[id],function(err,rows){
  if(err) throw err;
  //  setValue(rows);
  if(rows.length>0)
  {

    for(var i in rows)
  {
  //  console.log(i);
  //  console.log('Selected:', rows[i].i_name);
  var buf = fs.readFileSync('uploads/'+rows[i].i_imgpath);
    // it's possible to embed binary data
    // within arbitrarily-complex objects
    //if(err) throw err;

    buffer = buf;
    img = true;
    item_id=rows[i].i_id;
    item_name=rows[i].i_name;
    item_desc=rows[i].i_desc;
    item_baseprice=rows[i].i_baseprice;
    item_image=buffer.toString('base64');
    console.log(item_name);

  //console.log(rows[i].i_name);
  //console.log(rows[i].i_desc);
  //nsp.emit('item',{item_id: rows[i].i_id, item_name: rows[i].i_name, item_desc: rows[i].i_desc, item_price: rows[i].i_baseprice, image: img, item_image: buffer.toString('base64')});
  img=false;
  res.render('play', { title: 'AuctionIt',item_id:id,item_name:item_name,item_baseprice:item_baseprice, item_image:item_image,item_desc:item_desc });
  //console.log(rows[i].i_imgpath+'image file is initialized');
  //  io.sockets.emit('item',rows[i].i_name);
  }
  }

    });



});


module.exports = router;
