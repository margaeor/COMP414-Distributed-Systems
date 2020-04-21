var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
   user_id: {
     type: Number,
     required: true
   },
   username: {
     type: String,
     required: true
   },
   email: {
     type: String,
     required: true
   }
 });

module.exports = mongoose.model('user', user);     