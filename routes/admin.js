var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'AuctionIt' });
  next();
});

router.get('/forms', function(req, res, next) {
  res.render('admin/forms', { title: 'AuctionIt' });
});

module.exports = router;