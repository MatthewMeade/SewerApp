var mongoose = require("mongoose");

var systemSchema = new mongoose.Schema({
  inspector: String, // TODO: Refactor into 'customSelects' model
  replacement: Boolean,
  client: mongoose.Schema.Types.ObjectId,
  location: String,
  siteDescription: String,
  waterSupply: String,
  lotStatus: String,
  lotDepth: Number,
  lotWidth: Number,
  bedrooms: Number,
  driveway: String,
  siteImages: [String],
  excavationDate: Date,
  excavationDepth: Number,
  contractor: String, // TODO: Refactor into 'customSelects' model,
  soilLayers: [
    {
      depthRange: [Number],
      depthDescription: String
    }
  ],
  percTestDate: Date,
  percTestRates: [Number],
  percTestConclusion: String,
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

var System = mongoose.model("System", systemSchema);

module.exports = { System };
