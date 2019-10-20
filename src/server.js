const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
const PORT = 4000;

var userRoutes = require('./controllers/userController');
var gameRoutes = require('./controllers/gameController');

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

//////////////USER ROUTES //////////////

app.use('/users', userRoutes);

//////////////GAME ROUTES //////////////

app.use('/games', gameRoutes);

app.listen(PORT, function(){
  console.log("server started on port: " + PORT);
});
