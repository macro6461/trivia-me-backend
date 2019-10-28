const express = require("express");
const gameRoutes = express.Router();
let Game = require('../models/game.model');
let User = require('../models/user.model');

gameRoutes.route('/').get(function(req, res){
    Game.find(function(err, games){
      if(err){
        res.status(400).send(err);
      } else {
        res.json(games)
      }
    });
  });
  
  gameRoutes.route('/:id').get(function(req, res){
    Game.findById(req.params.id, function(err, game){
      if(err){
        res.status(400).send(err);
      } else {
        res.json(game);
      }
    });
  });
  
  gameRoutes.route('/add').post( async function(req, res){
    try {
      var user = await User.findOne({ _id: req.body.owner })
      let game = new Game(req.body);
      game.owner = { _id: req.body.owner }
        if (!user){
          res.status(400).send('user not found.')
        } else {
          await game.save()
          await user.addGame(game._id);
          if (!game){
            res.status(400).send('game cannot be created');
          } else {
            res.status(200).json(game);
          }
        }
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  gameRoutes.route('/update/:id').post(function(req, res){
    Game.findById(req.params.id, function(err, game){
      if(err){
        res.status(404).send(err);
      } else {
        console.log(req.body.owner)
        game.owner = req.body.owner;
        game.name = req.body.name;
        game.questions = req.body.questions ? req.body.questions : game.questions;
        game.qTime = req.body.qTime;
        game.expDate = req.body.expDate;
        game.isPrivate = req.body.isPrivate;
        game.isClosed = req.body.isClosed;
  
        game.save().then(game=>{
          res.json(game);
        })
        .catch(err=>{
          res.status(400).send(err);
        });
      }
    });
  });
  
  gameRoutes.route('/delete/:id').delete( async function(req, res){
    try {
      var game = await Game.findOne({_id: req.params.id })
      var owner =  await User.findOne({ _id: game.owner })
      await owner.removeGame(req.params.id)
      if (!owner){
        res.status(400)('could not delete game from owner')
      } else {
        Game.find({_id: req.params.id }).deleteOne().exec()
          .then(user=>{
            res.status(200).send('game deleted :)');
          })
          .catch(err=>{
            res.status(400).send(err)
          });
      }
     } catch (error) {
      res.status(500).send(error);
    }
  });

  gameRoutes.route('/deleteAll').delete(function(req, res){
    Game.deleteMany({}, function(err) {
      if (err) {
        console.log(err)
      } else {
        res.end('all games gone.');
      }
    })
  });

  module.exports = gameRoutes;

//   {
//     "name": "DOOPIE",
//     "timed": false,
//     "owner": "5daca0171febbb25f2c929dd",
//     "questions": [
//     {
//         "id": 0,
//         "qTitle": "When is Independence Day?",
//         "qAnswers": [
//             {"aId": 0, "aContent": "July 18th"},
//             {"aId": 1, "aContent": "July 19th"},
//             {"aId": 2, "aContent": "July 30th"},
//             {"aId": 3, "aContent": "July 4th"}
//         ],
//         "answer": 3,
//         "correct": null
//     },
//     {
//         "id": 1,
//         "qTitle": "When is Christmas Day?",
//         "qAnswers": [
//             {"aId": 0, "aContent": "July 18th"},
//             {"aId": 1, "aContent": "July 19th"},
//             {"aId": 2, "aContent": "December 25th"},
//             {"aId": 3, "aContent": "December 31st"}
//         ],
//         "answer": 2,
//         "correct": null
//     }
// ]}
  