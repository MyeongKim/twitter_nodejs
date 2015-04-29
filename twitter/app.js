var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/routes');

var app = express();

var User = require('./app/models/schema').User;
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new FacebookStrategy({
	clientID: 1413723592281387,
	clientSecret: 'a0d79c11481d32de7304cd67f3da8c9a',
	callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
	User.findOne({ id: profile.id }, function(err, user) {
	 if(err) { console.log(err); }
	 if (!err && user != null) {
		 done(null, user);
	 } else {
		 var user = new User({
			 id: profile.emails[0].value.split("@")[0],
			 name: profile.displayName
		 });
		 user.save(function(err) {
			 if(err) {
				 console.log(err);
			 } else {
				 console.log("saving user ...");
				 done(null, user);
			 };
		 });
	 };
 });
}
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
// use passport session

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
