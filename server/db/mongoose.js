const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

mongoose.promise = global.promise;
mongoose.connect(process.env.MONGODB_URI);

autoIncrement.initialize(mongoose.connection);

module.exports = { mongoose };
