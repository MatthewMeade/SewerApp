const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const contractorSchema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('Contractor', contractorSchema);
