var express = require('express');
var db = require('mongojs').connect('node', ['users']);
var router = express.Router();

var User = require('../app/models/schema').User;
var Tweet = require('../app/models/schema').Tweet;
var users = require('../app/controllers/users');

router.get('/login', users.get_login);
router.post('/login', users.post_login);
router.get('/logout', users.logout);
router.post('/signUp', users.signup);
router.get('/', users.home);
router.post('/', users.create);
router.get('/:id', users.userPage);
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
