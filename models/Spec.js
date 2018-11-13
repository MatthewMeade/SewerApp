const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const specSchema = new mongoose.Schema({
    name: String,
    file: String,
});

module.exports = mongoose.model('Spec', specSchema);
