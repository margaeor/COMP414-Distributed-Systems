var mongoose = require('mongoose');
var globals = require('../global.js');
var connect = require('../connect.js');

var Schema = mongoose.Schema;

var lobby = new Schema({
    game_type : {
        type: String,
        enum : globals.game_types,
        required: true,
        unique: true
    },
    queue: [{type:String, ref:'User'}] 
});

var Lobby = mongoose.model('lobby', lobby);

// Create a lobby for each game
globals.game_types.forEach(type => {
    let query = {'game_type':type};

    let options = {upsert: true, new: true, setDefaultsOnInsert: true};

    Lobby.findOneAndUpdate(query, query, options).exec().then(
        console.log('Lobby created')
    ).catch(
        console.log('Could not create lobby')
    );
    
});

module.exports = Lobby;