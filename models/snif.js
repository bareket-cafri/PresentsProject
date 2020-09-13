// SNIF MODEL (SCHEMA)

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Snif = new Schema({
    numBranch: Number,
	name: String,
	city: String,
	tel: String,
	isActive: Boolean,
});

module.exports = mongoose.model('Snif', Snif);