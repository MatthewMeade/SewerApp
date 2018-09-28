// Ensure routes not created in production
var env = process.env.NODE_ENV || "development";
if (env !== "development" && env !== "test") {
  module.exports = app => console.log("Nope");
  return;
}

const { dropAll, generateAll } = require("../db/testData/testData.js");

module.exports = app => {
  app.post("/testdata", (req, res) => res.send(generateAll()));
  app.delete("/allData", (req, res) => res.send(dropAll()));
};
