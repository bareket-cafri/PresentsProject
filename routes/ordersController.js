'use strict';
var Order=require('../models/order');
var fs = require("fs");

exports.start=function () {
	console.log("start2 begin")
	Order.create({
		id: 0,
		client: { id: 1, name: 'ורדה שמעון', tel: '0502178454' },
		deliver: { id: 5, name: 'עדי לוי', tel: '0504566789' },
		statusO: 1, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
		address: 'הרימון 18',
		hour: '12:40',
		cost: 78,
		items: [{ name: 'פיצה נאפולי', cost: 59},{ name: 'פיצה אישית',cost: 17}],
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Order.create({
		id: 1,
		client: { id: 3, name: 'אורי גולד', tel: '0502179999' },
		deliver: { id: 5, name: 'עדי לוי', tel: '0504566789' },
		statusO: 2, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
		address: 'הנרקיס 5',
		hour: '13:40',
		cost: 45,
		items: [{name: 'פיצה נאפולי',cost: 59}],
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Order.create({
		id: 2,
		client: { id: 6, name: 'גיל חורש', tel: '0502179994' },
		deliver: { id: 2, name: 'רונן שחר', tel: '0504568789' },
		statusO: 0, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
		address: 'הרימון 18',
		hour: '12:40',
		cost: 0,
		items: [],
		isActive: true
	}, function(err){ if(err) throw err; }
	);
	Order.create({
		id: 3,
		client: { id: 1, name: 'ורדה שמעון', tel: '0502178454' },
		deliver: { id: 5, name: 'עדי לוי', tel: '0504566789' },
		statusO: 1, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
		address: 'הרימון 18',
		hour: '12:40',
		cost: 67,
		items: [{ name: 'פיצה נאפולי', cost: 59},{ name: 'בקבוק קוקה קולה גדול',cost: 8}],
		isActive: true
	}, function(err){ if(err) throw err; }
	);
};
exports.addOrder= function(req, res, connectUser, callback) {
	Order.find( function(err, orders) {
		var newId;
		if(orders.length == 0)
			newId = 0;
		else 
			newId = orders[orders.length - 1].id + 1;
		Order.create({
			id: newId,
			client: { id: connectUser.id, name: connectUser.name, tel: connectUser.tel, isActive: connectUser.isActive },
			//client: { id: 10, name: "ff", tel: "333" },
			deliver: { id: '-1', name: '', tel: '' ,isActive:'true' },
			statusO: 0, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
			address: req.address,
			hour: req.hour,
			cost: req.cost,
			items: req.items,
			isActive: true
		}, function(err){ if(err) throw err; }
		);
	
	});
	res.end();
};


exports.getOrderList=function(callback) {
	console.log("get order list");
	Order.find(function(err, order) {
		//console.log(food);
		callback(err, order);
	});
};

exports.removeOrder=function(idOrder, callback) {
	console.log("route removeFood");
	Order.updateOne(
		{id: idOrder},
		{$set: {isActive: false, statusO: 5}}
	, function(err, order) {
		if(err)
			throw err;
		callback(err, order);
	});
};

exports.rejectOrder=function(idOrder, callback) {
	console.log("route removeFood");
	Order.updateOne(
		{id: idOrder},
		{$set: {isActive: false, statusO: -1}}
	, function(err, order) {
		if(err)
			throw err;
		callback(err, order);
	});
};

exports.changeDeliverToOrder = function(idOrder, newDeliver, callback) {
	console.log("route changeDeliverToOrder");
	console.log(idOrder);
	var deliver1= { id: newDeliver.id, name: newDeliver.name, tel: newDeliver.tel, isActive: newDeliver.isActive };
	Order.updateOne(
			{id: idOrder},
			{$set: { deliver: deliver1 }}
			, function(err, order) {
			if(err)
				throw err;
			callback(err);
		});
};

exports.changeOrderStatus = function(idOrder, callback) {
	console.log("route changeOrderStatus");
	Order.findOne({ id: idOrder }, function (err1, order){
		if(err1)
			throw err1;
		var statusOld = order.statusO;
		if( statusOld < 4 ){
			Order.updateOne(
				{id: idOrder},
				{$set: {statusO: statusOld + 1}}
			, function(err, order) {
				if(err)
					throw err;
				callback(err, order);
			});
		} else {
			Order.updateOne(
				{id: idOrder},
				{$set: {isActive: false}}
			, function(err, order) {
				if(err)
					throw err;
				callback(err, order);
			});
		}
	});
	
};

exports.getOrdersByClientId = function(userId, callback) {
	console.log("route getOrdersByClientId");
	console.log(userId);
	
	Order.find(function(err, orders) {
		var clientOrders = [];
		for(var i=0; i<orders.length; i++){
			if (orders[i].client.id == userId) {
				clientOrders[clientOrders.length] = orders[i];
			}	
		}
		//console.log(clientOrders);
		callback(err, clientOrders);
	});
	
	/*Order.find({ client :{ $elemMatch: { id: userId }}}, function (err1, orders){
		if(err1){
			console.log("error");
			throw err1;
		}
		console.log(orders);
		callback(err1, orders);
	});*/
	
};

exports.getOrdersByDeliverId = function(userId, callback) {
	console.log("route getOrdersByDeliverId");
	console.log(userId);
	
	Order.find(function(err, orders) {
		var deliverOrders = [];
		for(var i=0; i<orders.length; i++){
			if (orders[i].deliver.id == userId) {
				deliverOrders[deliverOrders.length] = orders[i];
			}	
		}
		console.log(deliverOrders);
		callback(err, deliverOrders);
	});	
};

//add flower
exports.addOrder = function(req, res, connectUser){
	console.log("add flower begin");
	console.log("req.body");
	console.log(req.items);
	
	//var lengthFlower = 0;
	Order.find( function(err, order) {
		if(err){
		    console.log("err find");
			throw err;
			}
		var newId;
		if(order.length == 0)
			newId = 0;
		else 
			newId = order[order.length - 1].id + 1;
		console.log(req.cost)
		console.log(newId);
		
			Order.create({
				id: newId,
				client: { id: connectUser.id, name: connectUser.name, tel: connectUser.tel , isActive: connectUser.isActive},
				deliver: { id: -1, name: '', tel: '', isActive: 'true' },
				statusO: 0, //0 inital, 1 orderOK, 2 making, 3 way, 4 recive
				address: req.address,
				hour: req.hour,
				cost: req.cost,
				items: req.items,
				isActive: true
			}, function(err){ if(err) throw err; }
			);
		
	});
	res.end();
};








