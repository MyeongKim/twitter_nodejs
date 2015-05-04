var User = require('../../app/models/schema').User;
var GoogleStrategy = require('passport-google').Strategy;

 module.exports = new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000'
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