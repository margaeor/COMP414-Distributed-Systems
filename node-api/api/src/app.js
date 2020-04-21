'use strict';

const PORT = 3000;
const HOST = '0.0.0.0';

const express = require('express');
const app = express();
const connect = require('./connect.js');

const MAX_TOURNAMENT_PLAYERS = 3;

var User = require('./user_model.js');
var Tournament = require('./tournament_model.js')


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

app.get('/tournament/join', async function(req, res) {
  
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
      return res.send('Cannot join tournament');
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