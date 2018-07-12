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

const RouteMethods = require("./routeMethods.js");

const { authenticate } = require("./middleware/authenticate.js");
const Models = require("./ModelMethods.js");

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

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

  Models.User.findByToken(token)
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

  var user = new Models.User(body);

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

  Models.User.findByCredentials(body.password)
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
  Models.createNew("Client", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.get("/clients", authenticate, (req, res) => {
  Models.getAll("Client", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.get("/clients/:id", authenticate, (req, res) => {
  Models.getById("Client", req.params.id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.delete("/clients/:id", authenticate, (req, res) => {
  Models.deleteById("Client", req.params._id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.patch("/clients/:id", authenticate, (req, res) => {
  Models.updateById(
    "Client",
    req.params._id,
    req.body,
    req.user._id,
    (doc, e) => {
      res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
    }
  );
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
      return res.send({ doc: existingUpload });
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

  res.sendFile(path);
});

// Inspector
// GET
app.get("/inspectors", authenticate, (req, res) => {
  Models.getAll("Inspector", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.get("/inspectors/:id", authenticate, (req, res) => {
  Models.getById("Inspector", req.params.id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// POST
app.post("/inspectors", authenticate, (req, res) => {
  Models.createNew("Inspector", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// PATCH
app.patch("/inspectors/:id", authenticate, (req, res) => {
  Models.updateById(
    "Inspector",
    req.params._id,
    req.body,
    req.user._id,
    (doc, e) => {
      res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
    }
  );
});

// DELETE
app.delete("/inspectors/:id", authenticate, (req, res) => {
  Models.deleteById("Delete", req.params._id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// Contractor
// GET
app.get("/contractors", authenticate, (req, res) => {
  Models.getAll("Contractor", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.get("/contractors/:id", authenticate, (req, res) =>
  Models.getById("Contractor", req.params.id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  })
);

// POST
app.post("/contractors/", authenticate, (req, res) => {
  Models.createNew("Contractor", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// PATCH
app.patch("/contractors/:id", authenticate, (req, res) => {
  Models.updateById(
    "Contractors",
    req.params._id,
    req.body,
    req.user._id,
    (doc, e) => {
      res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
    }
  );
});

// DELETE
app.delete("/contractors/:id", authenticate, (req, res) =>
  Models.deleteById("Contractor", req.params._id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  })
);

// Specs
// GET
app.get("/specs", authenticate, (req, res) => {
  Models.getAll("Spec", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.get("/specs/:id", authenticate, (req, res) =>
  Models.getById("Spec", req.params.id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  })
);

// POST
app.post("/specs/", authenticate, (req, res) => {
  Models.createNew("Spec", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.patch("/specs/:id", authenticate, (req, res) => {
  Models.updateById(
    "Spec",
    req.params._id,
    req.body,
    req.user._id,
    (doc, e) => {
      res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
    }
  );
});

app.delete("/specs/:id", authenticate, (req, res) => {
  Models.deleteById("Spec", req.params._id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// System Routes
// Get
app.get("/systems", authenticate, (req, res) => {
  Models.getAll("System", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.get("/systems/:id", authenticate, (req, res) => {
  Models.getById("System", req.params.id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// Post
app.post("/systems", authenticate, (req, res) => {
  Models.createNew("System", req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

// Patch
app.patch("/systems/:id", authenticate, (req, res) => {
  Models.updateById(
    "System",
    req.params._id,
    req.body,
    req.user._id,
    (doc, e) => {
      res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
    }
  );
});

// Delete
app.delete("/systems/:id", authenticate, (req, res) => {
  Models.deleteById("System", req.params._id, req.user._id, (doc, e) => {
    res.status(doc ? 200 : 400).send(doc ? { doc } : { e });
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Started on port ${process.env.PORT}`)
);
