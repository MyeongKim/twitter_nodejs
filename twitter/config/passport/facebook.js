var User = require('../app/models/schema').User;
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
	clientID: 1413723592281387,
	clientSecret: 'a0d79c11481d32de7304cd67f3da8c9a',
	callbackURL: "/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
	console.log(profile.id);
	process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
	// User.findOne({ id: profile.id }, function(err, user) {
	// 	if(err) { console.log(err); }
	// 	if (!err && user != null) {
	// 		done(null, user);
	// 	} else {
	// 		var user = new User({
	// 			id: profile.id,
	// 			name: profile.displayName
	// 		});
	// 		user.save(function(err) {
	// 			if(err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log("saving user ...");
	// 				done(null, user);
	// 			};
	// 		});
	// 	};
	// });
}
));