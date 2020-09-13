// FOOD MODEL (SCHEMA)

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Food = new Schema({
	id: Number,
	name: String,
	description: String,
	kind: String, //pizza ,drink
	cost: Number,
    path: String,
	isMivza: String,//1 miv 0 not
    isActive: Boolean
});
mongoose.connect('mongodb://localHost:27017/targil5_db', { useUnifiedTopology: true, useNewUrlParser: true });
//mongoose.connect('mongodb://localHost:27017/targil5_db');

module.exports = mongoose.model('Food', Food);