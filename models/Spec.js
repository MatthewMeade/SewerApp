const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const specSchema = new mongoose.Schema({
  name: String,
  file: String,

  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "You must supply an author"
  },

  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Spec", specSchema);
