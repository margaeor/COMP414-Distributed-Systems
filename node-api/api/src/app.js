'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const connect = require('./connect.js');
const zookeeper = require('./zookeeper/functions.js');
const globals = require('./globals.js');
const transactions = require('./transactions.js');
const errors = require('./errors.js');

const MAX_TOURNAMENT_PLAYERS = 3;

const User = require('./model/user_model.js');
const Tournament = require('./model/tournament_model.js');
const {Game, ActiveGame} = require('./model/game_model.js');
const Lobby = require('./model/lobby_model.js');


/** @TODO remove functional comments
 * Performs an atomic matchmaking of user.
 * First it checks the queue. If the queue is
 * empty, the user is added to the queue.
 * Otherwise, the user in the queue is
 * extracted and returned.
 * @param {Session} session 
 * @param {String} username 
 * @param {String} game_type 
 * 
 * @returns null if the user was added
 * to queue and a username if another
 * user wan in the queue
 */
function atomicPracticePairing(session, username, game_type) {

  let other_user = null;

  return Lobby.findOne({ game_type: game_type }).session(session)
  .then( async (lobby) => {
    //await new Promise(r => setTimeout(r, 8000));
    if(lobby.queue.length == 0) {
      //lobby.queue.push(username);
    } else {
      other_user = lobby.queue[0];
      if(other_user != username) {
        //lobby.queue.pop();
      }
    }
    return Promise.all([other_user,lobby.save()]);
  }).
  then( (values) =>{
    return new Promise((resolve, reject) => {
      resolve(values[0]);
    });
  });

}



/**
 * Resets the active state of a specific
 * game. If the game should be active,
 * the function creates ActiveGame object
 * and appends it to the user lists.
 * If the game should not be active, the
 * function deletes the game from user
 * lists and throws an exception.
 * @param {Game} game 
 * @returns ActiveGame if the game was
 * hasn't finished
 * @throws Exception on error
 */
async function resetActiveGameState(game) {

    if(!game) throw new errors.InvalidArgumentException('Game does not exist');

    if(!game.has_ended) {
      
      let active_game = await ActiveGame.findById(game._id).exec();
      if(active_game && (await zookeeper.isServerAvailable(active_game.server_id))) {
        await User.updateMany(
          {$or:[{_id:game.player1},{_id:game.player2}]},
          {"$addToSet": {active_games: game._id}},
          {
            runValidators: true
          }
        ).exec();
        return active_game;
      } else {
        
        var server = await zookeeper.getBestServer();
        if(!server) throw new errors.InternalErrorException('No server found for game');

        active_game = await ActiveGame.findOneAndUpdate({_id:game._id},{
          _id:game._id,
          server_id:server.id,
          server_ip:server.ip
        },{upsert:true,new:true});
        
        await User.updateMany(
          {$or:[{_id:game.player1},{_id:game.player2}]},
          {"$addToSet": {active_games: game._id}},
          {
            runValidators: true
          }
        ).exec();
      }
      return active_game;

    } else {
      await User.updateMany(
        {$or:[{_id:game.player1},{_id:game.player2}]},
        {"$pullAll": {active_games: game._id}},
        {
          runValidators: true
        }
      ).exec();
      await ActiveGame.findByIdAndDelete(game._id);
      throw new errors.InvalidOperationException('Game has ended');
    }
}

/** @TODO: Make function atomic
 * Creates a game between 2 players (if possible)
 * and adds the game to the active game list 
 * of the players.
 * @returns [game,active_game] on success and false on failure
 */
async function createGame(user1,user2,type) {
  
  if(user1 && user2 && globals.game_types.includes(type)) {
      
      let player_1 = await User.findById(user1).exec();
      let player_2 = await User.findById(user2).exec();
      if(player_1.active_games.length >= globals.max_games || player_2.active_games.length >= globals.max_games) 
      {
        throw new errors.InvalidOperationException("Maximum number of active games exceeded");
      }

      let game = await Game.create({
        player1:user1,
        player2:user2,
        game_type:type
      });
      
      let active_game = await resetActiveGameState(game);

      return [game,active_game];

  } else throw new errors.InvalidArgumentException("Wrong arguments");
}

/**
 * Creates a user by username if the user
 * doesn't exist.
 * @param {String} username 
 */
async function createUserIfNotExists(username) {
  let query = {'_id':username};
  let user_data = {'_id':username};

  let options = {upsert: true, new: true, setDefaultsOnInsert: true};

  // If user doesn't exist, create it
  let user = await User.findOneAndUpdate(query, user_data, options).exec();

  return user;
}


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
            res.json(errors.createSuccessResponse('User added to queue',active_game));
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