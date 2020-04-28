const mongoose = require('mongoose')
mongoose.Promise = global.Promise


let user = process.env.MONGODB_USER;
let password = process.env.MONGODB_ROOT_PASSWORD;
let replica_set = process.env.MONGODB_REPLICA_SET_NAME;
let replica_set_members = process.env.MONGODB_REPLICA_SET_MEMBERS;

let conn_str = 'mongodb://'+user+':'+password+'@'+replica_set_members+'/?replicaSet='+replica_set;

console.log(conn_str);
const connection = mongoose.connect(conn_str, 
  {useNewUrlParser: true,useUnifiedTopology: true}
)


module.exports = connection