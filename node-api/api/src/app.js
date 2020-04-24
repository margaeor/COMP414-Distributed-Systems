'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const connect = require('./connect.js');
const zookeeper = require('./zookeeper/functions.js');
const globals = require('./globals.js');
const transactions = require('./transactions.js');
const errors = require('./lib/errors.js');
const {
  createUserIfNotExists,
  atomicPracticePairing,
  resetActiveGameState,
  createGame
} = require('./lib/core.js');

const MAX_TOURNAMENT_PLAYERS = 3;

const User = require('./model/user_model.js');
const Tournament = require('./model/tournament_model.js');
const {Game, ActiveGame} = require('./model/game_model.js');
const Lobby = require('./model/lobby_model.js');





app.get('/get_server', async (req, res) => {


  var server = await zookeeper.getBestServer();

  if(server) {
    res.json(server);
  } else {
    res.send('Server not found');
  }


});

// Join pracice queue
app.get('/practice/join_queue', async (req, res) => {
  
  var username = req.query.username;
  var game_type = req.query.game_type;

  try {
    if(username && game_type && globals.game_types.includes(game_type)) 
    {
      createUserIfNotExists(username);
      let opponent = await transactions.runTransactionWithRetry(atomicPracticePairing, Lobby, username, game_type);

      if(opponent) {
        if(username == opponent) {
          throw new errors.InvalidOperationException('User already in queue');
        } else {
          createUserIfNotExists(opponent);
          let result = await createGame(username,opponent,game_type);
          if(result && result.length == 2 && result[1]) {
            let active_game = result[1];
            res.json(errors.createSuccessResponse('Game created',active_game));
          } 
          else new errors.InternalErrorException('Could not create game');
        }
      } else {
        res.json(errors.createSuccessResponse('User added to queue'));
      }

    }
    else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e) {
    console.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }
});


// Join existing practice game
app.get('/practice/join', async (req, res) => {
  
  var game_id = req.query.game_id;

  try {
    if(game_id) {
    
      let game = await Game.findById(game_id).exec();

      var active_game = await resetActiveGameState(game);
      
      if(active_game) {
        res.json(errors.createSuccessResponse('',active_game));
      } else throw new errors.InvalidOperationException('Inactive game');
    }  
    else throw new errors.InvalidArgumentException('Wrong parameters');

  } catch(e) {
    console.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});


//Create new tournament
app.get('/tournament/create', async (req, res) => {

  var tournament_name = req.query.name;
  try {
    if(tournament_name) {

      let tournament =  await Tournament.create({
        name: tournament_name,
        date_created: new Date()
      });
      res.json(errors.createSuccessResponse('Tournament created',tournament));

    }
    else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e) {
    console.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }
});

// Register to tournament
app.get('/tournament/register', async function(req, res) {
  
  var tournament_id = req.query.id;
  var username = req.query.username;

  try {
    if(tournament_id && username) {


      // If user doesn't exist, create it
      let user = await createUserIfNotExists(username);

      // Limit the number of tournament participants
      let participant_limiter = String("participants."+(globals.max_tournament_players-1));

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
        ).exec();

      
      if(tournament) {
        res.json(errors.createSuccessResponse('Registered tournament'));
      } else throw new errors.InvalidOperationException('Cannot register tournament');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    console.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});

app.get('/tournament/list', (req, res) => {

  try{
    Tournament.find().select('-participants').lean().exec(function (err, users) {
        return res.json(errors.createSuccessResponse('',users));
    });

  } catch(e){
    console.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});






console.log(`Running on http://${HOST}:${PORT}`);


app.set('port', process.env.PORT || PORT);


connect('mongodb://root:password123@mongodb-primary/', {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => {
    console.log('server on http://localhost:3000')
  }))
  .catch(e => console.error(e))