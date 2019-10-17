const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
const userRoutes = express.Router();
const gameRoutes = express.Router();
const PORT = 4000;

let User = require('./models/user.model');
let Game = require('./models/game.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/trivia-me', {useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});

const connection = mongoose.connection;

connection.on('error', function(err) { 
  console.log('***error: ' + err.message); 
  process.exit();
});

connection.once('open', function(){
  console.log("MongoDB database connection established successfully");
});

userRoutes.route('/').get(function(req, res){
  User.find(function(err, users){
    if(err){
      console.log(err);
    } else {
      res.json(users)
    }
  });
});

userRoutes.route('/:id').get(function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

userRoutes.route('/add').post(function(req, res){
  let user = new User(req.body);
  user.save()
    .then(user=>{
      res.status(200).json({user});
    })
    .catch(err=>{
      console.log(err);
      res.status(400).send('signing up failed')
    });
});

userRoutes.route('/update/:id').post(function(req, res){
  User.findOne({_id : req.params.id}, function(err, user){
    if(!user){
      res.status(404).send('data not found');
    } else {

      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      user.age = req.body.age;
      user.creditCards = req.body.creditCards;

      //FIND ALL OF USERS GAMES
      Game.find({owner: user._id}, function(err, games){
        if(err){
          console.log(err)
          user.save().then(user=>{
            res.json(user);
          })
          .catch(err=>{
            res.status(400).send(err);
          });
        } else {
          user.games = games.map((game)=>{return game._id});
          user.save().then(user=>{
            res.json(user);
          })
          .catch(err=>{
            res.status(400).send(err);
          });
        }
      })
    }

  });
});

app.use('/users', userRoutes);

//////////////GAME ROUTES //////////////

gameRoutes.route('/').get(function(req, res){
  Game.find(function(err, games){
    if(err){
      console.log(err);
    } else {
      console.log(games)
      res.json(games)
    }
  });
});

gameRoutes.route('/:id').get(function(req, res){
  Game.findById(req.params.id, function(err, game){
    if(err){
      console.log(err);
    } else {
      res.json(game);
    }
  });
});

gameRoutes.route('/add').post(function(req, res){
  console.log(req.body);
  console.log(req.headers)
  let game = new Game(req.body);
  game.save()
    .then(game=>{
      res.status(200).json({'game': 'Game made successfully'});
    })
    .catch(err=>{
      res.status(400).send('Game made failed')
    });
});

gameRoutes.route('/update/:id').post(function(req, res){
  Game.findById(req.params.id, function(err, game){
    if(!game){
      res.status(404).send('data not found');
    } else {
      game.owner = req.body.owner;
      game.name = req.body.name;
      game.questions = req.body.questions ? req.body.questions : game.questions;
      game.qTime = req.body.qTime;
      game.expDate = req.body.expDate;
      game.isPrivate = req.body.isPrivate;
      game.isClosed = req.body.isClosed;

      game.save().then(game=>{
        res.json('Update successful');
      })
      .catch(err=>{
        res.status(400).send('Update failed');
      });
    }
  });
});

app.use('/games', gameRoutes);

app.listen(PORT, function(){
  console.log("server started on port: " + PORT + " teehee");
});
