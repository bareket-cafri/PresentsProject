'use strict';
var Snif=require('../models/snif');

exports.start=function () {
	console.log("start2 begin")
	Snif.create({
		numBranch: 0,
		name: "פרחים שלי",
		city: "ירושלים",
		tel: "02-6756455",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	Snif.create({
		numBranch: 1,
		name: "פרחים שלי",
		city: "תל אביב",
		tel: "04-6756455",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
	Snif.create({
		numBranch: 2,
		name: "פרחים שלי",
		city: "נתניה",
		tel: "03-6756455",
		isActive: 1
	}, function(err){ if(err) throw err; }
	);
};

exports.getSnifimList=function(callback) {
	console.log("get flowers list");
	Snif.find(function(err, snifim) {
		//console.log(snifim);
		callback(err, snifim);
	});
};





