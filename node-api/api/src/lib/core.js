const globals = require('../globals.js');
const errors = require('./errors.js');
const zookeeper = require('../zookeeper/functions.js');

const User = require('../model/user_model.js');
const Tournament = require('../model/tournament_model.js');
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
  
    return user.active_games.length < globals.max_games;
  
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
  
  
  
  /**@TODO: Make function atomic
   * @TODO: If some user cannot join game, return the other user to queue
   * to queue.
   * Creates a game between 2 players (if possible)
   * and adds the game to the active game list 
   * of the players.
   * @returns [game,active_game] on success and false on failure
   */
  async function createGame(user1,user2,type) {
    
    if(user1 && user2 && globals.game_types.includes(type)) {
        
        if(!canUserJoinNewGame(user1) || !canUserJoinNewGame(user2))
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


  module.exports = {
      createUserIfNotExists: createUserIfNotExists,
      atomicPracticePairing: atomicPracticePairing,
      resetActiveGameState: resetActiveGameState,
      createGame: createGame
  }