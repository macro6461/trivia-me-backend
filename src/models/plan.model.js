const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Plan = new Schema({
  plan_name:{
    type: String, required: true, trim: true
  },
  access:{
    type: Number, required: true, trim: true, default: 1 //from 1 to 3
  },
  hasAds:{
    type: Boolean, required: true, default: true
  }
});

module.exports = mongoose.model('Plan', Plan);
