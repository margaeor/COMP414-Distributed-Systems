var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user_model.js');


var tournament = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  participants: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    validate: {
      validator: function (v) {
          return v.length <= 1
      },
      message: 'You must provide more than 1 tag.'
    }
  }
});

function arrayLimit(val) {
  console.log("LENGTH IS "+val.length);
  return val.length <= 1;
}

module.exports = mongoose.model('tournament', tournament);     