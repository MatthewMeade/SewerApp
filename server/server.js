require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const hbs = require("hbs");

const { mongoose } = require("./db/mongoose.js");
const { Report } = require("./models/report.js");
const { Client } = require("./models/client.js");
const { User } = require("./models/user.js");
const { authenticate } = require("./middleware/authenticate.js");

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

app.set("view engine", "hbs");
app.set("views", __dirname + "\\views");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index.hbs", {});
});

app.listen(process.env.PORT, () =>
  console.log(`Started on port ${process.env.PORT}`)
);
