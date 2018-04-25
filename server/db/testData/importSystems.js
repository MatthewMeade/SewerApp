require("../../config/config.js");

const { mongoose } = require("../../db/mongoose.js");
const { System } = require("../../models/system.js");
const fs = require("fs");

System.collection.drop(addNewSystems);

function addNewSystems() {
  const importCSV = fs
    .readFileSync("./systems.csv")
    .toString()
    .split("\n");

  const properties = importCSV[0].split(",");
  var systems = [];
  for (var i = 1; i < importCSV.length; i++) {
    if (importCSV[i] == "") {
      break;
    }

    var obj = {};
    var row = importCSV[i].split(",");
    for (var j = 0; j < properties.length; j++) {
      obj[properties[j]] = row[j];
    }
    obj["_creator"] = "5a94aea1d2ffe1321cc91939";
    // obj["_index"] = i;
    systems.push(new System(obj));
  }

  console.log(systems);

  System.collection.insert(systems, function(err, docs) {
    if (err) return console.log(err);
    mongoose.disconnect();
  });
}
