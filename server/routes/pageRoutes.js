const { authenticate } = require("../middleware/authenticate.js");

const Models = require("../ModelMethods.js");

module.exports = app => {
  app.get("/", authenticate, (req, res) => {
    res.render("index.pug", {});
  });

  app.get("/loginPage", (req, res) => {
    // If user is already authenticated then redirect to /
    var token = req.cookies.token;

    if (!token) {
      return res.render("login.pug", {});
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
        res.render("login.pug", {});
      });
  });
};
