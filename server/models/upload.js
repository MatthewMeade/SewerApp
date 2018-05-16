var mongoose = require("mongoose");

var uploadSchema = new mongoose.Schema({
  uploadName: String,
  md5: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var Upload = mongoose.model("Upload", uploadSchema);

module.exports = { Upload };
