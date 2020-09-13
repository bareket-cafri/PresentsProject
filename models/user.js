// USER MODEL (SCHEMA)

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	id: Number,
    name: String,
	category: String, //0 client, 1 worker, 2 deliver
	pass: {type: String, required: true},
	email: {type: String, required: true},
	tel: String,
	address: String,
	isActive: Boolean
});

module.exports = mongoose.model('User', User);