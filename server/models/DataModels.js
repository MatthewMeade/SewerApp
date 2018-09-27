var mongoose = require("mongoose");

const modelLoader = require("./modelLoader.js");
const modelList = [
  "system",
  "client",
  "contractor",
  "inspector",
  "spec",
  "upload",
  "invoice"
];

const schemas = {};
const models = {};
global.tables = {};
global.metaData = {};
modelList.forEach(model => {
  const modelObj = modelLoader.load(model);
  global.metaData[model] = modelLoader.loadMetadata(model);
  schemas[model] = new mongoose.Schema(modelObj);
  models[model] = mongoose.model(model, schemas[model]);
});

module.exports = { models, schemas };
