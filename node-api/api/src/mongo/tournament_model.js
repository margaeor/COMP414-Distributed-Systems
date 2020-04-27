var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user_model.js');
var Game = require('./game_model.js');
var globals = require('../lib/globals');

var tournament_round = new mongoose.Schema({
  // tournament_id: {
  //   type: mongoose.Types.ObjectId,
  //   required: true
  // },
  round_number: {
    type: Number,
    default: 0,
    required: true
  },
  num_games_left: {
    type: Number,
    required:true
  },
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'game'
  }],
  winners: [{
    type: String,
    ref: 'user'
  }],
  losers: [{
    type: String,
    ref: 'user'
  }],
  is_final: {
    type: Boolean,
    required: true,
    default: false
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});



var tournament = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  date_created: {
    type: Date,
    required: true,
    default:Date.now
  },
  leaderboard: [{
    username: {
      type: String,
      ref: 'user'
    },
    wins: Number,
    losses: Number
  }],
  has_started: {
    type: Boolean,
    required: true,
    default: false
  },
  has_ended: {
    type: Boolean,
    required: true,
    default: false
  },
  rounds: [{
    type: mongoose.Types.ObjectId,
    ref: 'tournament_round'
  }],
  game_type: {
    type: String,
    enum : globals.GAME_TYPES,
    required: true
  },
  participants: {
    type: [{ type: String, ref: 'user'}]/*,
    validate: {
      validator: function (v) { //@TODO: remove validation
          return v.length <= 1
      },
      message: 'No more users'
    }*/
  }
});

var TournamentRound = mongoose.model('tournament_round', tournament_round);
var Tournament = mongoose.model('tournament', tournament);

function arrayLimit(val) {
  console.log("LENGTH IS "+val.length);
  return val.length <= 1;
}

TournamentRound.createCollection();
Tournament.createCollection();

module.exports = {
  Tournament:Tournament,
  TournamentRound: TournamentRound
};     