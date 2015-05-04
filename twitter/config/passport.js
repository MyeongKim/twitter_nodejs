/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
// var LocalStrategy = require('passport-local').Strategy;

// var local = require('./passport/local');
// var google = require('./passport/google');
var facebook = require('./passport/facebook');
var twitter = require('./passport/twitter');
// var linkedin = require('./passport/linkedin');
// var github = require('./passport/github');

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize sessions
passport.serializeUser(function(data, done) {
  done(null, data);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
  // use these strategies
  // passport.use(local);
  // passport.use(google);
  passport.use(facebook);
  // passport.use(twitter);
  // passport.use(linkedin);
  // passport.use(github);
};