const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CreditCard = new Schema({
  userId:{
    type: Number
  },
  creditCardNumber:{
    type: String
  },
  zipCode: {
    type: Number
  },
  expDate: {
    type: String
  },
  isCurrentCard: {
    type: Boolean, default: false
  }
});


module.exports = mongoose.model('CreditCard', CreditCard);
