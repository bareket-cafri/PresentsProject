var express=require('express');
var expressValidator=require('express-validator');
var session=require('express-session');
var bodyParser=require('body-parser');
var logger=require('morgan');
var mongoose=require('mongoose');
var passport=require('passport');
var path=require('path');
var flash=require('express-flash');
var fs=require('fs');
var multer=require('multer');
var download=require('download-file');

var app=express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections =[];

var MongoClient = require('mongodb').MongoClient;

// Connect to the db server
MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
 // const db = client.db('giftStore')
//	const collection = db.collection('users')

//	collection.insertMany([{name: 'Togo'}, {name: 'Syd'}], (err, result) => {
//		if(err) throw err;
//	})
})



//mongo connection
//var db = mongoose.createConnection('mongodb://localhost:27017/admin');
mongoose.connection.on('error', function() {
	console.log('MongoDB Connection Error. Please make sure that MongoDB is running');
	process.exit(1);
});




//set the view engine to ejs
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/app'));

app.set('view engine', 'ejs');

//express configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Routing
var userController=require('./routes/usersController');
var foodController=require('./routes/foodsController');
var snifController=require('./routes/snifsController');
var orderController=require('./routes/ordersController');
var chatController = require('./routes/chatController');


//start
/*userController.start( function(err){
	if(err){
		console.log("err1");
	}
});*/
/*foodController.start( function(err){
	if(err){
		console.log("err1");
	}
});*/

/*orderController.start( function(err){
	if(err){
		console.log("err1");
	}
});*/
/*
snifController.start(function(err){
	if(err){
		console.log("err3");
	}
});*/

io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	
	//Disconnenct
	socket.on('disconnect', function(data) {
		console.log("socket.username:");
		console.log(socket.username);
		console.log(users.indexOf(socket.username))
		//users.splice(users.indexOf(socket.username), 1);
		var users2=[];
		var index=0;
		for(var i=0; i<users.length; i++) {
			if(users[i].userName != socket.username) {
				users2[index]=users[i];
				index++;
			}
		}
		users=[];
		for(var j=0; j<users2.length; j++)
			users[j]=users2[j];
		
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);//remove the current socket
		console.log('Disconnected: %s sockets connected', connections.length);
	});
	
	//send message. i think its the chat.
	socket.on('send message', function (data, name, id) {
		console.log("data: ");
		console.log(data);
		console.log("name:");
		console.log(name);
		console.log("id:");
		console.log(id);
		//var cat = "";
		userController.getUserById(id, function(err, connectUser){
			if(err){}
				//res.status(500).send(err);
			else{
				//add new record to the mongo
				chatController.addMessage(name, connectUser.category, data);
				io.sockets.emit('new message', {msg: data, user: name, cat: connectUser.category});
				/*chatController.getMessageList(function(err, messages) {
					if(err) {
						console.log("ERROR");
					}
					else {
						console.log(messages);
					}
				});*/
			}
		});
	});
	
	//new user
	socket.on('new user', function(data,id, cat, callback) {
		callback(true);
		console.log("data: ")
		console.log(data)
		console.log("data2: ")
		//console.log(data2)
		socket.username = data;
		socket.cat=cat;
		var newUser={};
		newUser.userName=socket.username;
		newUser.category=socket.cat;
		//users.push(socket.username);
		console.log("login -> users before:")
		console.log(users)
		users.push(newUser);
		console.log("login -> users after:")
		console.log(users)
		updateUsernames();
		chatController.getMessageList(function(err, messages) {
			if(err) {
				console.log("ERROR");
			}
			else {
				console.log(messages);
				if(messages.length > 0) {
					io.sockets.emit('clear message', {msg: '', user: '', cat: ''});
					for(var i=0; i<messages.length; i++) {
						io.sockets.emit('new message', {msg: messages[i].message, user: messages[i].senderName, cat: messages[i].senderCategory});
						//socket.emit('send message', messages[i]);
					}
				}
			}
		});		
	});
	
	function updateUsernames() {
		console.log("updateUsernames -> users:")
		console.log(users)
		io.sockets.emit('get users', users);
	}
});


app.get('/', function(req, res) {
	
	
	res.render('index');
});
app.get('/getItem/:itemId', function(req, res) {
	foodController.getItemById(req, function (err2, item) {
		if(err2)
			res.status(500).send(err2);
		else { 
			res.json(item);
		}
	});
});

app.get('/home', function(req, res) {
	res.render('home');
});

app.get('/homeButtons/:email', function(req, res) {
	console.log("homeButtons servers");
	userController.getUserByEmail(req, function (err2, connectUser) {
		if(err2)
			res.status(500).send(err2);
		else { 
				res.render('empty');
			
		}
		});
});

app.get('/menu/:email', function(req, res) {
	//console.log("men");
	res.render('menu', {user_email: req.params.email});
});

app.get('/orderForm/:email', function(req, res) {
	if (req.params.email != 0){
		userController.getUserByEmail(req, function (err2, connectUser) {
		if(err2)
			res.status(500).send(err2);
		else { 
			if(connectUser.category == "client"){
				res.render('orderForm' , {user_email: req.params.email , connectUser: connectUser});
			} else {
				res.render('empty');
			}
		}
		});
	} else {
		res.render('empty');
	}
});

app.post('/addNewOrder/:email',function(req, res) {
	console.log("server- addNewOrder");
	console.log()
	var myReq = {};
	myReq.items = req.body.items;
	myReq.address = req.body.address;
	myReq.hour = req.body.hour;
	myReq.cost = req.body.cost;
	
	userController.getUserByEmail(req, function (err2, connectUser) {
		if(err2)
			res.status(500).send(err2);
		else { 
			orderController.addOrder(myReq, res, connectUser, function(err) {
				if(err)
					res.status(500).send(err);
				else {
					//res.render('menu', {user_email: connectUser.email});
					res.status(200).send();
				}
			});
		}
	});
	//console.log("req: ");
	//console.log(req.body);
	//for(i=1; i< 999999999; i++);
	
});

app.post('/foodList/:email', function(req, res) {
	//console.log("food-ser");
	foodController.getFoodList(function(err, food) {
	
		if(err)
			res.status(500).send(err);
		else {
			if (req.params.email != 0){
				
				console.log("con");
				console.log(req.params.email);
				userController.getUserByEmail(req, function (err2, connectUser) {
				if(err2)
					res.status(500).send(err2);
				else { 
					res.render('foodList', { food: food, category: connectUser.category, user_email: connectUser.email ,kindList: req.body.kind });
				}
				});
			} else {
				console.log("notcon");
				console.log(req.params.email);
				res.render('foodList', { food: food, category: '', user_email: '0' ,kindList: req.body.kind });
			}
		}
	});
});


app.post('/allMivzaim/:email', function(req, res) {
	console.log("allM-ser");
	console.log(req.params.email);
	foodController.getFoodList(function(err, food) {
	
		if(err)
			res.status(500).send(err);
		else {
			if (req.params.email != 0){				
				console.log("con");
				console.log(req.params.email);
				userController.getUserByEmail(req, function (err2, connectUser) {
				if(err2)
					res.status(500).send(err2);
				else { 
					res.render('allMivzaim', { food: food, category: connectUser.category, user_email: connectUser.email});
				}
				});
			} else {
				console.log("notcon");
				console.log(req.params.email);
				res.render('allMivzaim', { food: food, category: '', user_email: '0'});
			}
		}
	});
});

app.post('/removeFood/:email', function(req, res) {
	console.log("server removeFood");

	food=req.body.idFood;
	foodController.removeFood(food, function(err3, user) {
		if(err3)
			res.status(500).send(err3);
		else {
			res.render('menu', {user_email: req.params.email});
		}
	});
});
//
app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/summer', function(req, res) {
	res.render('summer');
  });

app.get('/addPro', function(req, res) {
  res.render('addFood');
});

//
app.get('/kesher/:userId', function(req, res) {
	if( req.params.userId == 0){
		res.render('kesher', { connectId: '0', connectName: '', connectCat: ''});
	} else {
		userController.getUserById(req.params.userId, function(err, user){
			if(err)
				res.status(500).send(err);
			else{
				res.render('kesher', { connectId: user.id, connectName: user.name, connectCat: user.category });
			}
		});
	}
});

app.get('/logout/:userId', function(req, res) {	
	userController.getUserById(req.params.userId, function(err, user){
		if(err)
			res.status(500).send(err);
		else{
			var users2=[];
			var index=0;
			for(var i=0; i<users.length; i++) {
				if(users[i].userName != user.name) {
					console.log("2222222")
					users2[index]=users[i];
					index++;
				}
			}
			users=[];
			for(var j=0; j<users2.length; j++) 
				users[j]=users2[j];			
			
			console.log("logout -> users:")
			console.log(users)
			
			//updateUsernames();
			io.sockets.emit('get users', users);
			res.render('home');		
		}
	});
});

app.post('/login', function(req, res) {
	console.log("server-login");
	userController.login(req, res, function(err, user) {
		if(err)
			res.status(500).send(err);
		else{
			console.log("back");
			console.log(user);
			res.json(user);
		}
			//res.status(200).send(user);
	});		
});

app.post('/signup', function(req, res) {
	console.log("server-signup");
	userController.signup(req, res, function(err) {
		if(err) 
			res.status(500).send(err);
		else
			res.status(200).send();
		
	});
});

app.get('/myAccount/:email', function(req,res) {
	
	userController.getUserByEmail(req, function(err, user) {
		if(err)
			res.status(500).send(err);
		else {
			snifController.getSnifimList(function(err, snifim) {
				if(err)
					res.status(500).send(err);
				else
					res.render('myAccount', {user: user, snifim:snifim});
			});
		}
	});
});

app.post('/promotion/:email', function(req, res) {
	userToPromotion=req.body.em;
	userController.promotionWorker(userToPromotion, function(err3, user) {
		if(err3)
			res.status(500).send(err3);
		else {
			userController.getUsersList(function(err, users) {
				if(err)
					res.status(500).send(err);
				else {
					snifController.getSnifimList( function (err2, snifim) {
						if(err2)
							res.status(500).send(err2);
							else {
								userController.getUserByEmail(req, function(err3, connectUser){
									if(err3)
										res.status(500).send(err3);
									else
										res.render('users', { connectUser: connectUser, users: users, snifim: snifim });
									});
								}
					});
				}
			});
		}
	});
});

app.post('/down/:email', function(req, res) {
	manageToDown=req.body.em;
	userController.downManage(manageToDown, function(err3, user) {
		if(err3)
			res.status(500).send(err3);
		else {
			userController.getUsersList(function(err, users) {
				if(err)
					res.status(500).send(err);
				else {
					snifController.getSnifimList( function (err2, snifim) {
						if(err2)
							res.status(500).send(err2);
							else {
								userController.getUserByEmail(req, function(err3, connectUser){
									if(err3)
										res.status(500).send(err3);
									else
										res.render('users', { connectUser: connectUser, users: users, snifim: snifim });
									});
								}
					});
				}
			});
		}
	});
});

app.post('/removeUser/:email', function(req, res) {
	userToRemove=req.body.em;
	var i;
	for(i=1; i< 99999999; i++);
	userController.removeUser(userToRemove, function(err, user) {
		if(err)
			res.status(500).send(err);
		else {
			userController.getUsersList(function(err1, users) {
				if(err1)
					res.status(500).send(err1);
				else {
					userController.getUserByEmail(req, function(err2, connectUser){
						if(err2)
							res.status(500).send(err2);
						else
							res.render('users', { connectUser: connectUser, users: users});
						});
					}
			});
		}
	});
});

app.post('/fire/:email', function(req, res) {
	userToFire=req.body.em;
	userController.fireWorker(userToFire, function(err3, user) {
		if(err3)
			res.status(500).send(err3);
		else {
			userController.getUsersList(function(err, users) {
				if(err)
					res.status(500).send(err);
				else {
					snifController.getSnifimList( function (err2, snifim) {
						if(err2)
							res.status(500).send(err2);
							else {
								userController.getUserByEmail(req, function(err3, connectUser){
									if(err3)
										res.status(500).send(err3);
									else
										res.render('users', { connectUser: connectUser, users: users, snifim: snifim });
									});
								}
					});
				}
			});
		}
	});
});
			
app.get('/users/:email', function(req, res) {
	var em = req.params.email;
	console.log("em:");
	console.log(em);
	userController.getUsersList(function(err, users) {
		
		if(err)
			res.status(500).send(err);
		else {
			userController.getUserByEmail(req, function(err2, connectUser){
				if(err2)
					res.status(500).send(err2);
				else
					res.render('users', { connectUser: connectUser, users: users });

			});
		}
	});
});


app.get('/adduserLink/:email', function(req, res){
	console.log("server-link");
    var em = req.params.email;
	console.log("em:");
	console.log(em);
	//var em = req.params.email;
	userController.getUserByEmail(req, function (err, user) {
		if(err)
			res.status(500).send(err);
		else {
			res.render('adduser', { connectUser: user });
		}
	});
});


app.get('/myOrders/:userId', function(req, res) {
	console.log("ser my");
	console.log(req.params.userId);
	orderController.getOrdersByClientId(req.params.userId, function(err, orders) {
		
		if(err)
			res.status(500).send(err);
		else 
			res.render('myOrders', { orders: orders });
	});
});

app.get('/deliverOrders/:userId', function(req, res) {
	console.log("ser my");
	console.log(req.params.userId);
	orderController.getOrdersByDeliverId(req.params.userId, function(err, orders) {
		
		if(err)
			res.status(500).send(err);
		else {
			console.log("ret");
			console.log(orders);
			res.render('deliverOrders', { orders: orders });
		}
	});
});

app.get('/orders', function(req, res) {
	orderController.getOrderList(function(err, orders) {
		if(err)
			res.status(500).send(err);
		else {
			userController.getDelivers(function(err, delivers) {
				if(err)
					res.status(500).send(err);
				else {
					console.log("deliver:");
					console.log(delivers);
					res.render('orders', { orders: orders , delivers: delivers});
				}
			});
		}
	});
});

app.post('/rejectOrder', function(req, res) {
	console.log("server-changeStatus");
	var idOrder = req.body.orderId;
	orderController.rejectOrder(idOrder, function(err, order) {
		
		if(err)
			res.status(500).send(err);
		else 
			res.status(200).send();
	});
});

app.post('/changeStatus', function(req, res) {
	console.log("server-changeStatus");
	var idOrder = req.body.orderId;
	orderController.changeOrderStatus(idOrder, function(err, order) {
	
		if(err)
			res.status(500).send(err);
		else 
			res.status(200).send();
	});
});

app.post('/chooseDeliver/:orderId', function(req, res) {
	console.log("server-chooseDeliver");
	var idOrder = req.params.orderId;
	//console.log(idOrder);

	userController.getUserById( req.body.deliverId, function(err, deliver){
			if(err)
				res.status(500).send(err);
			else{
				//console.log(deliver);

				orderController.changeDeliverToOrder(idOrder, deliver, function(err) {
					if(err)
						res.status(500).send(err);
					else 
						res.status(200).send();
				});				
			}
		});
	
});

/*app.post('/', function(req,res) {
	console.log("server-addWorker");
	
};*/


app.post('/upload', function(req, res) {
	console.log("server-upload");
	console.log(req.headers);
	console.log(req.body);
	var fbytes = req.headers["content-length"];
    var fname = req.headers["x_filename"];
    var upbytes = 0;
	var pathFile = "public/images/"+fname;
	newfile = fs.createWriteStream(pathFile);
   req.on('data', function(stuff) {
     upbytes += stuff.length;
     var progress = (upbytes / fbytes) * 100;
     console.log("progress: " + parseInt(progress, 10) + "%\n");
     var good = newfile.write(stuff);
     if(!good) {
       console.log("Pause");
       req.pause();
     }
   });
   newfile.on('drain', function() {
     req.resume();
     console.log("Resume");
   });
   req.on('end', function(stuff) {
     res.end();
     console.log("Uploaded");
     newfile.end();
   });
	
});

var storage = multer.diskStorage({
	    
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
		console.log("multer");
	    console.log(file);
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname;
        var extension = originalname.split(".");
        filename = Date.now() + '.' + extension[extension.length - 1];
        cb(null, filename);
    }
});


app.post('/addFlowerIImgUrl', function(req, res) {
	console.log("server-url");
	//הורדת הקובץ
	var date1 = Date.now();
	var imgUrl = req.body.imgUrl;
    var options = {
        directory: './public/images/',
        filename: date1 + '.png'
    };
    download(imgUrl, options, function (err) {
        if (err){
			//console.log("image downloaded");
			res.status(500).send(err);
		}
		else {
			res.status(200).send({ name: date1 });

		}
	});
	
});

app.post('/addFood', function(req, res) {
	console.log("server- addfood");
	console.log(req.body);
	foodController.addFood(req, res, function(err) {
		if(err)
			res.status(500).send(err);
		else {
				console.log("ssg");

			res.status(200).send();
		}
	});
});



/*app.post('/addFood', function(req, res) {
	console.log("server- addfood");
	console.log(req.body);
	foodController.addFood(req, res, function(err) {
		if(err)
			res.status(500).send(err);
		else
			res.status(200).send();
	});
});*/

app.post('/addUser', function(req, res) {
	console.log("server- addUser");
	//console.log("req: ");
	//console.log(req.body);
	//for(i=1; i< 999999999; i++);
	userController.addUser(req, res, function(err) {
		if(err)
			res.status(500).send(err);
		else 
			res.status(200).send();
	});
});




//app.listen(3000);
server.listen(3000);
console.log('3000 is the magic port');
	

module.exports = app;







