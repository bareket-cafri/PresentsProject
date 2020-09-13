'use strict';
var Food=require('../models/food');
var fs = require("fs");

exports.start=function () {
	console.log("start2 begin")
	Food.create({
		id: 5,
		name: "פיצה ביאנקה",
		description: "פיצה עם שמנת וגבינת מוצרלה, עגבניות וצנוברים",
		kind: "pizza", //pizza ,drink
		cost: 55,
		path: "images/bianka.jpg",
		isMivza: 0,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Food.create({
		id: 6,
		name: "בקבוק קולה חצי ליטר",
		description: "",
		kind: "drink", //pizza ,drink
		cost: 7,
		path: "images/colaL.jpg",
		isMivza: 0,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Food.create({
		id: 7,
		name: "מלאווח פיצה",
		description: "",
		kind: "pizza", //pizza ,drink
		cost: 38,
		path: "images/melauachPizza.jpg",
		isMivza: 0,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Food.create({
		id: 8,
		name: "פיצה מרגריטה",
		description: "פיצה דקיקה עם עלי בזיליקום וגבינת פרמזן",
		kind: "pizza", //pizza ,drink
		cost: 50,
		path: "images/margarita.jpg",
		isMivza: 1,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Food.create({
		id: 9,
		name: "פחית קוקה קולה",
		description: "",
		kind: "drink", //pizza ,drink
		cost: 5,
		path: "images/colaP.jpg",
		isMivza: 0,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Food.create({
		id: 10,
		name: "פחית ספרייט",
		description: "",
		kind: "drink", //pizza ,drink
		cost: 5,
		path: "images/spraitP.jpg",
		isMivza: 0,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Food.create({
		id: 10,
		name: "פיוזטי גדול",
		description: "",
		kind: "drink", //pizza ,drink
		cost: 9,
		path: "images/fuze1.jpg",
		isMivza: 0,//1 miv 0 not
		isActive: true
	}, function(err){ if(err) throw err; }
	);
};

exports.getFoodList=function(callback) {
	console.log("get food list");
	Food.find(function(err, food) {
		//console.log(food);
		callback(err, food);
	});
};

exports.getItemById=function(req, callback) {
	console.log("getgetFoodById");
	Food.findOne({ id: req.params.itemId }, function (err, item){
		callback(err,item);
	});
};

exports.removeFood=function(idFood, callback) {
	console.log("route removeFood");
	Food.updateOne(
		{id: idFood},
		{$set: {isActive: false}}
	, function(err, food) {
		if(err)
			throw err;
		callback(err, food);
	});
};

//add food
exports.addFood = function(req, res){
	console.log("add flower begin");
	console.log("req.body");
	console.log(req.body);
	
	//var lengthFlower = 0;
	Food.find( function(err, food) {
		if(err){
		    console.log("err find");
			throw err;
			}
		var newId;
		if(food.length == 0)
			newId = 0;
		else 
			newId = food[food.length - 1].id + 1;
		console.log(newId);
		Food.create({
			id: newId,
			name: req.body.name,
			description: req.body.description,
			kind: req.body.kind, //pizza =0 ,drink = 1
			cost: req.body.cost,
			path: req.body.path,
			isMivza: req.body.isMiv,
			isActive: 1
			}, function(err){
				if(err){ 
					console.log("errrr");
					throw err;
				}
			}
		);
		
	});
	
	res.end();
};








