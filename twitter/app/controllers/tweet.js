var db = require('mongojs').connect('node', ['users']);
var Tweet = require('../app/models/schema').Tweet;