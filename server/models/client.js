var mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

var clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  homePhone: {
    type: String,
    default: ""
  },
  mobilePhone: {
    type: String,
    default: ""
  },
  streetAddress: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  province: {
    type: String,
    default: ""
  },
  postCode: {
    type: String,
    default: ""
  },
  notes: {
    type: String,
    default: ""
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Client = mongoose.model("Client", clientSchema);

module.exports = { Client };
