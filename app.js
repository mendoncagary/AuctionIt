var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var db = require('./config/db');
var api = require('./routes/api');
var admin = require('./routes/admin');


var app = express();

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);


mongoose.connect(db.url);




app.use(session({
	key: 'express.sid',
	secret: '4n4l29pdsmf93p96j4dlm323jdic',
	resave: true,
	saveUninitialized: true,
	cookie: { 
		httpOnly: true
						},
	store: new MongoStore({ mongooseConnection: mongoose.connection })
 } ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/account')(passport);


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}



var socket_io    = require( "socket.io");
var passportSocketIo = require('passport.socketio');
var io           = socket_io();
app.io           = io;


var routes = require('./routes/index')(io);
require('./sockets/base')(io);
require('./sockets/auction')(io);
require('./sockets/wof')(io);
require('./sockets/profile')(io);

io.use(passportSocketIo.authorize({
  key: 'express.sid',
  secret: '4n4l29pdsmf93p96j4dlm323jdic',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
	ttl: 1 * 24 * 60 * 60,
	autoRemove: 'interval',
	autoRemoveInterval: 180,
  passport: passport,
  cookieParser: cookieParser
}));


io.on('connection', function(socket) {

  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin',admin);
app.get('/', isLoggedIn, routes.index);
app.get('/login', function(req, res){
  res.render('login', {title: 'AuctionIt', message: req.flash('loginMessage') });
 });

app.get('/partials/:name', isLoggedIn, routes.partials);

app.get('/api/item/:id', isLoggedIn, api.item);
app.get('/api/profile', isLoggedIn, api.profile);
app.get('/api/itemswon', isLoggedIn, api.itemswon);


app.get('/logout', function(req, res) {
  req.logout();
	req.session.destroy(function() {
		res.send("Session Destroyed");
});
});

app.get('*',isLoggedIn,  routes.index);

  app.post('/login', passport.authenticate('user-login', {
              successRedirect : '/',
							failureRedirect : '/login',
              failureFlash : true
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



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
