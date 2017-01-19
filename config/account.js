var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var Tek_user = require('../models/tek_user');


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.userid);
    });

    passport.deserializeUser(function(userid, done) {
        Tek_user.find({user_id: userid}, function(err, rows){
            done(err, rows[0]);
        });
    });



    passport.use(
        'user-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'userid',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, userid, password, done) {
          // callback with email and password from our form
            Tek_user.find({user_id: userid}, function(err, rows){
              if (err)
                  return done(err);
              if (!rows.length) {
                  return done(null, false); // req.flash is the way to set flashdata using connect-flash
              }

              // if the user is found but the password is wrong
              if (password != rows[0].password)
                  return done(null, false); // create the loginMessage and save it to session as flashdata

              // all is well, return successful user
              return done(null, rows[0]);
          });
        })
    );
};
