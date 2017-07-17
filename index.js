//(function () {
'use strict';
var express = require('express');
var app = express();
var serverURL = process.env.SERVER_LOCATION || 'http://localhost:5000';

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session  = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');

var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
console.log("server:" + serverURL);
let facebookURL = serverURL + '/auth/facebook/return';
let githubURL = serverURL + '/auth/github/return';

// upsert: true creates if new or updates if exists.
function generateOrFindUser(accessToken, refreshToken, profile, done){
	let propertyArray = Object.getOwnPropertyNames(profile);
	// the if does not catch private email information.
  	//if(profile.emails[0]) {
	if	(propertyArray.indexOf('emails') >= 0) {
	    User.findOneAndUpdate(
	      { email: profile.emails[0].value },
	      {
	        name: profile.displayName || profile.username,
	        email: profile.emails[0].value,
	        photo: profile.photos[0].value
	      },
	      {
	        upsert: true
	      },
	    done
	  );
	} else {
		var noEmailError = new Error("Your email privacy settings prevent you from signing in.");
	    done(noEmailError, null);
	}
};

// must match the OAuth developers page on GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: githubURL
  },
  generateOrFindUser)
);

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: facebookURL,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  generateOrFindUser)
);
passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(userId, done){
	User.findById(userId, done);
});

// mongodb connection
console.log("mongoose:" + process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || "mongodb:/localhost:27017/heroku");
var db = mongoose.connection;

// Session config for Passport and MongoDB
var sessionOptions = {
	secret: "your secret key goes here",
	resave: true,
	saveUninitialized: true,
  	store: new MongoStore({
  	  mongooseConnection: db
 	})
};

app.use(session(sessionOptions));

//Initialize Passport.js
app.use(passport.initialize());

//Restore session
app.use(passport.session());

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once("open", function (){
	console.log("mongoose connection successful");
});

app.set('port', (process.env.PORT || 5000));

//static directories for css, js and assets
app.use(express.static(__dirname + '/public'));
//res.setHeader('Access-Control-Allow-Origin', '*');

var routes = require('./routes/index');
// removed until phase II. see above.
var auth = require('./routes/auth');
var api = require('./routes/api');
// views is directory for all template files

app.set('views', __dirname + '/views');

app.set('view engine', 'pug');
app.use('/', routes);
app.use('/auth', auth);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//}());
