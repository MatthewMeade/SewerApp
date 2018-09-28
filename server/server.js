require("./config/config.js");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { mongoose } = require("./db/mongoose.js");

const { models, schemas } = require("./models/DataModels");
global.models = models;
global.schemas = schemas;

const fileRoutes = require("./routes/fileRoutes");
const generalRoutes = require("./routes/generalRoutes");
const pageRoutes = require("./routes/pageRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

app.use(cookieParser());

fileRoutes(app);
generalRoutes(app);
pageRoutes(app);
adminRoutes(app);
userRoutes(app);

app.listen(process.env.PORT, () =>
  console.log(`Started on port ${process.env.PORT}`)
);
