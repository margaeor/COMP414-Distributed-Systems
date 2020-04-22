'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const connect = require('./connect.js');
const zookeeper = require('node-zookeeper-client');
 
const client = zookeeper.createClient('zookeeper:2181',{ sessionTimeout: 5000 });

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
      error ? resolve("-1") : resolve(value)
    })
  })
}

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



// client.on('error', (err) => {
//   console.error('whoops! there was an error');
// });



const MAX_TOURNAMENT_PLAYERS = 3;

const User = require('./user_model.js');
const Tournament = require('./tournament_model.js');
const {Game, ActiveGame} = require('./game_model.js');


app.get('/get_server', async (req, res) => {
  console.log('hi');

  var path = '/playmasters';
  var children;
  var results;
  var key_values;

  try {

    children = await getChildrenPromise(path);

    children = ['192.168.1.100','192.168.1.101','192.168.1.200'];
    results = await Promise.all(children.map(async (x) => getValuePromise(path+'/'+x)));
    results = results.map((key, idx) => parseInt(key.toString('utf8')));

    key_values = children.reduce((obj, key, index) => ({ ...obj, [key]: results[index] }), {});

  } catch (e) {

      return res.send(e);
  }
  

  res.json(key_values);

  // client.getChildren(
  //     path,
  //     function (error, children, stat) {
  //         if (error) {
  //             res.send('Server list failed');
  //             return;
  //         }

  //         res.json(children);
  //     }
  // );

  //return res.send(listChildren(client,'/'));
  //return res.send('Received a GET HTTP method servera');
});

//Create new tournament
app.get('/tournament/create', async (req, res) => {

  var tournament_name = req.query.name;

  if(tournament_name) {

    let tournament =  await Tournament.create({
      name: tournament_name,
      date_created: new Date()
    });

    res.json(tournament);
  }
  else return res.send('Received a GET HTTP method2');
});

// Register to tournament
app.get('/tournament/register', async function(req, res) {
  
  var tournament_id = req.query.id;
  var username = req.query.username;

  if(tournament_id && username) {

    let query = {'username':username};
    let options = {upsert: true, new: true, setDefaultsOnInsert: true};

    // If user doesn't exist, create it
    let user = await User.findOneAndUpdate(query, query, options).exec();

    let participant_limiter = String("participants."+(MAX_TOURNAMENT_PLAYERS-1));

    query = {
      _id:tournament_id,
      has_started:false,
      has_ended:false
    };
    query[participant_limiter] = { "$exists": false };

    // Try to join the tournament
    let tournament = await Tournament
      .findOneAndUpdate(
        query,
        {"$addToSet": {participants: user._id}},
        {
          new: true,
          runValidators: true,
          context: query
        }
      ).exec();

    
    if(tournament) {
      res.json(tournament);
    } else {
      return res.send('Cannot register tournament');
    }

  } else {
    return res.send('Wrong Parameters');
  }

  //return res.send('Received a GET HTTP method3 '+req.query.id);
});

app.get('/tournament/list', (req, res) => {

  Tournament.find().select('-participants').lean().exec(function (err, users) {
      return res.end(JSON.stringify(users));
  });

  //return res.send('Received a GET HTTP method3');
});


console.log(`Running on http://${HOST}:${PORT}`);


app.set('port', process.env.PORT || PORT);


connect('mongodb://mongo/test', {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => {
    console.log('server on http://localhost:3000')
  }))
  .catch(e => console.error(e))