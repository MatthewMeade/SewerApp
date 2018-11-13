const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const inspectorSchema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('Inspector', inspectorSchema);
