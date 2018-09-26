const yml = require("js-yaml");
const fs = require("fs");
var mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

module.exports.loadMetadata = modelName => {
  let file = fs.readFileSync(
    __dirname + "/metadata/" + modelName + ".yml",
    "UTF-8"
  );

  return yml.load(file);
};

module.exports.load = modelName => {
  let file = fs.readFileSync(
    __dirname + "/metadata/" + modelName + ".yml",
    "UTF-8"
  );

  let meta = yml.load(file).fields;
  let model = {};

  for (key in meta) {
    let item = meta[key];
    model[key] = {};

    switch (item.type) {
      case "ClientObject":
      case "InspectorObject":
      case "ContractorObject":
      case "SpecObject":
        model[key].type = ObjectId;
        break;

      case "fileList":
        model[key].type = [ObjectId];
        break;

      case "Boolean":
        model[key].type = Boolean;
        break;

      case "String":
      case "templateString":
        model[key].type = String;
        break;

      case "Number":
        model[key].type = Number;
        break;

      case "Date":
        model[key].type = Date;
        break;

      case "Date":
        model[key].type = Date;
        break;

      case "ObjectArray":
      case "DataTable":
        let obj = {};
        for (subItemKey in item.data) {
          let subItem = item.data[subItemKey];
          obj[subItemKey] = subItem.type == "Number" ? Number : String;
        }
        model[key] = [obj];
        break;

      default:
        break;
    }
  }

  model._creator = {
    type: ObjectId,
    required: true
  };

  return model;
};

module.exports.loadTable = modelName => {
  let file = fs.readFileSync(
    __dirname + "/metadata/" + modelName + ".yml",
    "UTF-8"
  );

  return yml.load(file).defaultTableHeadings;
};
