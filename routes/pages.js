const express = require("express");
const router = express.Router();
const { ensureIsAuth, ensureIsNotAuth } = require("../handlers/auth");

router.get("/", ensureIsAuth, (req, res) => res.render("index.pug", { title: "Home" }));
router.get("/home", (req, res) => res.render("index.pug", { title: "Home" }));

router.get("/systems", ensureIsAuth, (req, res) => res.render("systems.pug", { title: "Systems" }));

router.get("/invoices", ensureIsAuth, (req, res) => res.render("invoices.pug", { title: "Invoices" }));
router.get("/settings", ensureIsAuth, (req, res) => res.render("settings.pug", { title: "Settings" }));

router.get("/login", ensureIsNotAuth, (req, res) => {
  res.render("login.pug", { title: "Login" });
});

module.exports = router;
