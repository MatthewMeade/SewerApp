var mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

var Client = mongoose.model("Client", {
  firstName: {
    type: String,
    // required: true,
    minlength: 1,
    trim: true
  },
  lastName: {
    type: String,
    // required: true,
    minlength: 1,
    trim: true
  },
  title: {
    type: String,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    minlength: 1,
    trim: true
  },
  homePhone: {
    type: String,
    minlength: 1,
    trim: true
  },
  mobilePhone: {
    type: String,
    minlength: 1,
    trim: true
  },
  streetAddress: {
    type: String,
    minlength: 1,
    trim: true
  },
  city: {
    type: String,
    minlength: 1,
    trim: true
  },
  province: {
    type: String,
    minlength: 2,
    maxlength: 2,
    trim: true,
    default: "NL"
  },
  postCode: {
    type: String,
    minlength: 7,
    maxlength: 7,
    trim: true
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _index: {
    type: Number
  }
});

Client.schema.plugin(autoIncrement.plugin, {
  model: "Client",
  field: "_index",
  startAt: 1
});

module.exports = { Client };
