var express = require('express');
var session = require('express-session');
var router = express.Router();
var passport = require('passport');
var flash    = require('connect-flash');

require('../config/passport')(passport);

// required for passport
router.use(session({
	secret: '4n4l29pdsmf93p96j4dlm323jdic',
	resave: true,
	saveUninitialized: true
 } )); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session


/* GET home page. */
router.get('/',  isLoggedIn,  function(req, res) {
  res.render('admin/index', { title: 'AuctionIt | Admin' });
});

router.get('/forms', isLoggedIn, function(req, res) {
  res.render('admin/forms', { title: 'AuctionIt | Admin' });
});

router.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('admin/login', { title: 'AuctionIt | Admin', message: req.flash('loginMessage') });
	});

  router.post('/login', passport.authenticate('local-login', {
              successRedirect : '/admin', // redirect to the secure profile section
              failureRedirect : '/admin/login', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
  		}),
          function(req, res) {
              console.log("hello");

              if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
              } else {
                req.session.cookie.expires = false;
              }
          res.redirect('/');
      });



  	// =====================================
  	// PROFILE SECTION =========================
  	// =====================================
  	// we will want this protected so you have to be logged in to visit
  	// we will use route middleware to verify this (the isLoggedIn function)
  	router.get('/profile', isLoggedIn, function(req, res) {
  		res.render('profile.ejs', {
  			user : req.user // get the user out of session and pass to template
  		});
  	});

  	// =====================================
  	// LOGOUT ==============================
  	// =====================================
  	router.get('/logout', function(req, res) {
  		req.logout();
  		res.redirect('/admin');
  	});


  // route middleware to make sure
  function isLoggedIn(req, res, next) {

  	// if user is authenticated in the session, carry on
  	if (req.isAuthenticated())
  		return next();

  	// if they aren't redirect them to the home page
  	res.redirect('/admin/login');
  }
module.exports = router;
