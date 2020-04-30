const mongoose = require('mongoose')
const fs = require('fs');
mongoose.Promise = global.Promise

var password = null;

try {
    password = fs.readFileSync('/run/secrets/mongodb_playmaster_password', 'utf8');
    console.log(password);    
} catch(e) {
    console.log('Error:', e.stack);
}

let user = process.env.MONGODB_USER;
let replica_set = process.env.MONGODB_REPLICA_SET_NAME;
let replica_set_members = process.env.MONGODB_REPLICA_SET_MEMBERS;
let db = process.env.MONGODB_DATABASE;

let conn_str = 'mongodb://'+user+':'+password+'@'+replica_set_members+'/'+db+'?replicaSet='+replica_set+'&authSource='+db;

console.log(conn_str);
const connection = mongoose.connect(conn_str, 
  {useNewUrlParser: true,useUnifiedTopology: true}
)

//mongoose.setReadPref('secondary');

module.exports = connection