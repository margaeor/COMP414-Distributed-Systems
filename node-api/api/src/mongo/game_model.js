var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var globals = require('../lib/globals.js');

var game = new mongoose.Schema({
    player1: {
        type: String, 
        ref: 'user',
        required: true
    },
    player2: {
        type: String, 
        ref: 'user',
        required: true
    },
    game_type : {
        type: String,
        enum : globals.GAME_TYPES,
        required: true
    },
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
    tournament_id: {
        type: Schema.Types.ObjectId,
        ref: 'tournament',
        default: null
    },
    round_id: {
        type: Schema.Types.ObjectId,
        ref: 'tournament_round',
        default: null
    },
    score: {
        type: Number,
        default: null
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
  });

var Game = mongoose.model('game', game);


var active_game = new mongoose.Schema({
_id: {
    type: Schema.Types.ObjectId, 
    ref: 'game',
    required: true
},
server_id: {
    type: String,
    default: null
},
server_ip: {
    type: String,
    default: null
},
});

var ActiveGame = mongoose.model('active_game', active_game);

Game.createCollection();
ActiveGame.createCollection();

module.exports = {
    Game,
    ActiveGame,
};

