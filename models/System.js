const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const moment = require("moment");

const systemSchema = new mongoose.Schema(
  {
    // People Refs
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
      // required: 'You must supply a client',
    },
    inspector: {
      type: mongoose.Schema.ObjectId,
      ref: "Inspector",
      // required: 'You must supply an inspector',
    },
    contractor: {
      type: mongoose.Schema.ObjectId,
      ref: "Contractor",
      // required: 'You must supply a Contractor',
    },

    // Inspector letter
    inspectorLetterDate: Date,
    inspectorLetterBody: String,

    // Client Letter
    clientLetterDate: Date,
    clientLetterBody: String,

    // Location
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [
        {
          type: Number,
        },
      ],
      address: {
        type: String,
      },
    },
    municipality: String,
    width: Number,
    length: Number,
    water: String,

    // Photos
    sitePhotos: [String],
    mapPhotos: [String],
    floorPlans: [String],

    // Test Pits
    testPitDate: Date,
    pitDepth: Number,
    soilLayers: [
      {
        depth: Number,
        description: String,
        observations: String,
      },
    ],
    pitConclusion: String,

    // Perc Tests
    percTestLocation: String,
    percTestDate: Date,
    onSitePercRates: [
      {
        rate: Number,
      },
    ],
    offSitePercRates: [
      {
        rate: Number,
      },
    ],
    pitDrawing: String,

    // Building Info
    numBedrooms: Number,
    squareFootage: Number,
    fixtureUnits: {
      basins: Number,
      bathTubs: Number,
      bathroomGroups: Number,
      bidet: Number,
      floorDrain4in: Number,
      floorDrain3in: Number,
      floorDrain2in: Number,
      kitchenSink: Number,
      laundryStandPipe: Number,
      laundryTray: Number,
      showerHeadSingle: Number,
      showerHeadMany: Number,
      waterCloset: Number,
    },
    outlets: Number,
    trenchDepth: Number,
    importedFill: Number,
    sitePlans: [String],

    // Specs
    specs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Spec",
      },
    ],

    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "You must supply an author",
    },

    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

systemSchema.index({ location: "2dsphere" });

systemSchema.pre("find", function() {
  this.populate("client");
  this.populate("inspector");
  this.populate("contractor");
  this.populate("specs");
});

// Generate and save slug
systemSchema.pre("save", async function(next) {
  this.slug = this._id;
  next();
});

systemSchema.virtual("clientName").get(function() {
  return this.client ? this.client.firstName + " " + this.client.lastName : "";
});

systemSchema.virtual("inspectorName").get(function() {
  return this.inspector ? this.inspector.name : "";
});

systemSchema.virtual("contractorName").get(function() {
  return this.contractor ? this.contractor.name : "";
});

systemSchema.virtual("createdDate").get(function() {
  return moment(this.created).format("DD MMM YYYY");
});

module.exports = mongoose.model("System", systemSchema);
