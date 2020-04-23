'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const connect = require('./connect.js');
const zookeeper = require('./zookeeper/functions.js');
const globals = require('./globals.js');
const transactions = require('./transactions.js');

const MAX_TOURNAMENT_PLAYERS = 3;

const User = require('./model/user_model.js');
const Tournament = require('./model/tournament_model.js');
const {Game, ActiveGame} = require('./model/game_model.js');
const Lobby = require('./model/lobby_model.js');


/**
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


/** @TODO: Make function atomic
 * Creates a game between 2 players (if possible)
 * and adds the game to the active game list 
 * of the players.
 * @returns 
 */
async function createGame(user1,user2,type) {
  
  if(user1 && user2 && globals.game_types.includes(type)) {

    try {
      
      let player_1 = await User.findById(user1).exec();
      let player_2 = await User.findById(user2).exec();
      if(player_1.active_games.length >= globals.max_games || player_2.active_games.length >= globals.max_games) 
      {
        throw "Maximum number of active games exceeded";
      }

      let game = await Game.create({
        player1:user1,
        player2:user2,
        game_type:type
      });
      
      var server = await zookeeper.getBestServer();

      if(server) {
        let active_game = await ActiveGame.create({
          _id:game._id,
          server_id:server.id,
          server_ip:server.ip
        });
        
        await User.updateMany(
          {$or:[{_id:user1},{_id:user2}]},
          {"$addToSet": {active_games: game._id}},
          {
            runValidators: true
          }
        ).exec();
        return [game,active_game];
      } else {
        console.log('No play server found');
        await Game.findByIdAndDelete(game._id).exec();
        return false;
      }

      return false;
    } catch(e) {
      console.log(e);
      return false;
    }

  }
}

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


app.get('/practice/join_queue', async (req, res) => {
  
  var username = req.query.username;
  var game_type = req.query.game_type;

  if(username && game_type && globals.game_types.includes(game_type)) {

    try {
      createUserIfNotExists(username);
      let opponent = await transactions.runTransactionWithRetry(atomicPracticePairing, Lobby, username, game_type);

      if(opponent) {
        if(username == opponent) {
          res.send('Already in queue');
        } else {
          createUserIfNotExists(opponent);
          let result = await createGame(username,opponent,game_type);
          if(result) {
            let active_game = result[1];
            res.json(active_game);
          } 
          else res.send('Error creating game');
        }
      } else {
        res.send('Added to queue');
      }
      
    } catch(e) {
      return res.send(e);
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


app.get('/practice/join', async (req, res) => {
  
  var game_id = req.query.game_id;

  if(game_id) {

    try {
      
      let active_game = await ActiveGame.findById(game_id).exec();
      
      if(active_game) {
        let server_exists = await zookeeper.isServerAvailable(active_game.server_id);
        if(server_exists) {

          // Server is available so return it
          return res.json(active_game);
        } else {

          // We need a new server
          var server = await zookeeper.getBestServer();

          if(server) {

            active_game.server_id = server.id;
            active_game.server_ip = server.ip;
            active_game.save();

            res.json(active_game);
          } else throw "No server found";
        }
      }
      
    } catch(e) {
      return res.send(e);
    }

  }
  else return res.send('Wrong parameters');
});


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


connect('mongodb://root:password123@mongodb-primary/', {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => {
    console.log('server on http://localhost:3000')
  }))
  .catch(e => console.error(e))