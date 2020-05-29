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
  createGame,
  canUserJoinNewGame
} = require('./lib/core.js');


const User = require('./mongo/user_model.js');
const {Tournament,TournamentRound, ActiveTournament} = require('./mongo/tournament_model.js');
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

    // if(!(await zookeeper.validateServerClaim(id,ip))) throw new errors.AnauthorizedException('Access is denied');

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

    //if(!(await zookeeper.validateServerClaim(id,ip))) throw new errors.AnauthorizedException('Access is denied');

    if(score && game_id && mongoose.Types.ObjectId.isValid(game_id)) {
    

      //await transactions.runTransactionWithRetry(atomicEndGame, mongoose, game_id, score);
      await atomicEndGame(null,game_id, score);

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
          //let result = await transactions.runTransactionWithRetry(createGame, mongoose, username, opponent, game_type);
          let result = await createGame(null,username,opponent,game_type);
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
app.get('/join_game', async (req, res) => {
  
  let game_id = req.query.game_id;
  let jwt = req.query.jwt;
  try {

    let username = authenticateUser(jwt);
    if(game_id && mongoose.Types.ObjectId.isValid(game_id)) {
    
      let game = await Game.findById(game_id)
      .populate({
        path: 'tournament_id player1 player2',
        select: {
          'name': 1,
          'date_created': 1,
          'game_type':1,
          'has_started': 1,
          'has_ended':1,
          'rating':1
        }}).lean().exec();

      if(username !== game.player1._id && username !== game.player2._id) throw new errors.AnauthorizedException('Access is denied');
      //let active_game = await transactions.runTransactionWithRetry(resetActiveGameState, mongoose, game);
      let active_game = await resetActiveGameState(null,game);
      if(active_game) {
        game['server_id'] = active_game.server_id;
        game['server_ip'] = active_game.server_ip;
        
        res.json(errors.createSuccessResponse('',game));
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
  let max_players = req.query.max_players;
  let game_type = req.query.game_type;
  try {

    let username = authenticateUser(jwt, 'official');

    if(tournament_name && game_type && max_players) {

      try {
        max_players = parseInt(max_players);
        
      } catch(e) {
        throw new errors.InvalidArgumentException('Wrong max players');
      }
      
      if(!max_players) throw new errors.InvalidArgumentException('Wrong max players');

      let mx = globals.MAX_TOURNAMENT_PLAYERS;
      let mn = globals.MIN_TOURNAMENT_PLAYERS;
      if(max_players < mn || max_players > mx) 
        throw new errors.InvalidArgumentException('Max players must be between '+String(mn)+' and '+String(mx));

      let tournament =  await Tournament.create({
        name: tournament_name,
        game_type: game_type,
        max_players:max_players
      });


      let active = await ActiveTournament.findByIdAndUpdate(
        tournament._id,{_id:tournament._id},{upsert:true,new:true}).exec();

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
        if(tournament.has_started)
          throw new errors.InvalidArgumentException('Tournament already started');

        if(tournament.participants.indexOf(username) != -1) 
          throw new errors.InvalidArgumentException('Already joined');

        if(tournament.participants.length >= tournament.max_players) 
          throw new errors.InvalidArgumentException('No more players');

        tournament.participants.push(username);
        await tournament.save();
        
        user.tournaments.push(tournament._id);
        await user.save();

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

app.get('/me/in_queue', async function(req, res) {
  
  let game_type = req.query.game_type;
  let jwt = req.query.jwt;
  try {

    let username = authenticateUser(jwt);

    if(game_type && username && globals.GAME_TYPES.includes(game_type)) {

      let query = {'game_type':game_type};

      let options = {upsert: true, new: true, setDefaultsOnInsert: true};

      // If lobby doesn't exist, create it
      let lobby = await Lobby.findOneAndUpdate(query, query, options)//.read('secondaryPreferred')
      .exec();
      
      if(lobby) {
        let queue = lobby.queue;
        res.json(errors.createSuccessResponse('',queue.indexOf(username) != -1));
      } else throw new errors.InvalidOperationException('Lobby not found');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});

// @TODO make this less costly
app.get('/me/match_history', async function(req, res) {
  
  let jwt = req.query.jwt;
  try {

    let username = authenticateUser(jwt);

    if(username) {

      let user_past_games = await User.findById(username).
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
          'player2': 1,
          'game_type': 1
        },
        options: { sort: '-date_created' },
        populate: {
          path: 'tournament_id',
          select: {
            'name': 1,
            'date_created': 1
          },
          options: { sort: '-date_created' }
        }
      }).
      exec();

      let user_tournaments = await User.findById(username).
      read('secondaryPreferred').
      select(
        {"tournaments":1}
      ).
      populate({
        path: 'tournaments',
        select: {
          'name': 1,
          'date_created': 1,
          'game_type':1,
          'has_started': 1,
          'has_ended':1,
          'rounds':1,
          'participants':1,
          'leaderboard':1,
          'max_players':1
        },
        match: { 'has_ended': {$eq: true}},
        populate: {
          path: 'rounds',
          select: {
            'games': 1,
            '_id': 0
          },
          populate: {
            path: 'games',
            select: {
              'has_ended': 1,
              'tournament_id':1,
              'date_created': 1,
              'score' : 1,
              'player1': 1,
              'player2': 1
            }
          },
        },
        options: { sort: '-date_created' }
      }).
      exec();


      if(user_past_games && user_tournaments) {
        let data = {
          past_games : user_past_games['past_games'],
          user_tournaments : user_tournaments['tournaments']
        };
        res.json(errors.createSuccessResponse('',data));
      } else res.json(errors.createSuccessResponse('',{
        "past_games":[],
        "user_tournaments":[]
      }));
      //throw new errors.InvalidOperationException('User not found');

    } else throw new errors.InvalidArgumentException('Wrong parameters');
  } catch(e){
    logger.log(e);
    return res.json(errors.convertExceptionToResponse(e));
  }

});

// @TODO add max players to tournament
app.get('/me/lobby', async function(req, res) {
  
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
          'player2': 1,
          'game_type': 1
        },
        populate: {
          path: 'tournament_id round_id',
          select: {
            'name': 1,
            'date_created': 1,
            'round_number': 1
          }
        }
      }).
      exec();
      

      let active_tournaments = await ActiveTournament.find().
      read('secondaryPreferred').
      select(
        {"active_games":1}
      ).
      populate({
        path: '_id',
        select: {
          'name': 1,
          'date_created': 1,
          'has_started':1,
          'has_ended':1,
          'participants':1,
          'game_type':1,
          'max_players':1
        },
      }).lean().exec();

      active_tournaments = active_tournaments.map(x => x['_id']);
      active_tournaments = active_tournaments.filter(x => 
        !x['has_ended'] && 
        (!x['has_started'] || x['participants'].indexOf(username) != -1
      ));
      active_tournaments = active_tournaments.map(x => {
        let l = x;
        l['joined'] = (x['participants'].indexOf(username) != -1);
        l['players'] = x['participants'].length;
        delete l.participants; 
        return l;
      });
      
      if(user) {
        let active_games = user['active_games'];
        let data = {
          active_games: active_games,
          active_tournaments: active_tournaments
        };
        res.json(errors.createSuccessResponse('',data));
      } else res.json(errors.createSuccessResponse('',{
        "active_games":[],
        "active_tournaments":(active_tournaments ? active_tournaments : [])
      }));
      //else throw new errors.InvalidOperationException('User not found');

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
      } else res.json(errors.createSuccessResponse('',[]));
      //else throw new errors.InvalidOperationException('User not found');

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
})).catch(e => {
  process.exit(1);
})
  //.catch(e => console.error(e))