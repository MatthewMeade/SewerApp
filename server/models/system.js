var mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

var systemSchema = new mongoose.Schema({
  // General
  client: ObjectId,
  inspector: ObjectId,
  contractor: ObjectId,
  approved: Boolean,
  paid: Boolean,
  report: ObjectId,
  invoice: ObjectId,
  receipt: ObjectId,

  // Lot
  municipality: String,
  lat: Number,
  long: Number,
  width: Number,
  length: Number,
  water: String,

  // Inspector Letter
  inspectorLetterDate: Date,
  letterletterBody: String,

  // Photos
  sitePhotos: [ObjectId],
  mapPhotos: [ObjectId],
  floorPlans: [ObjectId],

  // Client Letter
  clientLeterDate: Date,
  clientLetterBody: String,

  // Test pits
  testPitDate: Date,
  pitDepth: Number,
  layers: [
    {
      depth: Number,
      description: String,
      observations: String
    }
  ],
  conslusion: String,
  pitPictures: [ObjectId],

  // Perc Tests
  percTestLocation: String,
  perctestDate: Date,
  onSitePercRates: [{ perc: Number }],
  offSitePercRates: [{ perc: Number }],
  pitDrawing: ObjectId,

  // Design Calculations
  numBedrooms: Number,
  squareFootage: Number,
  fixtureUnits: [
    {
      basin: Number,
      bathtub: Number,
      bathroomGroup: Number,
      bidet: Number,
      floorDrain4in: Number,
      floorDrain3in: Number,
      floorDrain2in: Number,
      kitchenSink: Number,
      laundryStandPipe: Number,
      laundryTray: Number,
      showerHeadSingle: Number,
      showerHeadMany: Number,
      waterCloset: Number
    }
  ],
  outlets: Number,
  trenchDepth: Number,
  importedFill: Number,
  sitePlans: [{ plan: ObjectId }],

  // Specs
  specList: [{ spec: ObjectId }],

  _creator: {
    type: ObjectId,
    required: true
  }
});

var System = mongoose.model("System", systemSchema);

module.exports = { System };
