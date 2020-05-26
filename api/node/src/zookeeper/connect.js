
const zookeeper = require('node-zookeeper-client');

const client = zookeeper.createClient('zookeeper:2181',{ sessionTimeout: 2000 });


client.on('connected', function () {
  console.log('Connected to Zookeeper server.');
});
client.on('disconnected', function () {
  console.log('Client state is changed to disconnected.');
});
client.on('expired', function () {
  console.log('Client state is changed to expired.');
});
client.on('authenticationFailed', function () {
  console.log('Client state is changed to authenticationFailed .');
});
client.on('connectedReadOnly', function () {
  console.log('Client state is changed to connectedReadOnly.');
});

client.connect();


module.exports = client;
