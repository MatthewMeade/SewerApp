var mongoose = require("mongoose");

const modelLoader = require("./modelLoader.js");
const modelList = [
  "system",
  "client",
  "contractor",
  "inspector",
  "spec",
  "system",
  "upload"
];

const schemas = {};
modelList.forEach(model => {
  const modelObj = modelLoader.load(model);
  schemas[model] = new mongoose.Schema(modelObj);
});

module.exports = { schemas };
