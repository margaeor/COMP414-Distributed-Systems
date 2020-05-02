var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
   
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  rating: {
    type: Number,
    default: 1500
  },
  total_games: {
    type: Number,
    default: 0
  },
  total_wins: {
    type: Number,
    default: 0
  },
  total_losses: {
    type: Number,
    default: 0
  },
  total_ties: {
    type: Number,
    default: 0
  },
  active_games: [{
    type: Schema.Types.ObjectId,
    ref: 'game'
  }],
  past_games: [{
    type: Schema.Types.ObjectId,
    ref: 'game'
  }],
  tournaments: [{
    type: Schema.Types.ObjectId,
    ref: 'tournament'
  }]
});

module.exports = mongoose.model('user', user);     