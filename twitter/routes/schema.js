// create new Schema 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/node');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
	id : String,
	name : String,
	body : String,
	date : {type : Date, default : Date.now},
	meta : {
		retweet : Number,
		interest : Number
	}} , { collection : 'tweet'});

var userSchema = new Schema({
	id : { type: String, unique: true},
	name : String,
	pw : String,
	following : [String],
	follower : [String],
	tweet_id : [String]} , { collection : 'users'});


// compile to Model
var Tweet = mongoose.model('Tweet', tweetSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
	Tweet : Tweet,
	User : User
}
// var user1 = new User ({
// 	id : "id1",
// 	name : "bj",
// 	pw : "test"
// });

// var user2 = new User ({
// 	id : "id2",
// 	name : "mj",
// 	pw : "test"
// });

// user1.save(function(err, results){
// 	console.log(results);
// })

// user2.save(function(err, results){
// 	console.log(results);
// })

// var tw1 = new Tweet({
// 	body : "hi this is test tweet"
// });

// tw1.save(function(err, doc){
// 	console.log(" Saved tweet" + doc);
// });

// var query = User.find({});
// query.where('id', "id1");
// query.exec(function(err, doc){
// 	console.log(doc);
// });


// var tweet1 = new Tweet({
// 	body: "hi this is test tweet 2"
// });

// tweet1.author = "xxxxx";
// tweet1.save(function(err, doc){
// 	console.log(" save" + doc);
// 	var query = User.find({}).where('id','id1');
// 	query.exec( function(err,docs){
// 		var query = docs[0].update( { $push : { tweet_id : doc._id}});
// 		query.exec(function(err, results){
// 			console.log(results);
// 		});
// 	});
// });
