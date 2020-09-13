var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chat = new Schema ({
	id: Number, 
	senderName: String,
	senderCategory: String,
	message: String,
	date: Date
});

//ngoose.connect('mongodb://localHost:27017/pizzaChat');
module.exports = mongoose.model('Chat', Chat);