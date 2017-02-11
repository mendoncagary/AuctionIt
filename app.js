var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var helmet = require('helmet');
var mongoose = require('mongoose');
var db = require('./config/db');
var api = require('./routes/api');
var admin = require('./routes/admin');
var Tek_user = require('./models/tek_user');
var User = require('./models/user');

var app = express();
app.use(helmet({
  frameguard: false
}));

//var flash = require('connect-flash');
var session = require('client-sessions');
var cookie = require('cookie');

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } , auto_reconnect: true,reconnectTries: Number.MAX_VALUE,reconnectInterval: 1000 },
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mongoose.connect(db.url,options);
mongoose.connection.on('error', function(error){
	console.error.bind(console, 'MongoDB connection error:');
	mongoose.disconnect();
});

mongoose.connection.on('disconnected', function() {
	console.log('MongoDB disconnected!');
	mongoose.connect(db.url,options);
});


//app.use(flash());



var socket_io    = require( "socket.io");
var io           = socket_io();
app.io           = io;

var sessionMiddleware = session({
	cookieName: 'sess',
	secret: '134klh389dbcbsldvn1mcbj',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true,
	//secure: true,
	ephemeral: true
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);



function isLoggedIn(req, res, next) {
	if (!req.sess.username) {
		//res.redirect('/login');
		res.redirect('http://teknack.in');
	} else {
		next();
	}
};




var routes = require('./routes/index')(io);
require('./sockets/base')(io);
require('./sockets/auction')(io);
require('./sockets/wof')(io);
require('./sockets/profile')(io);
require('./sockets/quiz')(io);


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


io.on('connection', function(socket) {

});


app.use('/admin',admin);


app.use(function(req, res, next) {
	if (req.sess && req.sess.username) {
	//	User.findOne({ tek_userid : req.sess.username }, function(err, user) {
		//	if (user) {
				//req.user = user;
				//delete req.user.password; // delete the password from the session
				//req.session.user = user;  //refresh the session value
				//res.locals.user = user;
			//}
			// finishing processing the middleware and run the route
			next();
	//	});
	} else {
		next();
	}
});



app.get('/', isLoggedIn, routes.index);
app.get('/login', function(req, res){
	if(!req.sess.username)
	{
		res.render('login', {title: 'AuctionIt' });
	}
	else{
		res.redirect('/');
	}
});

app.get('/partials/:name', isLoggedIn, routes.partials);
app.get('/api/item/:id', isLoggedIn, api.item);
app.get('/api/profile', isLoggedIn, api.profile);
app.get('/api/itemswon', isLoggedIn, api.itemswon);
app.get('/api/leaderboard', isLoggedIn, api.leaderboard);
app.put('/api/rating', isLoggedIn, api.rating);
app.get('/api/rating', isLoggedIn, api.rating_get);
app.get('/api/badges', isLoggedIn, api.badges);


app.get('/logout', function(req, res) {
	req.sess.reset();
	res.redirect('/');
});

app.get('*',isLoggedIn,  routes.index);

app.post('/login', function(req, res) {
	Tek_user.findOne({ username: req.body.username }, function(err, user) {
		if (!user) {
			res.render('login', { error: 'Invalid email or password.' });
		} else {
			if (req.body.password === user.password) {
				req.sess.username = user.username;
				res.redirect('/');
			} else {
				res.render('login', { error: 'Invalid email or password.' });
			}
		}
	});
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
