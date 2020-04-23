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
   game_requests: [{
     username: {type: String, required: true},
     game_type: {type: String, required: true},
   }],
   active_games: [{
     type: Schema.Types.ObjectId,
     ref: 'Game'
   }]
 });

module.exports = mongoose.model('user', user);     