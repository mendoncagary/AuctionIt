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


var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
require('./config/account')(passport);


var app = express();

app.use(session({
	secret: '4n4l29pdsmf93p96j4dlm323jdic',
	resave: true,
	saveUninitialized: true
 } ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}



var socket_io    = require( "socket.io" );
var app          = express();
var io           = socket_io();
app.io           = io;


var routes = require('./routes/index')(io);
require('./sockets/base')(io);
require('./sockets/auction')(io);


io.on('connection', function(socket) {

  });

// view engine setup
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



mongoose.connect(db.url);


app.use('/admin',admin);
app.get('/',isLoggedIn, routes.index);
app.get('/login', function(req, res){
  res.render('login', {title: 'AuctionIt', message: 'Login invalid' });
 });
app.get('/partials/:name', isLoggedIn, routes.partials);

app.get('/api/item/:id', isLoggedIn, api.item);

app.get('*', isLoggedIn, routes.index);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

  app.post('/login', passport.authenticate('user-login', {
              successRedirect : '/', // redirect to the secure profile section
              failureRedirect : '/login', // redirect back to the signup page if there is an error
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


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
