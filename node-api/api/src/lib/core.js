const globals = require('../globals.js');
const errors = require('./errors.js');
const zookeeper = require('../zookeeper/functions.js');
const mongoose = require('mongoose');
const assert = require('assert');
const _ = require('lodash');

const User = require('../model/user_model.js');
const {Tournament,TournamentRound} = require('../model/tournament_model.js');
const {Game, ActiveGame} = require('../model/game_model.js');
const Lobby = require('../model/lobby_model.js');


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
  
  /**
   * Checks if a user can join a new game.
   * @param {String} username 
   * @returns True if the user can create game
   * and false otherwise
   */
  async function canUserJoinNewGame(username) {
  
    let user = await createUserIfNotExists(username);
  
    return user.active_games.length < globals.MAX_GAMES;
  
  }
  
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
  async function atomicPracticePairing(session, username, game_type) {
  
    let other_user = null;
    if(!(await canUserJoinNewGame(username))) throw new errors.InvalidArgumentException('User cannot join new game');
  
    return Lobby.findOne({ game_type: game_type }).session(session)
    .then( async (lobby) => {
      //await new Promise(r => setTimeout(r, 8000));
      if(lobby.queue.length == 0) {
        lobby.queue.push(username);
      } else {
        other_user = lobby.queue[0];
        if(other_user == username) throw new errors.InvalidOperationException('User already in queue');
        if(!(await canUserJoinNewGame(other_user))) {
          lobby.queue.pop();
          lobby.queue.push(username);
          other_user = null;
        } else lobby.queue.pop();
      }
      await lobby.save();
      return other_user;
    });
  }

async function atomicCreateNextRound(session, tournament, winners, losers, round_number) {


  let participants = [...winners]; // copy array
  shuffleArray(participants);

  let num_to_skip_round = (1 << 32 - Math.clz32(participants.length-1))-participants.length;
   
  let middle = Math.floor((participants.length-num_to_skip_round) / 2)

  let first_group = participants.slice(0, middle);
  let second_group = participants.slice(middle, participants.length-num_to_skip_round);

  let skippers = participants.slice(participants.length-num_to_skip_round, participants.length);

  if(winners.length == 2 && losers.length == 2) {
    assert(skippers.length == 0);

    first_group.push(losers[0]);
    second_group.push(losers[1]);
  }

  if(first_group.length != second_group.length) throw new errors.InternalErrorException('Error occured');


  let tournament_round = (await TournamentRound.create([{
    round_number: round_number,
    num_games_left: first_group.length,
    winners: [...skippers],
    losers: []
  }],{session:session}))[0];

  let games_ids = [];
  for (let i = 0; i < first_group.length; i++) {

    let user1 = first_group[i];
    let user2 = second_group[i];
    Math.random() < 0.5 && ([user1,user2]=[user2,user1]);
    
    let game = (await Game.create([{
      player1:user1,
      player2:user2,
      game_type:tournament.game_type,
      tournament_id: tournament._id,
      round_id: tournament_round._id
    }],{session:session}))[0];

    let active_game = await resetActiveGameState(session,game);
    tournament_round.games.push(game._id);
  }

  return await tournament_round.save({session});

}

async function atomicEndTournamentGame(session, game, score) {

  if(!game.tournament_id) return;

  let tournament = await Tournament.findById(game.tournament_id).session(session);
  
  if(!tournament) throw new errors.InternalErrorException('No such tournament');

  let last_round = await TournamentRound.findById(tournament.rounds.slice(-1)[0]).session(session);

  if(!last_round) throw new errors.InternalErrorException('No round exist');
  if(!last_round._id.equals(game.round_id)) throw new errors.InternalErrorException('Game refers to past round');

  
  
  await resetActiveGameState(session,game);

  if(score == 0) {
    let new_game = _.cloneDeep(game);

    new_game._doc._id = mongoose.Types.ObjectId();
    new_game.isNew = true;

    // Swap colors
    [new_game.player1,new_game.player2] = [new_game.player2,new_game.player1];

    // Signify game as unfinished
    new_game.has_finished = false;
    await new_game.save({session});
    
    last_round.games.push(new_game);

    await resetActiveGameState(session,new_game);

  } else {
    
    // Reduce counter only if there is no tie
    last_round.num_games_left--;
    if(score == 1) last_round.winners.push(game.player1);
    if(score == -1) last_round.winners.push(game.player2);

    if( last_round.num_games_left <= 0) {
      // Round finished  
      if(last_round.length >= 4) {
        // Next round
        atomicCreateNextRound(session,tournament,last_round.winners);
      } else {
        // Announce winners

      }

    }
    
  }

  
  await last_round.save({session});

  console.log("after",last_round);


  //let new_round = await atomicCreateNextRound(session,tournament,last_round.queue,last_round.round_number+1);

  //console.log(new_round);

  

  throw "SHIT EXCEPTION";

}

  /**
 * Ends the game and records the scores
 * atomicaly (must be called inside a transaction)
 * @param {Session} session 
 * @param {ObjectId} game_id 
 * @param {Number} score 
 */
async function atomicEndGame(session, game_id, score) {
  
    let game = await Game.findOneAndUpdate(
      {_id:game_id,has_ended:false},
      {has_ended:true,score:score},//@TODO fix has_ended
      {new:true})
    .session(session);
    if(!game) throw new errors.InvalidArgumentException('Game not found');

    // Create the users if they don't exist NON-ATOMICALLY
    createUserIfNotExists(game.player1);
    createUserIfNotExists(game.player2);

    if(game.tournament_id) await atomicEndTournamentGame(session,game,score);
    else {
      throw 'SHIT';
      let user1 = await User.findByIdAndUpdate(game.player1,
          {"$addToSet": {past_games: game._id}},{new:true,upsert:true})
          .session(session);
      let user2 = await User.findByIdAndUpdate(game.player2,
          {"$addToSet": {past_games: game._id}},{new:true,upsert:true})
          .session(session);
      if(game && user1 && user2) {
        await ActiveGame.findByIdAndDelete(game._id).session(session);
        user1.total_games += 1;
        user2.total_games += 1;
        if(game.score == 0) {
          user1.total_ties +=1;
          user2.total_ties +=1;
        } else if(game.score == 1) {
          user1.total_wins +=1;
          user2.total_losses +=1;
        } else if(game.score == -1) {
          user1.total_losses +=1;
          user2.total_wins +=1;
        } else throw new errors.InvalidArgumentException('Wrong score value');
        user1.past_games.indexOf(game_id) === -1 && user1.past_games.push(game_id);
        user2.past_games.indexOf(game_id) === -1 && user2.past_games.push(game_id);
        await user1.save({ session });
        await user2.save({ session });
      } else throw new errors.InvalidArgumentException('Invalid fields');
    }
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
  async function resetActiveGameState(session,game) {
  
      if(!game) throw new errors.InvalidArgumentException('Game does not exist');
  
      if(!game.has_ended) {
        
        let active_game = await ActiveGame.findById(game._id).session(session);
        if(active_game && (await zookeeper.isServerAvailable(active_game.server_id))) {
          await User.updateMany(
            {$or:[{_id:game.player1},{_id:game.player2}]},
            {"$addToSet": {active_games: game._id}},
            {
              runValidators: true
            }
          ).session(session);
          return active_game;
        } else {
          
          var server = await zookeeper.getBestServer();
          if(!server) throw new errors.InternalErrorException('No server found for game');
  
          active_game = await ActiveGame.findOneAndUpdate({_id:game._id},{
            _id:game._id,
            server_id:server.id,
            server_ip:server.ip
          },{upsert:true,new:true}).session(session);
          
          await User.updateMany(
            {$or:[{_id:game.player1},{_id:game.player2}]},
            {"$addToSet": {active_games: game._id}},
            {
              runValidators: true
            }
          ).session(session);
        }
        return active_game;
  
      } else {
        await ActiveGame.findByIdAndDelete(game._id).session(session);
        await User.updateMany(
          {$or:[{_id:game.player1},{_id:game.player2}]},
          {"$pullAll": {active_games: [game._id]}},
          {
            runValidators: true
          }
        ).session(session);
        return false;
      }
  }
  
  
  
  /**@TODO: Make function atomic
   * Creates a game between 2 players (if possible)
   * and adds the game to the active game list 
   * of the players.
   * @returns [game,active_game] on success and false on failure
   */
  async function createGame(session,user1,user2,type) {
    
    if(user1 && user2 && globals.GAME_TYPES.includes(type)) {
        
        if(!canUserJoinNewGame(user1) || !canUserJoinNewGame(user2))
        {
          throw new errors.InvalidOperationException("Maximum number of active games exceeded");
        }
        console.log(user1,user2,type);
        let game = await Game.create([{
          player1:user1,
          player2:user2,
          game_type:type
        }],{session});
        
        if(!Array.isArray(game)) throw new errors.InternalErrorException("Could not create game");
        let active_game = await resetActiveGameState(session,game[0]);

        if(!active_game) throw new errors.InvalidOperationException('Game has ended');
  
        return [game[0],active_game];
  
    } else throw new errors.InvalidArgumentException("Wrong arguments");
  }


  module.exports = {
      createUserIfNotExists: createUserIfNotExists,
      atomicPracticePairing: atomicPracticePairing,
      atomicEndTournamentGame: atomicEndTournamentGame,
      atomicEndGame: atomicEndGame,
      resetActiveGameState: resetActiveGameState,
      createGame: createGame
  }