var mongoose = require("mongoose");

var contractoSchema = new mongoose.Schema({
  name: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Contractor = mongoose.model("Contractor", contractoSchema);

module.exports = { Contractor };
