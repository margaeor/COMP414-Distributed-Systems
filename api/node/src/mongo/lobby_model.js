var mongoose = require('mongoose');
var globals = require('../lib/globals.js');
var connect = require('./connect.js');

var Schema = mongoose.Schema;

var lobby = new Schema({
    active_tournaments: [{
        type: Schema.Types.ObjectId,
        ref: 'game'
    }],
    game_type : {
        type: String,
        enum : globals.GAME_TYPES,
        required: true,
        unique: true
    },
    queue: [{type:String, ref:'user'}] 
});

var Lobby = mongoose.model('lobby', lobby);

// Create a lobby for each game
globals.GAME_TYPES.forEach(type => {
    let query = {'game_type':type};

    let options = {upsert: true, new: true, setDefaultsOnInsert: true};

    Lobby.findOneAndUpdate(query, query, options).exec().then(
        console.log('Lobby created')
    ).catch(
        console.log('Could not create lobby')
    );
    
});

module.exports = Lobby;