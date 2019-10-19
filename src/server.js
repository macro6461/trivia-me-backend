const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const userRoutes = express.Router();
const gameRoutes = express.Router();
const PORT = 4000;

let User = require('./models/user.model');
let Game = require('./models/game.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/trivia-me', {useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('error', function(err) { 
  console.log('error: ' + err.message); 
  process.exit();
});

connection.once('open', function(){
  console.log("MongoDB database connection established successfully");
});

userRoutes.route('/').get(function(req, res){
  User.find(function(err, users){
    if(err){
      res.status(400).send(err);
    } else {
      res.json(users)
    }
  });
});

userRoutes.route('/:id').get(function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      res.status(400).send(err)
    } else {
      var response = {}
      response.user = user
      if (user){
        findGames(req.params.id, user, response, res);
      } else {
        res.status(400).send('user not found :(')
      }
    }
  });
});

userRoutes.route('/add').post(function(req, res){
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  let user = new User(req.body);
  user.save()
    .then(user=>{
      res.status(200).json(user);
    })
    .catch(err=>{
      res.status(400).send(err)
    });
});

userRoutes.route('/update/:id').post(function(req, res){
  User.findOne({_id : req.params.id}, function(err, user){
    if(!user){
      res.status(404).send(err);
    } else {

      var response = {};

      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      user.age = req.body.age;

      response.user = user

      findGames(req.params.id, user, response, res)
    }

  });
});

userRoutes.route('/delete/:id').delete(function(req, res){
  User.find({_id: req.params.id }).remove().exec()
    .then(user=>{
      res.status(200).send('account deleted :)');
    })
    .catch(err=>{
      res.status(400).send(err)
    });
});

app.use('/users', userRoutes);

//////////////GAME ROUTES //////////////

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

//FIND USER GAMES HELPER
const findGames = (id, user, response, res) =>{
  Game.find({owner: id}, (err, games) => {
    if (err){
      res.status(400).send(err);
    } else {
      user.games = games.map((game)=>{return game._id});
      response.games = games
      user.save().then(user=>{
        res.json(response);
      })
      .catch(err=>{
        res.status(400).send(err);
      });
    }
  })
};

app.use('/games', gameRoutes);

app.listen(PORT, function(){
  console.log("server started on port: " + PORT + " teehee");
});
