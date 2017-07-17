//(function () {
	'use strict';

	var express = require('express');
	var router = express.Router();
	// removed until phase II where we store user data.
	//var User = require('../models/user');

	var https = require('https');

	var cityName = '';
	var apiPath = '';
	var response = '';

	router.get('/locations/:cityName', function (req, res, next) {
		cityName = req.params.cityName;
		// holy cow, default is to only return one of their choosing.
		//https://developers.zomato.com/api/v2.1/cities?q=
		apiPath = '/api/v2.1/locations?query=' + escape(cityName) + '&count=10';
		let response = https.get({ 
			host: 'developers.zomato.com',
			path: apiPath,
			headers: {
				"user-key": process.env.ZOMATO   		
			}
		}, function(response) {
			let body ='';
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {

				let data = JSON.parse(body);
				res.status(200).json(data);
			});
		});
		response.on('error', function (e){
			console.log("Error:" + e.message);
		});
	//	console.log('zomato response:' + Object.getOwnPropertyNames(response.output) );
	});

	router.get('/search/:criteria', function (req, res, next) {

		apiPath = '/api/v2.1/search?' + req.params.criteria;
		let response = https.get({ 
		host: 'developers.zomato.com',
		path: apiPath,
		headers: {
			"user-key": process.env.ZOMATO   		
		}
		}, function(response) {
			let body ='';
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				let data = JSON.parse(body);
				res.status(200).json(data);
			});
		});
	});
	//  https://developers.zomato.com/api/v2.1/search?entity_id=286&entity_type=city&cuisines=193
	router.get('/:filter/:cityId', function (req, res, next) {

		apiPath = '/api/v2.1/' + req.params.filter;
		if (req.params.filter != 'categories') {
			apiPath = '/api/v2.1/' + req.params.filter + '?city_id=' + req.params.cityId;
		}

		let response = https.get({ 
		host: 'developers.zomato.com',
		path: apiPath,
		headers: {
			"user-key": process.env.ZOMATO   		//''
		}
		}, function(response) {
			let body ='';
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {

				let data = JSON.parse(body);
				res.status(200).json(data);
			});
		});
	});

	// router.get('/city.) removed due because the city api did not return latitude and longitude.

	module.exports = router;
//}());