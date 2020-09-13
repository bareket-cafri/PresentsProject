'use strict';
var Chat = require('../models/chat');

exports.addMessage = function(username,senderCat, msg, callback) {
	console.log("chat controller");
	console.log("username: "+username+" messgae: "+msg);
	/*db.Chat.insertOne({
		senderNsme: username,
		message: msg,
		date: new Date()
	});*/
	Chat.create({
		senderName: username,
		senderCategory: senderCat,
		message: msg,
		date: new Date()
	}, function(err){
		if(err) {
			console.log("error");
			throw err;
		}
	});
	//res.end();
};

exports.getMessageList = function(callback) {
	console.log("get messages list");
	Chat.find(function(err, messages) {
		//console.log(messages);
		callback(err, messages);
	});
};	

	