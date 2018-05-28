var mongoose = require("mongoose");

var specSchema = new mongoose.Schema({
  name: String,
  file: mongoose.Schema.Types.ObjectId,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Spec = mongoose.model("Spec", specSchema);

module.exports = { Spec };
