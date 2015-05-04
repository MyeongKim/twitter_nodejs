var User = require('../../app/models/schema').User;
var FacebookStrategy = require('passport-facebook').Strategy;

/**
 * Expose
 */

 module.exports = new FacebookStrategy({
 	clientID: 1413723592281387,
 	clientSecret: 'a0d79c11481d32de7304cd67f3da8c9a',
 	callbackURL: "/auth/facebook/callback"
 },
 function(accessToken, refreshToken, profile, done) {
 	var token = accessToken;
 	User.findOne({ id: profile.emails[0].value.split("@")[0] }, function(err, user) {
 		if(err) { console.log(err); }
 		if (!err && user != null) {
 			data = [token, user];
 			done(null, data);
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

 					data = [token, user];
 					done(null, data);

 				};
 			});
 		};
 	});
 }
 );