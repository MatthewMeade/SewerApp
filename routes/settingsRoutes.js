const express = require("express");
const router = express.Router();

const SettingsController = require("../controllers/SettingsController");

const { ensureIsAuth } = require("../handlers/auth");
const { catchErrors } = require("../handlers/errorHandlers");

router.use(ensureIsAuth);

router.get("/", catchErrors(SettingsController.renderSettingsPage));

router.post("/add/:type", SettingsController.upload, catchErrors(SettingsController.addTypeOption));

router.post("/delete/:type/:id", catchErrors(SettingsController.deleteTypeOption));

module.exports = router;
