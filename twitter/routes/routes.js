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
