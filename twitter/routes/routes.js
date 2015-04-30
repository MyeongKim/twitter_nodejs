var express = require('express');
var passport = require('passport')
var request = require('request');
var db = require('mongojs').connect('node', ['users']);
var router = express.Router();

var User = require('../app/models/schema').User;
var Tweet = require('../app/models/schema').Tweet;
var users = require('../app/controllers/users');
var tweets = require('../app/controllers/tweets');

router.get('/login', users.get_login);
router.post('/login', users.post_login);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'publish_actions'] } ));
router.get('/auth/facebook/callback', 
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function(req, res) {
		user = req.session.passport.user[1];
		req.session.userId = user.id;
		req.session.name = user.name;
		req.session.cookie.expires = false;
		res.redirect('/');
	});


router.get('/logout', users.logout);
router.post('/signUp', users.signup);
router.get('/', users.home, tweets.getTweet);
router.post('/', tweets.saveTweet, users.updateUserTweet);

router.get('/test', function(req, res, next){
	console.log("req session");
	console.log(req.session);
	console.log("req cokkie");
	console.log(req.cookies);
	// var params = { 
	// 	access_token: req.session.passport.user[0].toString(),
	// 	link : 'http://localhost:3000'
	// 	};
	var params = {
		app_id : 1413723592281387,
		display : 'page',
		link : 'https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.0',
		redirect_uri: 'http://localhost:3000/login'
	};
		
	var headers = { 
	// 'access_token': req.session.passport.user[0].toString(),
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
	// 'Content-Type' : 'application/x-www-form-urlencoded',
	'Authorization': req.session.passport.user[0].toString()
	};

	var form = { message : "test"};
	request.cookie('lu=ThY3FSHoVVQzANjfbiiZnk5g; datr=t1lOVLzDQeGvQE-gwEGzW2iy; locale=ko_KR; p=-2; presence=EM430397693EuserFA21B03483942200A2EstateFDutF0Et2F_5b_5dElm2FnullEuct2F1430397088BEtrFnullEtwF4164019411CEchFDp_5f1B03483942200F0CC; c_user=100003483942200; fr=0qkYMZpSdJjSc8dUW.AWWgn6ddS-QbO5ppWf23ZjjcXxg.BUTlm5.H7.FTa.0.AWXCTzoU; xs=52%3AwZoWXOce9PMurQ%3A2%3A1430390410%3A12604; csm=2; s=Aa4hZ2IyVls1dGV_.BVQgaK; act=1430398606170%2F12');
	request.cookie('connect.sid=s%3Az4S5seNs8w8Fv_HlqnZBVsT4zyHfjwkD.DLN2liGJd6Ffx%2BQViH43s%2Blta3FBBMFxZ4AR8fAaGU0');
	request.get({ url : 'https://www.facebook.com/dialog/feed', headers: headers, qs: params}, function(err, response, body){
		// console.log(body);
		console.log("request cokkie");
		console.log(request.cookie);
		console.log("request session");

		res.send(body);
	});
});

router.get('/:id', users.userPage, tweets.getTweet);
router.post('/edit_profile', users.editProfile);
router.post('/unfollow', users.unfollow);
router.post('/follow', users.follow);


router.get('/i/notifications', function(req,res,next){
	res.render('notification', { user : user });
});

router.get('/i/discover', function(req,res,next){
	res.render('discover', { user : user });
});

module.exports = router;
