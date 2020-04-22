
const client = require('./connect');


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
        error ? reject("") : resolve(value)
        })
    })
}


async function getBestServer() {
  var children;
  var best_server_id;
  var server_ip = ""; 

  var counter = 0;

  while(!server_ip && counter < 3) {
    try {

      children = await getChildrenPromise('/load_balance');
      
      if(children.length <= 0 ) return res.send("Cannot list servers");

      children = children.map((x) => x.split('_'));
      children = children.map((x) => [x[0],parseInt(x[1])]);
  
      var best_server = children.reduce(function(prev, curr) {
        return prev[1] < curr[1] ? prev : curr;
      });
      
      best_server_id = best_server[0];

    } catch (e) {
        return false;
    }

    try {
      server_ip = (await getValuePromise('/playmasters/'+best_server_id)).toString('utf8');
    } catch (e) {
        console.log("Attempting again...");
    }

    counter++;
  }

  if(!server_ip) return false;

  return {id:best_server_id, ip:server_ip};
}


module.exports = {
    client: client,
    getChildren: getChildrenPromise,
    getValue: getValuePromise,
    getBestServer: getBestServer
};