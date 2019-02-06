const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const contractorSchema = new mongoose.Schema({
  name: String,
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

module.exports = mongoose.model("Contractor", contractorSchema);
