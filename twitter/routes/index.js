var express = require('express');
var db = require('mongojs').connect('node', ['users']);
var router = express.Router();

var user = {};

function userSet(data){
	db.users.find( {id : data.id }, function(error, data){
			user.name = data[0].name,
			user.id = data[0].id,
			user.tweets= data[0].tweets,
			user.following = data[0].following, 
			user.follower = data[0].follower
			console.log(" 로그인 성공");
		});
};

router.get('/login', function(req,res,next){
	res.render('login' , { layout : false });
});

router.post('/login', function(req,res,next){
	var rid = req.body.id;
	var rpw = req.body.pw;
	if ( rid != "" && rpw != ""){
		db.users.find( { id : rid , pw : rpw }, function(error, loginData) {
			if (loginData[0] == null ) {
				console.log("데이터가 없습니다.");
				res.end("no");
			} else {
				req.session.userId = rid;
				req.session.cookie.expires = false;
				userSet(loginData[0]);
				res.end("yes");	

			}
		});
	}
});

router.get('/logout', function(req,res,next){
	req.session.destroy(function(err){
		res.redirect('/')
	});
});

// 홈
router.get('/', function(req, res, next) {
	if (req.session.userId == null ){
		res.redirect('/login');
	} else {
		res.render('index', { user : user });
	}
});

router.get('/data', function(req,res,next){
	db.users.find( function(error, data){
		res.send(data);
	});
})

router.post('/', function(req, res, next){
	db.users.update({ id : user.id},
	{ $inc: { tweets: 1 }}
	);
	db.users.update({ id : user.id},
	{ $push: { tweet_message : [ req.body.tweet, new Date() ]}}
	);
	res.end('saved');
});
// 개인 페이지
router.get('/:id', function(req,res,next){
	res.render('user_page', { user : user });	
});

// 알림
router.get('/i/notifications', function(req,res,next){
	res.render('notification', { user : user });
});

// 쪽지
// 다얄로그

// 발견하기
router.get('/i/discover', function(req,res,next){
	res.render('discover', { user : user });
});

module.exports = router;
