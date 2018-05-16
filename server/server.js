require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const md5 = require("md5");
const fs = require("fs");

const { mongoose } = require("./db/mongoose.js");
const { System } = require("./models/system.js");
const { Client } = require("./models/client.js");
const { User } = require("./models/user.js");
const { Upload } = require("./models/upload");

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

// Clients
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

// Systems
// POST /systems
app.post("/systems", authenticate, (req, res) => {
  var system = new System({
    _creator: req.user._id
  });

  system.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// GET  /systems
app.get("/systems", authenticate, (req, res) => {
  System.find({
    _creator: req.user._id
  }).then(
    systems => {
      res.send({ systems });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// GET /systems/:id
app.get("/systems/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  System.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(system => {
      if (!system) {
        return res.status(404).send();
      }
      res.send({ sustem });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// DELETE /systems/:id
app.delete("/systems/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  System.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(system => {
      if (!system) {
        return res.status(404).send();
      }
      res.send({ client });
    })
    .catch(e => {
      res.status(404).send(e);
    });
});

// PATCH /systems/:id
app.patch("/systems/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  var id = req.params.id;
  var body = _.pick(
    req.body,
    Object.keys(mongoose.model("System").schema.obj).filter(k => k[0] !== "_")
  );

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  System.findOneAndUpdate(
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
    .then(system => {
      if (!system) {
        return res.status(400).send();
      }

      res.send({ system });
    })
    .catch(e => {});
});

// FILE
const upload = multer();
app.post("/file/upload", upload.single("file"), authenticate, (req, res) => {
  var file = req.file;
  var filemd5 = md5(file.buffer);
  var path = __dirname + "/uploads/" + file.originalname;

  var fileExists = fs.existsSync(path);

  if (!fileExists) {
    fs.writeFile(path, file.buffer, err => {
      if (err) {
        return res.status(500).send({ err });
      }
    });
  } else {
    if (filemd5 != md5(fs.readFileSync(path))) {
      return res.status(422).send("File with that name already exists");
    }
  }

  Upload.findOne({
    md5: filemd5,
    uploadName: file.originalname
  }).then(existingUpload => {
    if (existingUpload) {
      return res.send({ existingUpload });
    }

    var upload = new Upload({
      _creator: req.user.id,
      uploadName: file.originalname,
      md5: filemd5
    });

    upload
      .save()
      .then(
        doc => {
          res.send({ doc });
        },
        e => {
          res.status(400).send(e);
        }
      )
      .catch(e => {
        res.status(500).send(e);
      });
  });
});

app.get("/file/info/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Upload.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(upload => {
      if (!upload) {
        return res.status(404).send();
      }
      res.send({ upload });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get("/file/:name", authenticate, (req, res) => {
  const fileName = req.params.name;
  const path = __dirname + "/uploads/" + fileName;

  if (!fs.existsSync(path)) {
    return res.status(404).send();
  }

  res.download(path);
});

app.listen(process.env.PORT, () =>
  console.log(`Started on port ${process.env.PORT}`)
);
