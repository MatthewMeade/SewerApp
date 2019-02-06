const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const inspectorSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Inspector", inspectorSchema);
