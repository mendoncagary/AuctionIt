var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var Admin = require('../models/admin');


module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });


    passport.deserializeUser(function(username, done) {
        Admin.find({username: username}, function(err, rows){
            done(err, rows[0]);
        });
    });


    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
          // callback with email and password from our form
            Admin.find({username: username}, function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'Wrong username or password.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (password != rows[0].password)
                    return done(null, false, req.flash('loginMessage', 'Wrong username or password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
