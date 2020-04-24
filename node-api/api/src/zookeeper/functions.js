
const client = require('./connect');
const globals = require('../globals.js');

const getChildrenPromise = (...args) => {
    return new Promise((resolve, reject) => {
      client.getChildren(...args, (error, children, stat) => {
        error ? reject(error) : resolve(children)
      })
    })
}
  
const getValuePromise = (...args) => {
    return new Promise((resolve, reject) => {
        client.getData(...args, (error, value, stat) => {
        error ? reject(error) : resolve(value)
        })
    })
}

const nodeExistsPromise = (...args) => {
  return new Promise((resolve, reject) => {
      client.exists(...args, (error, stat) => {
      error ? reject(error) : resolve(stat)
      })
  })
}

async function validateServerClaim(server_id,server_ip) {
  try {
    let node = '/playmasters/'+server_id;

    return (await getValuePromise(node)).toString('utf8') == server_ip;
  } catch(e) {
    console.log(e);
    return false;
  }
}

async function isServerAvailable(server_id) {
  try {
    return await nodeExistsPromise('/playmasters/'+server_id);
  } catch(e) {
    console.log(e);
    return false;
  }
}

async function getBestServer() {
  var children;
  var best_server_id;
  var server_ip = ""; 

  var counter = 0;

  while(!server_ip && counter++ < globals.MAX_ZOOKEEPER_REATTEMPTS) {
    try {

      children = await getChildrenPromise('/load_balance');
      
      if(children.length <= 0 ) throw "Cannot list servers";

      children = children.map((x) => x.split('_'));
      children = children.map((x) => [x[0],parseInt(x[1])]);
  
      var best_server = children.reduce(function(prev, curr) {
        return prev[1] < curr[1] ? prev : curr;
      });
      
      best_server_id = best_server[0];

    } catch (e) {
        console.log(e);
        continue;
    }

    try {
      server_ip = (await getValuePromise('/playmasters/'+best_server_id)).toString('utf8');
    } catch (e) {
        console.log(e);
        continue;
    }
    
  }

  if(!server_ip) return false;

  return {id:best_server_id, ip:server_ip};
}


module.exports = {
    client: client,
    getChildren: getChildrenPromise,
    getValue: getValuePromise,
    getBestServer: getBestServer,
    isServerAvailable: isServerAvailable,
    validateServerClaim: validateServerClaim
};