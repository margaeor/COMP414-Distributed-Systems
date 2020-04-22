'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const connect = require('./connect.js');
const {client, getChildren, getValue, getBestServer} = require('./zookeeper/functions.js');
const globals = require('./global.js');

const MAX_TOURNAMENT_PLAYERS = 3;

const User = require('./model/user_model.js');
const Tournament = require('./model/tournament_model.js');
const {Game, ActiveGame} = require('./model/game_model.js');
const Lobby = require('./model/lobby_model.js');

app.get('/get_server', async (req, res) => {


  var server = await getBestServer();

  if(server) {
    res.json(server);
  } else {
    res.send('Server not found');
  }


});

app.get('/practice/join_queue', async (req, res) => {
  
  var username = req.query.username;
  var game_type = req.query.game_type;

  if(username && game_type && globals.game_types.includes(game_type)) {

    try {
      let query = {'_id':username};
      let user_data = {'_id':username, email:username+'@gmail.com'};

      let options = {upsert: true, new: true, setDefaultsOnInsert: true};

      // If user doesn't exist, create it
      let user = await User.findOneAndUpdate(query, user_data, options).exec();

      let session = null;

      Lobby.startSession().
      then(_session => {
        session = _session;
        session.startTransaction();
        return Lobby.findOne({ game_type: game_type }).session(session);
      }).
      then(lobby => {
        console.log(lobby);
      }).
      then(() => session.commitTransaction()).
      then(() => session.endSession());

      // Customer.createCollection().
      //   then(() => Customer.startSession()).
      //   then(_session => {
      //     session = _session;
      //     session.startTransaction();
      //     return Customer.create([{ name: 'Test' }], { session: session });
      //   }).
      //   then(() => Customer.create([{ name: 'Test2' }], { session: session })).
      //   then(() => session.abortTransaction()).
      //   then(() => Customer.countDocuments()).
      //   then(count => assert.strictEqual(count, 0)).
      //   then(() => session.endSession());
      
      res.json(tournament);
    } catch(e) {
      return res.send('Cannot create');
    }

  }
  else return res.send('Wrong parameters');
});

//New practice game request
// app.get('/practice/request', async (req, res) => {

//   var opponent = req.query.opponent;
//   var username = req.query.username;
//   var game_type = req.query.game;

//   if(opponent && game_type) {

//     try {
//       let query = {'_id':username};
//       let user_data = {'_id':username, email:username+'@gmail.com'};
  
//       let options = {upsert: true, new: true, setDefaultsOnInsert: true};
  
//       // If user doesn't exist, create it
//       let user = await User.findOneAndUpdate(query, user_data, options).exec();

//     } catch(e) {
//       return res.send('Cannot create');
//     }

//   }
//   else return res.send('Wrong parameters');
// });



//Create new tournament
app.get('/tournament/create', async (req, res) => {

  var tournament_name = req.query.name;

  if(tournament_name) {

    try {
      let tournament =  await Tournament.create({
        name: tournament_name,
        date_created: new Date()
      });
  
      res.json(tournament);
    } catch(e) {
      return res.send('Cannot create');
    }

  }
  else return res.send('Wrong parameters');
});

// Register to tournament
app.get('/tournament/register', async function(req, res) {
  
  var tournament_id = req.query.id;
  var username = req.query.username;

  if(tournament_id && username) {

    let query = {'_id':username};
    let user_data = {'_id':username, email:username+'@gmail.com'};

    let options = {upsert: true, new: true, setDefaultsOnInsert: true};

    // If user doesn't exist, create it
    let user = await User.findOneAndUpdate(query, user_data, options).exec();

    let participant_limiter = String("participants."+(MAX_TOURNAMENT_PLAYERS-1));

    query = {
      _id:tournament_id,
      has_started:false,
      has_ended:false
    };
    query[participant_limiter] = { "$exists": false };

    //Try to join the tournament
    let tournament = await Tournament
      .findOneAndUpdate(
        query,
        {"$addToSet": {participants: user._id}},
        {
          new: true,
          runValidators: true,
          context: query
        }
      ).populate('user').exec();

    
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