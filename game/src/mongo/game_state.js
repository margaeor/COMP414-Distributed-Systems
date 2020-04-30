
var mongoose = require('mongoose');

var game_state = new mongoose.Schema({
    position: {
        type: String,
        required: true
    }
});
    
var GameState = mongoose.model('game_state', game_state);

GameState.createCollection();

module.exports = {
    GameState: GameState
};
