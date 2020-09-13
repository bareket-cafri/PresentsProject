'use strict';
var User=require('../models/user');
//import User from '../models/user';
exports.start=function () {
	console.log("start1 begin")
	//console.log(req.body);
	User.create({
		id: 1,
		name: "ורדה שמעון",
		pass: "8888",
		category: "client",
		email: "a8888@walla.com",
		tel: "0502178454",
		address: "הרימון 18",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	User.create({
		id: 2,
		name: "רונן שחר",
		pass: "7777",
		category: "deliver",
		email: "7777@walla.com",
		tel: "0504568789",
		address: "הרקפת 20",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	User.create({
		id: 3,
		name: "אורי גולד",
		pass: "9999",
		category: "client",
		email: "a9999@walla.com",
		tel: "0502179999",
		address: "הנרקיס 5",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	User.create({
		id: 4,
		name: "נחמיה גרוסי",
		pass: "5555",
		category: "worker",
		email: "5555@walla.com",
		tel: "0504565789",
		address: "החצב 28",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	User.create({
		id: 5,
		name: "עדי לוי",
		pass: "6666",
		category: "deliver",
		email: "6666@walla.com",
		tel: "0504566789",
		address: "ההדס 34",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	User.create({
		id: 6,
		name: "גיל חורש",
		pass: "1212",
		category: "client",
		email: "a1212@walla.com",
		tel: "0502179994",
		address: "הרימון 18",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	
};

exports.getUsersList=function(callback) {
	console.log("get users list");
	User.find(function(err, users) {
		//console.log(flowers);
		callback(err, users);
	});
};

exports.getDelivers=function(callback) {
	console.log("get delivers");
	User.find(function(err, users) {
		//console.log(flowers);
		var delivers = [];
		for(var i=0; i<users.length; i++){
			if (users[i].category == 'deliver'){
				delivers[delivers.length] = users[i];
			}
		}
		callback(err, delivers);
	});
};

exports.getUserByEmail = function(req, callback){	
console.log("get");
console.log(req.params.email);
	User.findOne({ email: req.params.email }, function (err, user){
		callback(err,user);
	});
};
exports.getUserById = function(userId, callback){	
console.log("getId");
//console.log(req.params.userId);
	User.findOne({ id: userId }, function (err, user){
		callback(err,user);
	});
};

exports.addWorker= function(req, callback) {
	User.find( function(err, users) {
		if(err){
		    console.log("err find");
			throw err;
			}
		var newId;
		if(users.length == 0)
			newId = 0;
		else 
			newId = users[users.length - 1].id + 1;
		User.create({
			id: newId,
			name: req.body.userName,
			pass: req.body.userPassword,
			category: req.body.cat,
			email: req.body.userEmail,
			tel: req.body.tel,
			address: req.body.address,
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

exports.promotionWorker=function(userEmail, callback) {
	User.updateOne(
		{email: userEmail},
		{$set: {category: "מנהל"}}
	, function(err, user) {
		if(err)
			throw err;
		callback(err, user);
	});
};

exports.downManage=function(userEmail, callback) {
	User.updateOne(
		{email: userEmail},
		{$set: {category: "עובד"}}
	, function(err, user) {
		if(err)
			throw err;
		callback(err, user);
	});
};

exports.removeUser=function(userEmail, callback) {
	console.log("use controller remove")
	console.log("user email: "+ userEmail)
	User.updateOne(
		{email: userEmail},
		{$set: {isActive: 0}}
	, function(err, user) {
		if(err)
			throw err;
		callback(err, user);
	});
	/*
	for(var i=0; i<orders.length; i++){
			if(getUserById(orders[i].client.id).email==userEmail && getUserById(orders[i].deliver.id).email==userEmail)
			{				
				removeOrder(orders[i].id);
			}
			*/
	//res.end();
};
//לפטר
exports.fireWorker=function(userEmail, callback) {
	console.log("use controller fire worker")
	console.log("user email: "+ userEmail)
	User.updateOne(
		{email: userEmail},
		{$set: {isActive: 0}}
	, function(err, user) {
		if(err)
			throw err;
		callback(err, user);
	});
	//res.end();
};

exports.login=function (req, res, callback) {
	console.log("login begin");
	console.log(req.body);
	var user_email=req.body.email;
	var user_password=req.body.pass;
	
	console.log("1");
	console.log(user_email);
	console.log(user_password);
	try {
			/*User.find(function(err, users) {
				callback(err, users);
			});	*/	
			//console.log("2");
			User.findOne({ email: user_email, pass : user_password, isActive: 1 }, function (err, user){
				//console.log("3");
			if(err) {
				//console.log("4");
				throw err;
			}
			//console.log("5");

			//console.log(result);
			//res.send(result);
			callback(err,user);
			//res.json(result);
		});
	}
	catch (err) {
				console.log("err");

		console.log(err);
		res.status(500).send(err);
	}

	//callback(err, user);

	/*User.findOne({ email: user_email, pass : user_password}, function (err, user) {
		if(err){
			console.log("err");
		}
		console.log("find");
		//console.log(user);
		//callback(err, user);

	});*/
};

exports.addUser = function(req, res){
	console.log("add user begin");
	console.log("addUser-req: ");
	User.find(function(err, user){
		if(err) {
			console.log("err");
			throw err;
		}
		var newId;
		if(user.length == 0)
			newId = 0;
		else 
			newId = user[user.length - 1].id + 1;
		
		User.create({
			id: newId,
			name: req.body.name,
			pass: req.body.pass,
			category: req.body.category,
			email: req.body.email,
			tel: req.body.tel,
			address: req.body.address,
			isActive: 1
			}, function(err){
				if(err){ 
					console.log("error: "+err);
					throw err;
				}
			   }
		);
	});
	
	res.end();
};

exports.logout=function (req, res, callback) {
	res.render('about');
};

exports.signup=function (req, res) {
	console.log("signup begin")
	console.log(req.body);
	User.find(function(err, user) {
		if(err) {
			console.log("err find");
			throw err;
		}
		console.log(user)
		var newId;
		if(user.length == 0)
			newId=0;
		else 
			newId = user[user.length - 1].id + 1;
		console.log(newId)
		User.create({
			id: newId,
			name: req.body.username,
			pass: req.body.pass,
			category: "client",
			email: req.body.email,
			tel: req.body.tel,
			address: req.body.address,
			//numBranch: req.body.numBranch,
			isActive: 1
		}, function(err){
			if(err){ 
				throw err;
				//res.status(500).send(err);
			}
			//else{
				//res.json(user);
			//}
			}
		);
	});
	//User.find();
	console.log("signup newuser")
	//console.log(user)
	/*user.save(function(err, user) {
		if(err){
			console.log("err");
			res.status(500).send(err);
		}1111
		else{
			console.log("else");
			//res.json(user);
		}
	});*/
	res.end();
	//response.json(user);
};

/*exports.myAccount=function(req, res, callback) {
	User.findOne({'email': req.body.email}, function(err, user) {
		if(err)
			res.status(500).send(err);
		else
			res.json(user);
	});
};*/




//add user
//update user