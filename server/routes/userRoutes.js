const { authenticate } = require("../middleware/authenticate.js");
const _ = require("lodash");

const { User } = require("../models/user");

module.exports = app => {
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
};
