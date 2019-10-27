const express = require("express");
var jwt = require('jsonwebtoken');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();
let bodyParser = require("body-parser");

//ENVIRONMENT VARIABLES
const PORT = process.env.PORT
const URL = process.env.URL

var userRoutes = require('./controllers/userController');
var gameRoutes = require('./controllers/gameController');

app.use(cors());
app.use(bodyParser.json());

mongoose.set('debug', true);

mongoose.connect(URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true 
});

const connection = mongoose.connection;

connection.on('error', function(err) { 
  console.log('error: ' + err.message); 
  process.exit();
});

connection.once('open', function(){
  console.log("MongoDB database connection established successfully");
});

//////////////USER ROUTES //////////////

app.use('/users', userRoutes);

//////////////GAME ROUTES //////////////

app.use('/games', gameRoutes);

app.listen(PORT, function(){
  console.log("server started on port: " + PORT);
});
