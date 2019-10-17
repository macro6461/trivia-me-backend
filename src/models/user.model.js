const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

let User = new Schema({
  firstName: {
    type: String, required: false, trim: true, default: null
  },
  lastName: {
    type: String, required: false, trim: true, default: null
  },
  username: {
    type: String, required: true, trim: true, default: null
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
      type: Array, required: false,
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
  }
});

User.methods.calcGamesPlayed = (cb) =>{
  return this.model('User').find({ 
    type: this.type 
  }, callback);
};

module.exports = mongoose.model('User', User);
