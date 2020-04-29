'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connection = require('./mongo/connect.js');
const zookeeper = require('./zookeeper/functions.js');
const globals = require('./lib/globals.js');
const transactions = require('./lib/transactions.js');
const errors = require('./lib/errors.js');
const logger = require('./lib/logger.js');
const util = require('./lib/util.js');
const {authenticateUser} = require('./lib/auth.js');

const {
  createUserIfNotExists,
  atomicPracticePairing,
  atomicStartTournament,
  atomicEndGame,
  resetActiveGameState,
  createGame
} = require('./lib/core.js');


const User = require('./mongo/user_model.js');
const {Tournament,TournamentRound} = require('./mongo/tournament_model.js');
const {Game, ActiveGame} = require('./mongo/game_model.js');
const Lobby = require('./mongo/lobby_model.js');



// View game info
// @TODO: Should we allow access only to a specific
// playmaster?
app.get('/playmaster/getinfo', async (req, res) => {
  
  let game_id = req.query.game_id;
  let id = req.query.id;

  let ip = util.findIpFromRequest(req);

  try {

    if(!(await zookeeper.validateServerClaim(id,ip))) throw new errors.AnauthorizedException('Access is denied');

    if(game_id && mongoose.Types.ObjectId.isValid(game_id)) {
    
      let game = await Game.findById(game_id).exec();

      if(game) {

        let result = {
          _id: game._id,
          opponents: [game.player1,game.player2],
          game_type: game.game_type
        }

       res.json(errors.createSuccessResponse('',result));

      } else throw new errors.InvalidOperationException('Game not found');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e) {
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});



// @TODO: Should we allow access only to a specific
// playmaster?
app.get('/playmaster/results', async (req, res) => {
  
  let game_id = req.query.game_id;
  let score = req.query.score;
  let id = req.query.id;

  let ip = util.findIpFromRequest(req);

  try {

    if(!(await zookeeper.validateServerClaim(id,ip))) throw new errors.AnauthorizedException('Access is denied');

    if(score && game_id && mongoose.Types.ObjectId.isValid(game_id)) {
    

      await transactions.runTransactionWithRetry(atomicEndGame, mongoose, game_id, score);

      res.json(errors.createSuccessResponse('Scores updated successfully'));

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e) {
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});


// Join practice queue
app.get('/practice/join_queue', async (req, res) => {
  
  //let username = req.query.username;
  let game_type = req.query.game_type;
  let jwt = req.query.jwt;

  try {

    let username = authenticateUser(jwt);

    if(username && game_type && globals.GAME_TYPES.includes(game_type)) 
    {
      createUserIfNotExists(username);
      let opponent = await transactions.runTransactionWithRetry(atomicPracticePairing, Lobby, username, game_type);

      if(opponent) {
        if(username == opponent) {
          throw new errors.InvalidOperationException('User already in queue');
        } else {
          createUserIfNotExists(opponent);
          let result = await transactions.runTransactionWithRetry(createGame, mongoose, username, opponent, game_type);
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
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }
});


// Join existing practice game
app.get('/practice/join_game', async (req, res) => {
  
  let game_id = req.query.game_id;
  let jwt = req.query.jwt;
  try {

    let username = authenticateUser(jwt);
    if(game_id && mongoose.Types.ObjectId.isValid(game_id)) {
    
      let game = await Game.findById(game_id).exec();

      if(username !== game.player1 && username !== game.player2) throw new errors.AnauthorizedException('Access is denied');
      let active_game = await transactions.runTransactionWithRetry(resetActiveGameState, mongoose, game);
      
      if(active_game) {
        res.json(errors.createSuccessResponse('',active_game));
      } else throw new errors.InvalidOperationException('Inactive game');
    }  
    else throw new errors.InvalidArgumentException('Wrong parameters');

  } catch(e) {
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});


//Create new tournament
app.get('/tournament/create', async (req, res) => {

  let jwt = req.query.jwt;
  let tournament_name = req.query.name;
  let game_type = req.query.game_type;
  try {

    let username = authenticateUser(jwt, 'official');

    if(tournament_name && game_type) {

      let tournament =  await Tournament.create({
        name: tournament_name,
        game_type: game_type
      });

      res.json(errors.createSuccessResponse('Tournament created',tournament));

    }
    else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e) {
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }
});





//Start tournament
app.get('/tournament/start', async (req, res) => {

  let id = req.query.id;
  let jwt = req.query.jwt;

  try {
    let username = authenticateUser(jwt, 'official');
    if(id && mongoose.Types.ObjectId.isValid(id)) {

      await transactions.runTransactionWithRetry(atomicStartTournament, mongoose, id);

      res.json(errors.createSuccessResponse('Tournament started'));

    }
    else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e) {
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }
});

// Register to tournament
app.get('/tournament/register', async function(req, res) {
  
  let tournament_id = req.query.id;
  let jwt = req.query.jwt;

  try {
    let username = authenticateUser(jwt);
    if(tournament_id && username && mongoose.Types.ObjectId.isValid(tournament_id)) {


      // If user doesn't exist, create it
      let user = await createUserIfNotExists(username);

      if(! (await canUserJoinNewGame(username))) 
        throw new errors.InvalidOperationException('Maximum number of games exceeded');
      
      let tournament = await Tournament.findById(tournament_id).exec();
      if(tournament) {

        if(tournament.participants.indexOf(username) != -1) 
          throw new errors.InvalidArgumentException('Already joined');

        if(tournament.participants.length >= globals.MAX_TOURNAMENT_PLAYERS) 
          throw new errors.InvalidArgumentException('No more players');

        tournament.participants.push(username);
        tournament.save();

        res.json(errors.createSuccessResponse('Registered tournament'));
      } else throw new errors.InvalidOperationException('Cannot register tournament');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});

app.get('/tournament/list', (req, res) => {
  
  // Mode can be 'active', 'future' or 'past'
  let mode = req.query.mode;
  let jwt = req.query.jwt;
  let page = req.query.page;
  try{
    
    authenticateUser(jwt);

    if(!mode || ['active','future','past'].indexOf(mode) == -1) 
      throw new errors.InvalidArgumentException("Wrong parameters")

    var has_started = (mode === 'active' || mode === 'past');
    var has_ended = (mode === 'active' || mode === 'future');

    Tournament.paginate({
        has_started: has_started,
        has_ended: has_ended
    }, {
      page:page,
      limit:globals.PAGINATION_LIMIT,
      lean:true,
    }).then(function(result) {
      return res.json(errors.createSuccessResponse('',result));
    });

  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});


app.get('/tournament/info', async function(req, res) {
  
  let tournament_id = req.query.id;
  let jwt = req.query.jwt;

  try {
    
    authenticateUser(jwt);

    if(tournament_id && mongoose.Types.ObjectId.isValid(tournament_id)) {

      let tournament = await Tournament.findById(tournament_id).
        populate({
          path:'rounds',
          select: {
            'date_created':1,
            'games':1
          },
          populate: {
            path: 'games',
            select: { 
              'player1': 1,
              'player2':1,
              'score':1,
              '_id': 0
            },
          }
        }).
        exec();
      if(tournament) {
        res.json(errors.createSuccessResponse('',tournament));
      } else throw new errors.InvalidOperationException('Cannot view tournament info');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});


app.get('/user/stats', async function(req, res) {
  
  let username = req.query.username;
  let jwt = req.query.jwt;
  try {

    authenticateUser(jwt);

    if(username) {

      // If user doesn't exist, create it
      let user = await User.findById(username).select(
        {"total_games":1,"total_wins":1,"total_losses":1,"total_ties":1, "rating":1}
      ).exec();

      if(user) {
        res.json(errors.createSuccessResponse('',user));
      } else throw new errors.InvalidOperationException('User not found');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});

app.get('/me/match_history', async function(req, res) {
  
  let jwt = req.query.jwt;
  try {

    let username = authenticateUser(jwt);

    if(username) {

      let user = await User.findById(username).
      read('secondaryPreferred').
      select(
        {"past_games":1}
      ).
      populate({
        path: 'past_games',
        select: {
          'has_ended': 1,
          'tournament_id':1,
          'date_created': 1,
          'score' : 1,
          'player1': 1,
          'player2': 1
        },
        populate: {
          path: 'tournament_id',
          select: {
            'name': 1,
            'date_created': 1
          }
        }
      }).
      exec();

      if(user) {
        res.json(errors.createSuccessResponse('',user['past_games']));
      } else throw new errors.InvalidOperationException('User not found');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});

app.get('/me/active_games', async function(req, res) {
  
  let jwt = req.query.jwt;
  try {

    let username = authenticateUser(jwt);

    if(username) {

      let user = await User.findById(username).
      read('secondaryPreferred').
      select(
        {"active_games":1}
      ).
      populate({
        path: 'active_games',
        select: {
          'has_ended': 1,
          'tournament_id': 1,
          'date_created': 1,
          'player1': 1,
          'player2': 1
        },
        populate: {
          path: 'tournament_id',
          select: {
            'name': 1,
            'date_created': 1
          }
        }
      }).
      exec();

      if(user) {
        res.json(errors.createSuccessResponse('',user['active_games']));
      } else throw new errors.InvalidOperationException('User not found');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});


console.log(`Running on http://${HOST}:${PORT}`);


app.set('port', process.env.PORT || PORT);


connection.then(() => app.listen(PORT, () => {
    console.log('server on http://localhost:3000')
  }))
  .catch(e => console.error(e))