module.exports = {
  ensureIsAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error", "Please log in to view this page");

    res.redirect("/login");
  },

  ensureIsNotAuth: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
};
