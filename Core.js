var storage = require('node-persist');

var accessory_Factor = new require("./Accessory.js");
var accessoryController_Factor = new require("./AccessoryController.js");
var service_Factor = new require("./Service.js");
var characteristic_Factor = new require("./Characteristic.js");
var tcpConnected = new require("./TCPConnected.js");

var tcpConnected = new tcpConnected();

var execute = function(accessory,characteristic,value,did){

	var http = require('http');
	var gipValue = value ? 1:0;
	var post_data = 'cmd=DeviceSendCommand&data=%3Cgip%3E%3Cversion%3E1%3C%2Fversion%3E%3Ctoken%3E1234567890%3C%2Ftoken%3E%3Cdid%3E' + did + '%3C%2Fdid%3E%3Cvalue%3E' + gipValue + '%3C%2Fvalue%3E%3C%2Fgip%3E&fmt=xml';

	// An object of options to indicate where to post to
	var post_options = {
		host: 'lighting.local',
		port: '80',
		path: '/gwr/gop.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};

	// Set up the request
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Response: ' + chunk);
		});
	});

	// post the data
	post_req.write(post_data);
	post_req.end();
	console.log("executed accessory: " + accessory + ", with value: " +  value + ", with gipValue: " +  gipValue + ".");
}

console.log("HAP-NodeJS starting...");

storage.initSync();

var  manufacturer = "Connected by TPC";

var targetPort = 51826;
var usernameLastTwo

tcpConnected.devices.forEach(function (device) {
	var accessoryController = new accessoryController_Factor.AccessoryController();
	var infoService = generateAccessoryInfoService(device["name"],"Rev 1","A1S2NASF88EW",manufacturer);
	var lightService = generateLightService(device["name"], device["did"]);
	accessoryController.addService(infoService);
	accessoryController.addService(lightService);
	targetPort = targetPort + 2;
	var accessory = new accessory_Factor.Accessory(device["name"], did.toString() , storage, parseInt(targetPort), "031-45-154", accessoryController);
	accessory.publishAccessory();
});

function generateLightService(name, did) {
	var lightService = new service_Factor.Service("00000043-0000-1000-8000-0026BB765291");

	var nameOptions = {
		type: "00000023-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: name,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255
	}
	var nameChar = new characteristic_Factor.Characteristic(nameOptions);
	lightService.addCharacteristic(nameChar);

	var onOptions = {
		type: "00000025-0000-1000-8000-0026BB765291",
		perms: [
			"pw",
			"pr",
			"ev"
		],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Turn On the Light",
		designedMaxLength: 1
	}
	var lightSwitchChar = new characteristic_Factor.Characteristic(onOptions, function(value) {
		console.log("Light Status Change:",value);
		execute("Test Accessory Hall Light", "light service", value, did)
	});
	lightService.addCharacteristic(lightSwitchChar);

	return lightService;
}

function generateAccessoryInfoService(name, model, sn, manufacturer) {
	var infoService = new service_Factor.Service("0000003E-0000-1000-8000-0026BB765291");

	var nameOptions = {
		type: "00000023-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: name,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255
	}
	var nameChar = new characteristic_Factor.Characteristic(nameOptions);
	infoService.addCharacteristic(nameChar);

	var manufacturerOptions = {
		type: "00000020-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: manufacturer,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255
	}
	var manufacturerChar = new characteristic_Factor.Characteristic(manufacturerOptions);
	infoService.addCharacteristic(manufacturerChar);

	var modelOptions = {
		type: "00000021-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: model,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255
	}
	var modelChar = new characteristic_Factor.Characteristic(modelOptions);
	infoService.addCharacteristic(modelChar);

	var snOptions = {
		type: "00000030-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: sn,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255
	}
	var snChar = new characteristic_Factor.Characteristic(snOptions);
	infoService.addCharacteristic(snChar);

	var identifyOptions = {
		type: "00000014-0000-1000-8000-0026BB765291",
		perms: [
			"pw"
		],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Identify Accessory",
		designedMaxLength: 1
	}
	var identifyChar = new characteristic_Factor.Characteristic(identifyOptions);
	infoService.addCharacteristic(identifyChar);

	return infoService;
}