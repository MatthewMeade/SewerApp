require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.get("/", authenticate, (req, res) => {
  res.render("index.hbs", {});
});

app.get("/loginPage", (req, res) => {
  // If user is already authenticated then redirect to /
  var token = req.cookies.token;

  if (!token) {
    return res.render("login.hbs", {});
  }

  User.findByToken(token)
    .then(user => {
      if (user) {
        res.redirect("/");
      } else {
        throw "";
      }
    })
    .catch(e => {
      res.render("login.hbs", {});
    });
});

app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["password"]);

  var user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, "password");

  User.findByCredentials(body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.cookie("token", token);
        res.status(200).send({ user, token });
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});

app.post("/clients", authenticate, (req, res) => {
  var client = new Client({
    _creator: req.user._id
  });

  client.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/clients", authenticate, (req, res) => {
  Client.find({
    _creator: req.user._id
  }).then(
    clients => {
      res.send({ clients });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/clients/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Client.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(client => {
      if (!client) {
        return res.status(404).send();
      }
      res.send({ client });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete("/clients/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Client.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(client => {
      if (!client) {
        return res.status(404).send();
      }
      res.send({ client });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.patch("/clients/:id", authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(
    req.body,
    Object.keys(mongoose.model("Client").schema.obj).filter(k => k[0] !== "_")
  );

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Client.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    {
      $set: body
    },
    {
      new: true
    }
  )
    .then(client => {
      if (!client) {
        return res.status(400).send();
      }

      res.send({ client });
    })
    .catch(e => {});
});

app.patch("/clients/resetToTest", authenticate, (req, res) => {
  console.log("Dropping all clients");

  res.send();
});

app.listen(process.env.PORT, () =>
  console.log(`Started on port ${process.env.PORT}`)
);
