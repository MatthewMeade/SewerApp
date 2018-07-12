require("../../config/config.js");

const { mongoose } = require("../../db/mongoose.js");
const { Client } = require("../../models/client.js");
const fs = require("fs");

Client.collection.drop(addNewClients);

function addNewClients() {
  const importCSV = fs
    .readFileSync("./clients.csv")
    .toString()
    .split("\n");

  const properties = importCSV[0].split(",");
  var clients = [];
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
    clients.push(new Client(obj));
  }

  Client.collection.insert(clients, function(err, docs) {
    if (err) return console.log(err);
    mongoose.disconnect();
  });
}
