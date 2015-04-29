var Tweet = require('../models/schema').Tweet;

exports.getTweet = function(req, res){
	Tweet.find()
	.where('id')
	.in(req.id)
	.sort({ date : -1})
	.exec( function(err, records){
		req.sender.tweet = records;
	res.render(req.view, req.sender);
	});
};
exports.saveTweet = function(req, res, next){
	var new_t = new Tweet({
		body: req.body.tweet
	});
	new_t.id = req.session.userId;
	new_t.name = req.session.name;
	new_t.save(function(err, doc){
		console.log(" save" + doc);
		req._id = doc._id;
		next();
	});
};
