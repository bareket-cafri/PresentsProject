// ORDER MODEL (SCHEMA)

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
	id: Number,
    client: { id: Number, name: String, tel: String, isActive: Boolean },
    deliver: { id: Number, name: String, tel: String ,isActive: Boolean },
	statusO: Number, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
	address: String,
	hour: String,
	cost: Number,
	items: [{name: String, cost: Number}],
	isActive: Boolean
});

//mongoose.connect('mongodb://localHost:27017/targil5_db');
module.exports = mongoose.model('Order', Order);