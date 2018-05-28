var mongoose = require("mongoose");

var inspectorSchema = new mongoose.Schema({
  name: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Inspector = mongoose.model("Inspector", inspectorSchema);

module.exports = { Inspector };
