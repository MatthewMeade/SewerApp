const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const systemSchema = new mongoose.Schema({
    // People Refs
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'client',
        // required: 'You must supply a client',
    },
    inspector: {
        type: mongoose.Schema.ObjectId,
        ref: 'inspector',
        // required: 'You must supply an inspector',
    },
    contractor: {
        type: mongoose.Schema.ObjectId,
        ref: 'contractor',
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
            default: 'Point',
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
            ref: 'Spec',
        },
    ],
});

systemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('system', systemSchema);
