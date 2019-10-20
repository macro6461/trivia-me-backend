const express = require("express");
const bcrypt = require("bcryptjs");
const userRoutes = express.Router();
let User = require('../models/user.model');

//GET ALL USERS
userRoutes.route('/').get(function(req, res){
    User.find(function(err, users){
      if(err){
        res.status(400).send(err);
      } else {
        res.json(users)
      }
    });
  });
  
  //GET ONE USER
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
  
  //REGISTER USER/CREATE ACCOUNT
  userRoutes.route('/register').post(function(req, res){
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
  
  
  //USER LOGIN
  userRoutes.route("/login").post(async (req, res) => {
    try {
      var user = await User.findOne({ username: req.body.username })
      .then(user=>{
        if (!user){
          return res.status(400).send("The username does not exist")
        } 
        if (!bcrypt.compareSync(req.body.password, user.password)){
          return res.status(400).send( "The password is invalid" )
        }
        return res.status(200).send("The username and password combination is correct!");
      }).catch(err=>{
        res.status(500).send(err)
      })
    } catch (error) {
      response.status(500).send(error);
    }
  });
  
  //EDIT USER
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
  
  //DELETE ACCOUNT
  userRoutes.route('/delete/:id').delete(function(req, res){
    User.find({_id: req.params.id }).deleteOne().exec()
      .then(user=>{
        res.status(200).send('account deleted :)');
      })
      .catch(err=>{
        res.status(400).send(err)
      });
  });

  module.exports = userRoutes;