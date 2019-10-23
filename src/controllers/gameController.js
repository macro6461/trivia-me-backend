const express = require("express");
const gameRoutes = express.Router();
let Game = require('../models/game.model');

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
  
  gameRoutes.route('/add').post(function(req, res){
    let game = new Game(req.body);
    game.save()
      .then(game=>{
        res.status(200).json(game);
      })
      .catch(err=>{
        res.status(400).send(err)
      });
  });
  
  gameRoutes.route('/update/:id').post(function(req, res){
    Game.findById(req.params.id, function(err, game){
      if(err){
        res.status(404).send(err);
      } else {
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
  
  gameRoutes.route('/delete/:id').delete(function(req, res){
    Game.find({_id: req.params.id }).deleteOne().exec()
      .then(user=>{
        res.status(200).send('game deleted :)');
      })
      .catch(err=>{
        res.status(400).send(err)
      });
  });

  module.exports = gameRoutes;
  