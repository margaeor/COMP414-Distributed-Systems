var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var game = new mongoose.Schema({
    player_1: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        default: null
    },
    player_2: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        default: null
    },
    date_created: {
      type: Date,
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
    score: {
        type: Number,
        default: null
    },
    date_created: {
        type: Date,
        required: true,
        default: new Date()
    }
  });

var Game = mongoose.model('game', game);


var active_game = new mongoose.Schema({
_id: {
    type: Schema.Types.ObjectId, 
    ref: 'Game',
    required: true,
    default: null
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


module.exports = {
    game: Game,
    active_game: ActiveGame,
};

