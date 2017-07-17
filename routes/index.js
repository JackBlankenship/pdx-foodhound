//(function () {
  'use strict';
  var express = require('express');
    var https = require('https');
  var router = express.Router();
  var pageType = '';
  /* GET home page */
  router.get('/', function(req, res) {
    res.render('index', { title: 'Home', user: req.user });
  });

  /* GET login page */
  router.get('/login', function(req, res) {
    res.render('login', { title: 'Log In', user: req.user });
  });

  /* GET search page */
  router.get('/search', function (req, res) {
     if(req.user) {
    	res.render('search', { title: "Search", user: req.user, pageType: 'search' });
    } else {
      res.redirect("/login");
    }
  });

  /* GET about page */
  router.get('/about', function(req, res) {
    res.render('about', { title: 'About', user: req.user });
  });

  /* pulled due to geolocation requiring https:
  router.get('/nearme/:lat/:lng', function (req, res) {
    //https://developers.zomato.com/api/v2.1/search?lat=45.4352825&lon=-122.80963899&radius=10000.0&sort=rating&order=desc
    let apiPath = '/api/v2.1/search?lat=' + req.params.lat + '&lon=' + req.params.lng + '&radius=10000.0&sort=rating&order=desc';
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
        res.render('nearme', { title: "Nearby", restaurants: data.restaurants})
      });
    });
    
  });
  
  // restaurant detail page 
  router.get('/restaurant/:id', function (req, res) {
      let apiPath = '/api/v2.1/restaurant?res_id=' + req.params.id;
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
        res.render('restaurant', { title: "Restaurant", restaurant: data, pageType: 'restaurant'})
      });
    });    
  })

  /*
  // GET contact page 
  router.get('/contact', function(req, res) {
    res.render('contact', { title: 'Contact', user: req.user });
  });

  //* GET profile page 
  router.get('/profile', function(req, res) {
    if(req.user) {
      res.render('profile', { title: 'Profile', user: req.user });
    } else {
      res.redirect("/login");
    }
    
  });
  */

  module.exports = router;
//}());