var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  /* Phase II changes
  favoriteCityID: {
    type: Number,
    required: false,
    default: 0,
    trim: true
  },
  favoriteCity: {
    type: String,
    required: false,
    trim: true
  },
  favoriteCuisines: [{
    cuisine_id: {
      type: Number,
      required: false,
      default: 0
    },
    cuisine_name: {
      type: String,
      required: false,
      trim: true
    },
  }],
  favoriteRestaurants: [{
    restaurant_id: {
      type: Number,
      required: false,
      default: 0
    },
    restaurant_name: {
      type: String,
      required: false,
      trim: true
    },
  }],
  */
  photo: {
    type: String,
    required: true,
    trim: true
  }
});


var User = mongoose.model('User', UserSchema);
module.exports = User;
