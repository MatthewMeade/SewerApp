const express = require("express");
const router = express.Router();
const passport = require("passport");

// User Model
const User = require("../models/User");

// Log in with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
    successRedirect: "/",
    successFlash: "You are now logged in!"
  })
);

// Logout Handle
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
