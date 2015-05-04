var User = require('../../app/models/schema').User;
var TwitterStrategy = require('passport-twitter').Strategy;

/**
 * Expose
 */

module.exports = new TwitterStrategy({
		consumerKey: 'iLE5MMmOwR90BlejYeyeUtxRT',
		consumerSecret: 'CMfbxk0mPeK9fz3omhqpbwrHFCeRq98dLkDuV4ftYy0Mahuthr',
		callbackURL: "/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		var token = token;
		User.findOne({ id: profile.username }, function(err, user) {
			if(err) { console.log(err); }
			if (!err && user != null) {
				data = [token, user];
				done(null, data);
			} else {
				var user = new User({
					id: profile.username,
					name: profile.username
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