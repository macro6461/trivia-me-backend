const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;

let User = new Schema({
  firstName: {
    type: String, required: false, trim: true, default: null
  },
  lastName: {
    type: String, required: false, trim: true, default: null
  },
  username: {
    type: String, required: true, trim: true, default: null,
    unique: true
  },
  password: {
    type: String, required: true, trim: true, default: null
  },
  email: {
    type: String, required: true, trim: true, default: null,
    unique: true,
    lowercase: true,
    validate: (value) => {
        return validator.isEmail(value)
    }
  },
  age: {
    type: Number, required: false, trim: true, default: null
  },
  creditCards:{
      type: Array, required: false, default: null
  },
  games:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Game",
      required: false,
      default: []
  },
  statistics:{
    required: false,
    gamesPlayed: {
      type: Number, required: false, default: null
    },
    playerScore: {
        type: Number, required: false, default: null
    },
    avgGameScore:{
      type: Number, required: false, default: null
    }
  },
  hasAds: {
      type: Boolean, required: false, default: true
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
}]
});

User.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}


User.methods.addGame = async function(id) {
  const user = this;
  var games = user.games;
  games.push(id);
  user.games = games;
  user.markModified('games');
  user.save()
  return user
}

User.methods.removeGame = async function(id) {
  const user = this;
  var games = user.games;
  games = games.filter((x)=>{
    console.log("x: " + x)
    console.log("id: " + id)
    console.log(x != id);
    return x != id
  })
  console.log(games)
  user.games = games;
  user.markModified('games');
  user.save()
  return user
}


User.methods.calcGamesPlayed = async function() {
  const user = this;
};
module.exports = mongoose.model('User', User);
