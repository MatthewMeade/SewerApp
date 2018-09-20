require("./config/config.js");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const fileRoutes = require("./routes/fileRoutes");
const generalRoutes = require("./routes/generalRoutes");
const pageRoutes = require("./routes/pageRoutes");
const userRoutes = require("./routes/userRoutes");

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
userRoutes(app);

app.listen(process.env.PORT, () =>
  console.log(`Started on port ${process.env.PORT}`)
);
