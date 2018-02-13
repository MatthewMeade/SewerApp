require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

const { mongoose } = require("./db/mongoose.js");
const { Report } = require("./models/report.js");
const { Client } = require("./models/client.js");
const { User } = require("./models/user.js");
const { authenticate } = require("./middleware/authenticate.js");

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => console.log(`Started on port ${port}`));
