// HomeKit types required
var types = require("./types.js")
var exports = module.exports = {};

var execute = function(accessory,characteristic,value){ 
	
	var http = require('http');
	var post_data = 'cmd=DeviceSendCommand&data=%3Cgip%3E%3Cversion%3E1%3C%2Fversion%3E%3Ctoken%3E1234567890%3C%2Ftoken%3E%3Cdid%3E216600238738871650%3C%2Fdid%3E%3Cvalue%3E0%3C%2Fvalue%3E%3C%2Fgip%3E&fmt=xml';
	
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
	console.log("executed accessory: " + accessory + ", with value: " +  value + "."); 
}

exports.accessory = {
  displayName: "Halllight",
  username: "1A:2B:3C:4D:5E:FF",
  pincode: "031-45-154",
  services: [{
    sType: types.ACCESSORY_INFORMATION_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Halllight",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.MANUFACTURER_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Oltica",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.MODEL_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Rev-1",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.SERIAL_NUMBER_CTYPE, 
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "A1S2NASF88EW",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255    
    },{
    	cType: types.IDENTIFY_CTYPE, 
    	onUpdate: null,
    	perms: ["pw"],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Identify Accessory",
		designedMaxLength: 1    
    }]
  },{
    sType: types.LIGHTBULB_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Halllight",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255   
    },{
    	cType: types.POWER_STATE_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute("Test Accessory Hall Light", "light service", value); },
    	perms: ["pw","pr","ev"],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Turn On the Light",
		designedMaxLength: 1    
    },{
    	cType: types.HUE_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute("Test Accessory 1", "Light - Hue", value); },
    	perms: ["pw","pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Adjust Hue of Light",
		designedMinValue: 0,
		designedMaxValue: 360,
		designedMinStep: 1,
		unit: "arcdegrees"
    },{
    	cType: types.BRIGHTNESS_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute("Test Accessory 1", "Light - Brightness", value); },
    	perms: ["pw","pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Adjust Brightness of Light",
		designedMinValue: 0,
		designedMaxValue: 100,
		designedMinStep: 1,
		unit: "%"
    },{
    	cType: types.SATURATION_CTYPE,
    	onUpdate: function(value) { console.log("Change:",value); execute("Test Accessory 1", "Light - Saturation", value); },
    	perms: ["pw","pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Adjust Saturation of Light",
		designedMinValue: 0,
		designedMaxValue: 100,
		designedMinStep: 1,
		unit: "%"
    }]
  }]
}
