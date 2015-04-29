var crypto = require('crypto');
var db = require('mongojs').connect('node', ['users']);
var User = require('../models/schema').User;
var Tweet = require('../models/schema').Tweet;

// crypto password
function hashPW(pwd){
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
};

exports.get_login = function(req, res, next){
	res.render('login' , { layout : false });
};

exports.post_login = function(req, res, next){
	var rid = req.body.id;
	var rpw = req.body.pw;
	if ( rid != "" && rpw != ""){
		var query = User.findOne({});
		query.where('id',rid);
		query.where('pw', hashPW(rpw));
		query.exec( function(err, result){
			if (err) return handleError(err);
			if (result){
				req.session.userId = result.id;
				req.session.name = result.name;
				req.session.cookie.expires = false;
				res.end("yes");	
			} else{
				console.log("데이터가 없습니다.");
				res.end("no");
			}
		});
	};
};


exports.logout = function(req, res, next){
	req.session.destroy(function(err){
		res.redirect('/')
	});	
};

exports.signup = function(req, res, next){
	var query = User.findOne({}).where('id', req.body.id);
		query.exec( function( err, user_doc){
			if (user_doc){
				// This id is alreay used
				res.end("no");
			} else {	
				var new_user = new User({
					id : req.body.id,
					pw : hashPW(req.body.pw),
					name : "test_name"
				});
				new_user.save( function( err, result){
					console.log(" new user saved : " + result);
				});
				res.end("yes");
			}
		});
};

exports.home = function(req,res,next){
	if (req.session.userId == null ){
		res.redirect('/login');
	} else {
		var user_data = {};
		// make array to push users
		var following_user = [req.session.userId];
		var query = User.findOne({}).where('id', req.session.userId);
		query.exec( function( err, user_doc){
			if ( user_doc != null ){
				// save user data
				user_data = user_doc;
				user_data.tweet_number = user_doc.tweet_id.length;
				user_data.follower_number = user_doc.follower.length;
				user_data.following_number = user_doc.following.length;

				// get user and following_user tweets
				for ( i in user_doc.following.toString()){
					var q = user_doc.following[i];
					if ( q != undefined ){
						following_user.push(q);
					}
				}

				Tweet.find()
				.where('id')
				.in(following_user)
				.sort({ date : -1})
				.exec( function(err, records){
					res.render('index', { user : user_data, tweet : records });
				});
			};
		});
	};
};

exports.create = function(req, res, next){
	var new_t = new Tweet({
		body: req.body.tweet
	});
	new_t.id = req.session.userId;
	new_t.name = req.session.name;
	new_t.save(function(err, doc){
		console.log(" save" + doc);
		var query = User.findOne({}).where('id', req.session.userId);
		query.exec( function(err, user_doc){
			var query = user_doc.update( { $push : { tweet_id : doc._id}});
			query.exec(function(err, results){
				console.log(results);
			});
		});
	});
	res.end('saved');
};

exports.userPage = function(req, res, next){
	var user_data = {};
	var user_info = "";
	var tweet = [];
	var query = User.findOne({}).where('id', req.params.id);
	query.exec( function( err, user_doc){
		if ( user_doc != null ){
			user_data = user_doc;
			user_data.tweet_number = user_doc.tweet_id.length;
			user_data.follower_number = user_doc.follower.length;
			user_data.following_number = user_doc.following.length;
			
			if (user_doc.id == req.session.userId){
				user_info = "my id";
			} else if ( user_doc.follower.indexOf(req.session.userId) != -1  ) {
				user_info = "now following"
			} else{
				user_info = "not following"
			}
			Tweet.find()
			.where('id', user_doc.id)
			.sort({ date : -1})
			.exec( function(err, records){
				tweet = records;
				res.render('user_page', { user : user_data ,tweet : tweet,  user_info : user_info.toString() });	
			});

		};
	});
};

exports.editProfile = function(req,res, next){
	var new_name = req.body.new_name;
	console.log("new name is " + new_name);
	var query = User.findOne({}).where('id', req.session.userId);
	query.exec( function(err, user_doc){
		var query = user_doc.update( { $set : { name : new_name }});
		query.exec(function(err, results){
			res.end();
		});
	});
};

exports.unfollow = function(req, res, next){
	var other_id = req.body.id;
	var my_id = req.session.userId;
	var query = User.findOne({}).where('id', my_id);
	query.exec( function(err, user_doc){
		user_doc.following.pull(other_id);
		user_doc.save( function(){
			var query = User.findOne({}).where('id', other_id);
			query.exec( function(err, user_doc){
				user_doc.follower.pull(my_id);
				user_doc.save( function(){
				res.redirect('/' + other_id);
				});
			})
		});
	});
};

exports.follow = function(req, res, next){
	var other_id = req.body.id;
	var my_id = req.session.userId;
	var query = User.findOne({}).where('id', my_id);
	query.exec( function(err, user_doc){
		user_doc.following.push(other_id);
		user_doc.save( function(){
			var query = User.findOne({}).where('id', other_id);
			query.exec( function(err, user_doc){
				user_doc.follower.push(my_id);
				user_doc.save( function(){
				res.redirect('/' + other_id);
				});
			})
		});
	});
};

