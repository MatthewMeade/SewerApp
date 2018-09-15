var mongoose = require("mongoose");

var contractorSchema = new mongoose.Schema({
  name: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Contractor = mongoose.model("Contractor", contractorSchema);

module.exports = { Contractor };
