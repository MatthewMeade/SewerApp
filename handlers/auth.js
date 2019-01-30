module.exports = {
  ensureIsAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error", "You must be logged in to view the page you requested");

    res.redirect("/login");
  },

  ensureIsNotAuth: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
